// Vercel Serverless Function Handler
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("../backend/src/app");

// MongoDB connection cache for serverless
let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("Using cached database connection");
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    cachedConnection = conn;
    console.log("New MongoDB connection established");
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Export Vercel Serverless Handler
module.exports = async (req, res) => {
  try {
    // Remove /api prefix from path for Express routing
    req.url = req.url.replace(/^\/api/, '');

    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
