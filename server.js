const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection URI
// const uri = process.env.MONGODB_URI;
// const uri = "mongodb+srv://gaurav0@cluster0.cepgukq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB client instance
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let jobCollection;

async function connectToMongoDB() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    // Access the database and collection
    const database = client.db('JobBoard'); // Replace with your database name
    jobCollection = database.collection('Job_Db'); // Replace with your collection name

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Endpoint to get all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await jobCollection.find().toArray();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start MongoDB connection and server
connectToMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
