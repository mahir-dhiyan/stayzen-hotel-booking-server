const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwwdqjn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected successfully to MongoDB!");

    const roomsCollection = client.db("stayZen").collection("rooms");

    // Fetch rooms from MongoDB
    app.get("/rooms", async (req, res) => {
      try {
        const rooms = await roomsCollection.find().toArray();
        res.send(rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).send("Failed to fetch rooms");
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged the database. MongoDB connection confirmed!");

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("StayZen is running");
});


app.listen(port, () => {
  console.log(`StayZen Server is running on port ${port}`);
});
