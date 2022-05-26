const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
require('dotenv').config()
const client = require('./Db/MongoDb')
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000;


const app = express();

//middleware

app.use(cors());
app.use(express.json());


const productCollection = client.db("ChaosAutoParts").collection("products");
const orderCollection = client.db("ChaosAutoParts").collection("orders");



// JWT Token

function jwtTokenVerify(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ Response: 'Unauthorized Access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ Response: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}



const run = async () => {
    try {

        app.get('/products', async (req, res) => {

            const products = await productCollection.find({}).toArray()
            res.send({ success: "true", Data: products })
        })

        app.get('/products/:id', async (req, res) => {
            const productId = req.params.id

            console.log(productId);
            const product = await productCollection.findOne({ _id: ObjectId(productId) })
            if (product) {
                res.send({ success: "true", Data: product })
            } else {
                res.send({ success: "Failed" })
            }

        })

        app.get('/order', async (req, res) => {

            const userEmail = req.query.email;
            const query = { email: userEmail }
            const orders = await orderCollection.find(query).toArray()
            res.send({ success: "true", Data: orders })

        })

        app.delete('/order/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await orderCollection.deleteOne(query);
            res.send({ success: "true", Data: item })

        })


        app.post('/order', async (req, res) => {
            const newOrder = req.body.order

            const order = await orderCollection.insertOne(newOrder)
            res.send({ success: "true", Data: order })

        })



    } catch (error) {

    } finally {
        // await client.close()
    }
}

run().catch(console.dir)



app.listen(port, () => {
    console.log("Express is listening in port", port);

})



