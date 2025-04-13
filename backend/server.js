require('dotenv').config();  // Load environment variables from .env file first

const express = require("express");  // Import Express
const app = express();  // Create an Express app

const PORT = process.env.PORT || 5000;  // Define a port

// Define a basic route
app.get("/", (req, res) => {
    res.send("Qnect!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});