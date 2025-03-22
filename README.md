# Qnect
A smart ticketing system

# INSTALL NODE.JS AND EXPRESS.JS
 
# Install Node.js
node -v // Shows Node.js version
npm -v // Shows nom version

# Create a New Project Folder
mkdir Qnect
cd Qnect

# Initialize a new Node.js project:
npm init -y // This creates a package.json file with default configurations

# Install Express.js
npm install express

# Create and Configure an Express.js Server
echo. > server.js // Create a new file called server.js:

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
http://localhost:5000 // You should see "Qnect API is running!"

# Install Nodemon (For Auto-Restart During Development)
# Install Nodemon globally:
npm install -g nodemon

# Run your server using Nodemon:
# Now, the server will automatically restart whenever you make changes!
nodemon server.js

# SETTING UP DATABASE WITH SEQUELIZE ORM

# Installed Required Package
npm install sequelize pg pg-hstore dotenv

# Package Explained:
# sequelize // ORM to manage SQL queries
# pg // PostgreSQL driver
# pg-hstore // Helps store JSON data
# dotenv // Loads .env file for database configuration

# Configure Environment Variables
echo. > .env

# Open .env and add:
DATABASE_URL=postgres://postgres:Sugar021498**@localhost:5432/qnect // Why? This makes Sequelize use environment variables for security.

# Initialize Sequelize & Configure Database
npx sequelize-cli init

# Open config/config.json and update the development settings:
{
  "development": {
    "username": "postgres",
    "password": "Sugar021498**",
    "database": "your_databaseQnect",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}

# Install the pg package
npm install pg pg-hstore

# Create the Database
npx sequelize-cli db:create

# Exptected Output
Database qnect created.

# Define Model Tables
# Create Users Table
npx sequelize-cli model:generate --name User --attributes username:string,password:string,role:string,email:string

# Modify Users Table
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "user" },
  });

  return User;
};

# Create Department Table
npx sequelize-cli model:generate --name Department --attributes name:string

# Modify Department Table
module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define("Department", {
    name: { type: DataTypes.STRING, allowNull: false },
  });

  return Department;
};

# Create Categories Table
npx sequelize-cli model:generate --name Category --attributes name:string,description:text

# Modify Categories Table
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
  });

  return Category;
};

# Create Ticket Table
npx sequelize-cli model:generate --name Ticket --attributes title:string,description:text,status:string,userId:integer,categoryId:integer,departmentId:integer

# Modify Ticket Table
module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define("Ticket", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "Open" },
  });

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
    Ticket.belongsTo(models.Category, { foreignKey: "categoryId", onDelete: "SET NULL" });
    Ticket.belongsTo(models.Department, { foreignKey: "departmentId", onDelete: "SET NULL" });
  };

  return Ticket;
};

# Create Comments Table
npx sequelize-cli model:generate --name Comment --attributes ticketId:integer,userId:integer,content:text

# Modify Comments Table
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    content: { type: DataTypes.TEXT, allowNull: false },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Ticket, { foreignKey: "ticketId", onDelete: "CASCADE" });
    Comment.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
  };

  return Comment;
};

# Create Notification Table
npx sequelize-cli model:generate --name Notification --attributes userId:integer,message:string,isRead:boolean

# Modify Notification Table
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    message: { type: DataTypes.STRING, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
  };

  return Notification;
};

# Run Migration (Create Tables in PostgreSQL)
npx sequelize-cli db:migrate

 # Expected Output 
Sequelize CLI [Node: 22.14.0, CLI: 6.6.2, ORM: 6.37.6]

Loaded configuration file "config\config.json".
Using environment "development".
== 20250322065623-create-user: migrating =======
== 20250322065623-create-user: migrated (0.041s)

== 20250322065843-create-department: migrating =======
== 20250322065843-create-department: migrated (0.010s)

== 20250322065950-create-category: migrating =======
== 20250322065950-create-category: migrated (0.014s)

== 20250322070135-create-ticket: migrating =======
== 20250322070135-create-ticket: migrated (0.015s)

== 20250322070238-create-comment: migrating =======
== 20250322070238-create-comment: migrated (0.013s)

== 20250322070316-create-notification: migrating =======
== 20250322070316-create-notification: migrated (0.010s)

# Test Database 
# Create a file (test-db.js)
echo. > test-db.js

# Modify tes-db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: "postgres" });

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

testConnection();
