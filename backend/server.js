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
const models = require('./models'); // Sequelize models

const app = express();

// ✅ CORS Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// ✅ Body Parser Middleware
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
  windowMs: 15 * 60 * 1000,
  max: 100,
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

// ✅ Login Route
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
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secretkey123',
      { expiresIn: '30d' }
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

// ✅ Protected test route
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: '✅ You accessed a protected route!', user: req.user });
});

// ✅ User CRUD Routes
const { User } = models;

app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error('❌ Error fetching users:', err.message);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

app.get('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('❌ Error fetching user:', err.message);
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.email = email || user.email;
    user.role = role || user.role;
    await user.save();
    res.status(200).json({ message: 'User updated', user });
  } catch (err) {
    console.error('❌ Error updating user:', err.message);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error('❌ Error deleting user:', err.message);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

// ✅ Department CRUD Routes
const { Department } = models;

app.post('/api/departments', authenticateToken, async (req, res) => {
  const { name } = req.body;
  try {
    const newDepartment = await Department.create({ name });
    res.status(201).json({ message: 'Department created', department: newDepartment });
  } catch (err) {
    console.error('❌ Error creating department:', err.message);
    res.status(500).json({ message: 'Server error creating department' });
  }
});

app.get('/api/departments', authenticateToken, async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.status(200).json(departments);
  } catch (err) {
    console.error('❌ Error fetching departments:', err.message);
    res.status(500).json({ message: 'Server error fetching departments' });
  }
});

app.get('/api/departments/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const department = await Department.findByPk(id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.status(200).json(department);
  } catch (err) {
    console.error('❌ Error fetching department:', err.message);
    res.status(500).json({ message: 'Server error fetching department' });
  }
});

app.put('/api/departments/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const department = await Department.findByPk(id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    department.name = name;
    await department.save();
    res.status(200).json({ message: 'Department updated', department });
  } catch (err) {
    console.error('❌ Error updating department:', err.message);
    res.status(500).json({ message: 'Server error updating department' });
  }
});

app.delete('/api/departments/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const department = await Department.findByPk(id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    await department.destroy();
    res.status(200).json({ message: 'Department deleted' });
  } catch (err) {
    console.error('❌ Error deleting department:', err.message);
    res.status(500).json({ message: 'Server error deleting department' });
  }
});

// ✅ Category CRUD Routes
const { Category } = models;

app.post('/api/categories', authenticateToken, async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await Category.create({ name });
    res.status(201).json({ message: 'Category created', category: newCategory });
  } catch (err) {
    console.error('❌ Error creating category:', err.message);
    res.status(500).json({ message: 'Server error creating category' });
  }
});

app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (err) {
    console.error('❌ Error fetching categories:', err.message);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

app.get('/api/categories/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    console.error('❌ Error fetching category:', err.message);
    res.status(500).json({ message: 'Server error fetching category' });
  }
});

app.put('/api/categories/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    category.name = name;
    await category.save();
    res.status(200).json({ message: 'Category updated', category });
  } catch (err) {
    console.error('❌ Error updating category:', err.message);
    res.status(500).json({ message: 'Server error updating category' });
  }
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.destroy();
    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    console.error('❌ Error deleting category:', err.message);
    res.status(500).json({ message: 'Server error deleting category' });
  }
});

// ✅ Static Priorities and Statuses (No database)
const priorities = ['Low', 'Medium', 'High', 'Urgent'];
const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

app.get('/api/priorities', authenticateToken, (req, res) => {
  res.json(priorities);
});

app.get('/api/statuses', authenticateToken, (req, res) => {
  res.json(statuses);
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
