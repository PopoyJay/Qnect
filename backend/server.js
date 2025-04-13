// Load environment variables from .env file
require('dotenv').config();

// Import Express and create an app
const express = require("express");
const app = express();

// Import rate limiter middleware
const rateLimit = require('express-rate-limit');

// Add Rate Limiter Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,     // 15 minutes
  max: 100,                     // Limit each IP to 100 requests per windowMs
  message: '⚠️ Too many requests from this IP, please try again after 15 minutes.'
});

// Apply the rate limiter to **all API routes starting with /api/**
app.use('/api/', limiter);
// You can change '/api/' to '/' if you want it to apply to everything

// Define a port
const PORT = process.env.PORT || 5000;

// Define a basic route
app.get("/", (req, res) => {
    res.send("Qnect!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
