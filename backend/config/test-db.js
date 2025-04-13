'use strict';

const { Sequelize } = require('sequelize');
require('dotenv').config(); // Ensure the environment variables are loaded

const config = require('../config/config.json')['development']; // Adjust the environment if needed

// Initialize Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

// Function to test the connection
async function testConnection() {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    // Close the connection after test
    await sequelize.close();
  }
}

testConnection();
