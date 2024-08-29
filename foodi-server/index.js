const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 6001;
//const mongoose = require("mongoose");
//const jwt = require('jsonwebtoken');
require('dotenv').config()
//const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//console.log(process.env.DB_USER) // remove this after you've confirmed it is working

//middleware
app.use(cors());
app.use(express.json());

// username: cdyniranjan7321
// password: bxz20nSVbvUrTZQG

// mongodb config


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ffne7xu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    // database & collections
      const menuCollections = client.db("demo-foodi-client").collection("menus");
      const cartCollections = client.db("demo-foodi-client").collection("cartItems")
      const userCollections = client.db("demo-foodi-client").collection("users");


{/*
   // stripe payment routes
   // create a PaymentIntent with the order amount and currency
   app.post("/create-payment-intent", async (req, res)=>{
    const { price }= req.body;
    const amount= price+100;

    // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
    });
       
*/}
      


{/* 
  //jwt  authentication
      app.post('/jwt', async(req,res) =>{
        const user = req.body;
        const token = jwt.sign(user, token, {
          expiresIn: '1hr'
        })
        res.send({token});
      })
        */}
     

        // User operations
    app.get('/users', async (req, res) => {
      const result = await userCollections.find().toArray();
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollections.insertOne(user);
      res.send(result);
    });

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await userCollections.findOne(filter);
      res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await userCollections.deleteOne(filter);
      res.send(result);
    });

    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const { name, email, password } = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          name,
          email,
          password,
        },
      };
      const result = await userCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    });
     

      //all menu items operations
      app.get('/menu', async(req, res) => {
        const result = await menuCollections.find().toArray();
        res.send(result)
      })

      //all carts operations

      //posting cart to db
      app.post( '/carts', async(req, res) => {
        const cartItem = req.body;
        const result = await cartCollections.insertOne(cartItem);
        res.send(result)
      })

      //get carts using email
      app.get('/carts', async(req, res) => {
        const email = req.query.email;
        const filter = {email: email};
        const result = await cartCollections.find(filter).toArray();
        res.send(result)
      })

      //get specific carts
      app.get('/carts/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const result = await cartCollections.findOne(filter);
        res.send(result)
      })

      //delete item from cart
      app.delete('/carts/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const result = await cartCollections.deleteOne(filter)
        res.send(result)
      })

      // update carts quantity
      app.put('/carts/:id', async(req, res) => {
        const id= req.params.id;
        const {quantity}= req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert : true };

        const updateDoc = {
          $set: {
            quantity: parseInt(quantity, 10),
          },
        };
        // Update the first document that matches the filter
        const result = await cartCollections.updateOne(filter, updateDoc, options);
        res.send(result)
      });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send('Hello Foodi Client Server!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

