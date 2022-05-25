
const { MongoClient, ServerApiVersion } = require('mongodb');



const uri = `mongodb+srv://${process.env.mongo_username}:${process.env.mongo_password}@cluster0.4z1rh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


try {

    client.connect()
    console.log("DB connected");

} catch (error) {
    console.log('DB Error', error);
}


module.exports = client