// Load environment variables from .env file
require('dotenv').config();

const express = require("express");
const helmet = require("helmet");
const morgan = require('morgan');
const winston = require('winston');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// ✅ CORS Middleware — MUST come before routes and helmet
// Enable CORS for all routes (for development purposes)
app.use(cors({
  origin: 'http://localhost:3000', // Allow your frontend to connect
  credentials: true,  // Allow cookies or credentials to be sent with the request
}));

// ✅ Body parser (also before routes)
app.use(express.json());

// ✅ PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ✅ DB Connection Test
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected successfully:', res.rows);
  }
});

// ✅ Helmet for security
app.use(helmet());

// ✅ Logging with winston + morgan
const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: 'combined.log' })],
});
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) },
}));

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,  // Limit each IP to 100 requests per windowMs
  message: '⚠️ Too many requests from this IP, try again later.'
});
app.use('/api/', limiter);

// ✅ Register Route
app.post('/api/register', async (req, res) => {
  const { email, password, role = 'user' } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    console.error('❌ Registration error details:', err.message);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});

// ✅ Login Route (integrated)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Wrong email address' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role }, // You can include more details here if needed
      process.env.JWT_SECRET || 'secretkey123',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ✅ Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'secretkey123', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ✅ Protected route
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: '✅ You accessed a protected route!', user: req.user });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
