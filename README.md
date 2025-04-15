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
node server.

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

# --------------------------------------------------------------------------------------------------------------------------------------------

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

# Connect PostgreSQL to Node.js
# Install pg (PostgreSQL Client for Node.js)
npm install pg

# Create a Database Connection File (db.js)
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",  // Ensure this matches your PostgreSQL user
  host: "localhost",
  database: "Qnect", // Ensure this database exists
  password: "Sugar021498**", // Ensure this matches your database password
  port: 5432,  // Default PostgreSQL port
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database!");
});

// Add error logging
pool.on("error", (err) => {
  console.error("❌ Database connection error:", err);
});

module.exports = pool;

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

# Run the test script
node test-db.js

# If everything is set up correctly, you should see:
✅ Connected to PostgreSQL database!
Database Connected Successfully: { now: 2025-03-22T08:10:07.314Z }

# ---------------------------------------------------------------------------------------------------------------------------------------------

# SECURITY

# PPROJECT SETUP (Initial)
  npm init -y
  npm install express sequelize bcryptjs jsonwebtoken express-rate-limit dotenv helmet express-validator cors passport passport-google-oauth20 morgan winston cookie-parser
  # Packages Explained:
    # express - A fast, unopinionated web framework for Node.js.
    # sequelize - A promise-based ORM (Object-Relational Mapping) for SQL databases.
    # bcryptjs - Securely hashes passwords before storing them.
    # jsonwebtoken - Generates and verifies JWT tokens
    # express-rate-limit -Helps prevent brute-force attacks by limiting repeated requests (e.g., login attempts).
    # dotenv - Loads variables from a .env file (like DB credentials, secrets).
    # helmet - Secures your app by setting various HTTP headers.
    # express-validator - Validates and sanitizes user inputs (like form fields).
    # cors - Stands for Cross-Origin Resource Sharing.Allows your React frontend (e.g., localhost:3000) to talk to your Express backend (e.g., localhost:5000).
    # passport & passport-jwt - Middleware for handling authentication strategies.
    # passport-google-oauth20 - OAuth strategy for Google login using Passport.
    # morgan - HTTP request logger middleware.
    # winston - Powerful logging tool for your application.
    # cookie-parser - Parses cookies sent by the client in the request headers.

# 1.FILE STRUCTURE
  Qnect/
├── config/
│   └── passport.js
├── middleware/
│   ├── auth.js
│   └── role.js
├── models/
│   └── User.js
├── routes/
│   ├── auth.js
│   └── tickets.js
├── .env
├── server.js

# 2.AUTHENTICATION & AUTHORIZATION
  # 2.1 Bcrypt Password Hashing
// In routes/auth.js

// Password Hashing During User Registration (with Explanation)
const bcrypt = require('bcryptjs'); // Library for hashing passwords securely
const { User } = require('../models'); // Sequelize User model (adjust path if needed)

// Hash the user's plain-text password
const hashedPassword = await bcrypt.hash(req.body.password, 12);

// Why bcrypt.hash(password, 12)?
    // req.body.password: This is the plain-text password from the user.
    // 12: This is the salt rounds – it defines how complex the hash is.
        // More rounds = more secure (but slightly slower).
        // 12 is a common, safe choice that balances speed and security.

// Save the new user to the database with the hashed password
await User.create({
  username: req.body.username,  // user's chosen username
  email: req.body.email,        // user's email
  password: hashedPassword,     // hashed version, never store plain-text passwords
});

// PURPOSE:
    // It's used to hash the user's password before saving it to your database. This is a best practice in authentication systems to protect user data.

// Why hashing is important:
    // If your database is ever compromised, the attacker can't see the real passwords.
    // You never store passwords in plain text — only hashed versions.

  # 2.2 JWT Login (jsonwebtoken)
// In routes/auth.js - add this code

const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login);

module.exports = router;

// In controllers/authController.js - inser this code

const jwt = require('jsonwebtoken');        // Library to generate & verify JWT tokens
const bcrypt = require('bcrypt');           // Library to compare hashed passwords
const { User } = require('../models');      // Sequelize User model

// Login Controller Function
const login = async (req, res) => {
  // Step 1: Extract email and password from request body
  const { email, password } = req.body;

  try {
    // Step 2: Look for a user in the database with the provided email
    const user = await User.findOne({ where: { email } });

    // If no user found, respond with 401 Unauthorized
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Step 3: Use bcrypt to compare the entered password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);

    // If password doesn't match, respond with 401 Unauthorized
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Step 4: Generate a JSON Web Token (JWT)
    const token = jwt.sign(
      {
        id: user.id,          // Payload: user ID
        role: user.role       // You can include more fields if needed (e.g., username)
      },
      process.env.JWT_SECRET, // Secret key used to sign the token (must be stored in .env)
      {
        expiresIn: '1h'       // Token will expire in 1 hour (common security practice)
      }
    );

    // Step 5: Send back the token and user data (without password!)
    res.json({
      token, // JWT token — frontend will store this to access protected routes
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    // Catch and log any server/database errors
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export the login function so it can be used in routes
module.exports = { login };

// In .env - add this 
JWT_SECRET=my_super_secret_key_123

// In server.js - add this to on top of the code 
require('dotenv').config();  // Load environment variables from .env file first
  
  # 2.3 Express Rate Limiter
// In server.js

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

# 3.GOOGLE SSO SETUP
  # 3.1. add this to .env file
GOOGLE_CLIENT_ID=your_client_id_here          // Identifies your app to Google. You get this when you register your app on Google Cloud.       
GOOGLE_CLIENT_SECRET=your_client_secret_here  // Used to authenticate your app with Google securely. Think of it as your app’s password.

  # 3.2. config/passport.js
// Import necessary packages
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20'); // Google OAuth 2.0 strategy from passport
const User = require('../models/User');  // Sequelize model to interact with your User table

// Configure Google OAuth 2.0 Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,         // Google client ID fetched from environment variables.
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from environment variables.
  callbackURL: '/auth/google/callback',           // URL where Google will redirect after authentication.
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create the user in your database based on the Google profile ID
    const [user, created] = await User.findOrCreate({
      where: { googleId: profile.id },  // Match the user's Google ID with the ID in your User table.
      defaults: {                       // If user doesn't exist, create them with the following info.
        username: profile.displayName,   // Set the username from the Google profile
        email: profile.emails[0].value,  // Use the email from the Google profile
        googleId: profile.id,           // Store the Google ID for future logins
        profilePic: profile.photos && profile.photos.length ? profile.photos[0].value : null,  // Store the user's profile picture, if available
      },
    });

    // If the user was created, you can add additional logic here (e.g., sending a welcome email)
    if (created) {
      console.log(`New user created: ${user.username}`);
    }

    // Pass the user to the next step in the authentication process
    return done(null, user);  // Pass the user object to serialize
  } catch (error) {
    // Handle any errors that may occur during user lookup or creation
    return done(error);  // If an error occurs, pass it to the done callback to handle the failure
  }
}));

// Serialize the user for storing in session
passport.serializeUser((user, done) => {
  // Store only the user ID in the session
  done(null, user.id);  // Store only the user ID in the session to keep it lightweight
});

// Deserialize the user based on the ID stored in the session
passport.deserializeUser(async (id, done) => {
  try {
    // Retrieve the full user data from the database using the user ID stored in the session.
    const user = await User.findByPk(id);  // Fetch the user from the database using Sequelize
    done(null, user);  // Pass the user object to the next middleware
  } catch (error) {
    // If an error occurs while deserializing, handle it
    done(error);  // Pass the error to the done callback
  }
});

  # 3.3 Route 
  // In routes/auth.js

// Google OAuth Route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback Route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Regular login route (for JWT login)
router.post('/login', login);

// Optional: Register route
router.post('/register', register);

module.exports = router;

# 4. INPUT VALIDATION & SANITIZATION (EXPRESS-VALIDATION) (Updated Codes)
// In routes/auth.js

// routes/auth.js
const express = require('express');
const passport = require('passport');
const { body } = require('express-validator');
const { login, register } = require('../controllers/authController');

const router = express.Router();

// Google OAuth Routes
// Route to initiate Google OAuth authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route, which is triggered after successful authentication with Google
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Regular login route (for JWT login)
router.post('/login', login);

// ✅ Registration Route with Validation Middleware
// 1. Validation with express-validator to ensure correct data format
//    - email must be valid
//    - password must be at least 6 characters long
router.post('/register', [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], register);

module.exports = router;

// Controllers/authController.js

// controllers/authController.js
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { validationResult } = require('express-validator');

// Register function
exports.register = async (req, res) => {
  // 1. Validate inputs using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // 2. Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // 3. Hash the user's plain-text password securely
    const hashedPassword = await bcrypt.hash(password, 12);

    // Why bcrypt.hash(password, 12)?
    // req.body.password: This is the plain-text password from the user.
    // 12: This is the salt rounds – it defines how complex the hash is.
    //     More rounds = more secure (but slightly slower).
    //     12 is a common, safe choice that balances speed and security.

    // 4. Create the user with the hashed password
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // PURPOSE:
    // It's used to hash the user's password before saving it to your database. This is a best practice in authentication systems to protect user data.

    // Why hashing is important:
    // If your database is ever compromised, the attacker can't see the real passwords.
    // You never store passwords in plain text — only hashed versions.

    // 5. Respond with success (no plain password returned)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Login function (JWT-based login example)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 2. Compare the hashed password with the plain-text password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 3. Create JWT (example with jsonwebtoken)
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret_key', { expiresIn: '1h' });

    // 4. Send the JWT as a response
    res.status(200).json({
      message: 'Login successful',
      token,
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

# 5. HELMET + CSP HEADERS
// In server.js

const helmet = require('helmet');

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);

//Update Code in Server.js with Helmet

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

# 6.RBAC MIDDLEWARE

// middleware/role.js

module.exports = function (roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Access Denied' });
    next();
  };
};

// Create middleware/isAuth.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if Authorization header is present
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

  try {
    // 2. Verify token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

    // 3. Attach user info to request for further use
    req.user = decoded;

    next(); // Call next middleware (e.g., role check)
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Update login in authController.js

const token = jwt.sign(
  {
    userId: user.id,
    role: user.role,  // 👈 make sure this is included
  },
  process.env.JWT_SECRET || 'your_jwt_secret_key',
  { expiresIn: '1h' }
);

// Full updated login function in authController.js

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role, // 👈 important for RBAC
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

# 7. SESSION & COOKIE SETTINGS (HOLD FOR NOW)
  # Install cookie-parser (if not yet)
  npm install cookie-parser

  # Add this near the top of your server.js, after express and before routes/middleware:
  const cookieParser = require('cookie-parser');

app.use(cookieParser());

res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 3600000,
});

# 8. LOGGING WITH WINSTON + MORGAN
// In Server.js

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

// Updated Server.js with Winston and Morgan

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

# 9. DATABASE SECURITY
// Sequelize ORM already uses parameterized queries internally
// Secure: Sequelize uses parameterized queries, preventing SQL injection
await User.findOne({ where: { email: req.body.email } });

# -------------
  # FRONTEND
# -------------







# -------------------------------------------------------------------------------------------------------------------------------------------------
# GITHUB SETUP
# Connect Local Project to Github
  # 1. Open Git Bash/Terminal inside your project folder:
      cd path/to/your/project
  # 2. Initialize Git in the project:
      git init
  # 3. Add all files to Git:
      git add .
  # 4. Commit the changes:
      git commit -m "Initial commit"
  # 5. Link your project to the GitHub repository:
      git remote add origin https://github.com/popoyjay/qnect.git
  # 6. Push the changes to GitHub:
      git push -u origin main
# After making changes, follow this process to update your GitHub repo:
  git add .
  git commit -m "Updated feature X"
  git push origin main
# To pull the latest changes from GitHub (if working on multiple devices):
  git pull origin main