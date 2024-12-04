const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const cors = require('cors')
const app = express()
const port = process.env.port || 5000;


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.t241ufd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
  //  await client.connect();
    // Send a ping to confirm a successful connection

    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    const userCollections =client.db("bisrtoDB").collection("user")
    const menuCollections =client.db("bisrtoDB").collection("menu")
    const cartCollections =client.db("bisrtoDB").collection("cart")

    app.get("/menu" , async (req , res ) => {
      const result = await menuCollections.find().toArray()
      res.send(result)
    })

    //cart related api 

    app.get('/cart' , async( req, res) => {
      const email = req.query.email;
      const query = { email : email }
      const result = await cartCollections.find(query).toArray()
      res.send(result)
   
    })

    app.post('/user' , async(req , res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollections.insertOne(user);
      res.send(result)
    })

    app.post('/cart' , async (req , res) => {
      const item = req.body;
      const result = await cartCollections.insertOne(item)
      res.send(result)
    })

    app.delete('/cart/:id' , async(req , res ) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await cartCollections.deleteOne(query);
      res.send(result)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/' , (req, res) => {
  res.send("boss is sitting")
  
})

app.listen(port , () => {
  console.log(`bistro on ${port}`);
})