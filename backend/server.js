// server.js

const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors()); // allow frontend requests

// MongoDB connection
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "collegeProjectDB";

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    db = client.db(dbName);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

// Routes

// Test route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Fetch all items
app.get("/items", async (req, res) => {
  try {
    const collection = db.collection("items");
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new item
app.post("/items", async (req, res) => {
  try {
    const collection = db.collection("items");
    const result = await collection.insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server after connecting to MongoDB
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`✅ Backend server running on port ${port}`);
  });
});
