// Load environment variables from .env file
require('dotenv').config();

// Import Express and create an app
const express = require("express");
const app = express();

// Import Helmet for security
const helmet = require("helmet");

// Import rate limiter middleware
const rateLimit = require('express-rate-limit');

// ✅ Use Helmet Middleware for security headers
app.use(helmet());

// ✅ Optional: Configure Content Security Policy (CSP)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com"], // For Google OAuth
      styleSrc: ["'self'", "'unsafe-inline'"],          // Allow inline styles
    },
  })
);

// ✅ Middleware to parse JSON request bodies
app.use(express.json());

// ✅ HTTP Logging Middleware
const morgan = require('morgan');
const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// ✅ Rate Limiter Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,     // 15 minutes
  max: 100,                     // Limit each IP to 100 requests per windowMs
  message: '⚠️ Too many requests from this IP, please try again after 15 minutes.'
});
app.use('/api/', limiter); // Apply rate limiting to /api/* routes

// ✅ Define a basic route
app.get("/", (req, res) => {
    res.send("Qnect!");
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
