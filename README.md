# Qnect
A smart ticketing system

# Install Node.js
# Check if Node.js is installed
# Shows Node.js version
node -v
# Shows npm version
npm -v

# Create a New Project Folder
mkdir Qnect
cd Qnect

# Initialize a new Node.js project:
# This creates a package.json file with default configurations
npm init -y

# Create and Configure an Express.js Server
# Create a new file called server.js:
echo. > server.js 

# Open server.js in a code editor and add this code:
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

# Run the Express Server
# In the terminal, start the server:
node server.js

# You should see this message:
Server is running on port 5000

# Test the API by opening a browser and visiting:
http://localhost:5000

# Install Nodemon (For Auto-Restart During Development)
# Install Nodemon globally:
npm install -g nodemon

# Run your server using Nodemon:
# Now, the server will automatically restart whenever you make changes!
nodemon server.js