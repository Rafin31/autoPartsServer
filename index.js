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

            const product = await productCollection.findOne({ _id: ObjectId(productId) })
            res.send({ success: "true", Data: product })

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



