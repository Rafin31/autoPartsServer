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
const reviewCollection = client.db("ChaosAutoParts").collection("reviews");
const userCollection = client.db("ChaosAutoParts").collection("users");



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

        app.post('/products', async (req, res) => {

            const product = req.body.product
            const products = await productCollection.insertOne(product)
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
        app.delete('/products/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.deleteOne(query);
            res.send({ success: "true", Data: id })
        })

        app.put('/delivered/:id', async (req, res) => {

            const productId = req.params.id;
            const filter = { _id: ObjectId(productId) }
            const option = { upsert: false }
            const updatedInfo = {
                $set: {
                    paymentStatus: "shipped"
                }
            }
            const result = await orderCollection.updateOne(filter, updatedInfo, option)
            res.send({ success: "Success", Data: result })

        })

        app.get('/orders', async (req, res) => {

            const orders = await orderCollection.find({}).toArray()
            res.send({ success: "true", Data: orders })

        })

        app.get('/order', async (req, res) => {

            const userEmail = req.query.email;
            const query = { email: userEmail }
            const orders = await orderCollection.find(query).toArray()
            res.send({ success: "true", Data: orders })

        })

        app.post('/order', async (req, res) => {
            const newOrder = req.body.order

            const order = await orderCollection.insertOne(newOrder)
            res.send({ success: "true", Data: order })

        })

        app.delete('/order/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await orderCollection.deleteOne(query);
            res.send({ success: "true", Data: item })

        })



        app.post('/review', async (req, res) => {
            const newReview = req.body.review

            const review = await reviewCollection.insertOne(newReview)
            res.send({ success: "true", Data: review })

        })

        app.get('/users', async (req, res) => {

            const users = await userCollection.find({}).toArray()
            res.send({ success: "true", Data: users })
        })

        app.post('/users', async (req, res) => {
            const newUser = req.body.user

            const query = { email: newUser.email }
            const isUser = await userCollection.findOne(query)

            if (isUser) {
                res.send({ success: "true", res: "user already exist" })
            } else {
                const user = await userCollection.insertOne(newUser)
                res.send({ success: "true", Data: user })
            }
        })
        app.put('/makeAdmin/:id', async (req, res) => {

            const userId = req.params.id;
            const filter = { _id: ObjectId(userId) }
            const option = { upsert: false }
            const updatedInfo = {
                $set: {
                    role: "admin"
                }
            }
            const result = await userCollection.updateOne(filter, updatedInfo, option)
            res.send({ success: "Success", Data: result })
        })

        app.get('/users/:email', async (req, res) => {

            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.find(query).toArray()
            res.send({ success: "true", Data: user })

        })
        app.put('/users/:email', async (req, res) => {

            const userEmail = req.params.email;
            const user = req.body.data
            const filter = { email: userEmail }
            const option = { upsert: false }
            const updatedInfo = {
                $set: {
                    phoneNumber: user.number,
                    address: user.address,
                    linkdinLink: user.linkdin,
                }
            }
            const result = await userCollection.updateOne(filter, updatedInfo, option)
            res.send({ success: "Success", Data: result })

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



