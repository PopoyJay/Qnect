// Load environment variables from .env file
require('dotenv').config();

// const fs = require('fs');
// const https = require('https');
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
const { Ticket } = require('./models'); // ✅ This gets the actual Sequelize model instance
const departmentRoutes = require('./routes/department');
const categoryRoutes = require('./routes/category');

const app = express();

app.set('trust proxy', 1); // 1 = trust first proxy

// ✅ CORS Middleware
app.use(cors({
  origin: 'https://qnect.onrender.com',
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

// SSL Certificate Options for HTTPS
// const sslOptions = {
  // key: fs.readFileSync('C:/Users/Jeson Cabrera/server.key'),   // Replace with your private key
  // cert: fs.readFileSync('C:/Users/Jeson Cabrera/server.crt'),  // Replace with your certificate
  // ca: fs.readFileSync('C:/Users/Jeson Cabrera/ca.crt'),        // (Optional) If you have a CA certificate
// };

// Set up HTTPS server
// https.createServer(sslOptions, app).listen(443, () => {
  // console.log("HTTPS server running on port 443");
// });

// Optional: Redirect HTTP to HTTPS
// const http = require('http');
// http.createServer((req, res) => {
  // res.writeHead(301, { "Location": `https://${req.headers.host}${req.url}` });
  // res.end();
// }).listen(80, () => {
  // console.log("Redirecting HTTP to HTTPS on port 80");
// });

// ✅ Register Route (PostgreSQL + Validation)
app.post('/api/register', async (req, res) => {
  const { email, password, username, role } = req.body;

  // Validate required fields
  if (!email || !password || !username || !role) {
    return res.status(400).json({
      message: 'All fields (email, password, username, role) are required'
    });
  }

  // Validate allowed roles
  const allowedRoles = ['support', 'agent'];
  if (!allowedRoles.includes(role.toLowerCase())) {
    return res.status(400).json({
      message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`
    });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user
    const result = await pool.query(
      `INSERT INTO users (email, username, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, role`,
      [email, username, hashedPassword, role.toLowerCase()]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0]
    });

  } catch (err) {
    console.error('❌ Registration error details:', err.message);
    res.status(500).json({
      message: 'Server error during registration',
      error: err.message
    });
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

// ✅ Ticket CRUD with static priorities + categoryId + departmentId
app.post('/api/tickets', authenticateToken, async (req, res) => {
  const { subject, description, status, agent, priority, categoryId, departmentId } = req.body;
  const allowedPriorities = ['Urgent', 'High', 'Medium', 'Low'];

  if (!allowedPriorities.includes(priority)) {
    return res.status(400).json({ message: 'Invalid priority level.' });
  }

  try {
    const ticket = await Ticket.create({
      subject,
      description,
      status,
      agent: agent || "Unassigned",
      priority,
      categoryId,
      departmentId,
      userId: req.user.userId
    });
    res.status(201).json({ message: 'Ticket created', ticket });
  } catch (err) {
    console.error('❌ Error creating ticket:', err);
    res.status(500).json({ message: 'Server error creating ticket' });
  }
});

app.get('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Category, as: 'category' },
        { model: Department, as: 'department' }
      ],
      order: [['createdAt', 'DESC']]    
    });
    res.status(200).json(tickets);
  } catch (err) {
    console.error('❌ Error fetching tickets:', err);
    res.status(500).json({ message: 'Server error fetching tickets' });
  }
});

app.get('/api/tickets/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await models.Ticket.findByPk(req.params.id, {
      include: [
        { model: models.Department, as: 'department' }, // ✅ REQUIRED alias
        { model: models.Category, as: 'category' },     // ✅ REQUIRED alias
        { model: models.User, as: 'user' },             // ✅ REQUIRED alias
      ],
    });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.status(200).json(ticket);
  } catch (err) {
    console.error('❌ Error fetching ticket:', err);
    res.status(500).json({ message: 'Server error fetching ticket' });
  }
});

app.put('/api/tickets/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { subject, description, priority, categoryId, departmentId } = req.body;
  const allowedPriorities = ['Urgent', 'High', 'Medium', 'Low'];

  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority level.' });
    }

    ticket.subject = subject || ticket.subject;
    ticket.description = description || ticket.description;
    ticket.priority = priority || ticket.priority;
    ticket.categoryId = categoryId || ticket.categoryId;
    ticket.departmentId = departmentId || ticket.departmentId;

    await ticket.save();
    res.status(200).json({ message: 'Ticket updated', ticket });
  } catch (err) {
    console.error('❌ Error updating ticket:', err);
    res.status(500).json({ message: 'Server error updating ticket' });
  }
});

app.delete('/api/tickets/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    await ticket.destroy();
    res.status(200).json({ message: 'Ticket deleted' });
  } catch (err) {
    console.error('❌ Error deleting ticket:', err);
    res.status(500).json({ message: 'Server error deleting ticket' });
  }
});

// ✅ Protected test route
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: '✅ You accessed a protected route!', user: req.user });
});

// ✅ User CRUD Routes
const { User } = models;

app.post('/api/users', authenticateToken, async (req, res) => {
  const { email, password, username, role } = req.body;

  if (!email || !password || !username || !role) {
    return res.status(400).json({ message: 'All fields (email, password, username, role) are required' });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      role: role.toLowerCase()
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    console.error('❌ Error creating user:', err.message);
    res.status(500).json({ message: 'Server error creating user' });
  }
});

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

app.put('/api/user/:id', async (req, res) => {
  const { id } = req.params;
  const { email, username, role } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Optionally validate role
    const allowedRoles = ['support', 'agent'];
    if (role && !allowedRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ message: `Invalid role.` });
    }

    // Update fields
    user.email = email || user.email;
    user.username = username || user.username;
    user.role = role ? role.toLowerCase() : user.role;

    await user.save();

    res.json({
      message: 'User updated successfully.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Update user error:', err);
    res.status(500).json({ message: 'Server error updating user.' });
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

// Create a ticket with new fields
app.post('/api/tickets', authenticateToken, async (req, res) => {
  const { subject, description, status, priority, departmentId, categoryId, assignedTo, attachment } = req.body;

  try {
    const newTicket = await models.Ticket.create({
      subject,
      description,
      status,
      priority,
      departmentId,
      categoryId,
      assignedTo,
      attachment,
    });

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket: newTicket,
    });
  } catch (err) {
    console.error('❌ Error creating ticket:', err.message);
    res.status(500).json({ message: 'Server error creating ticket' });
  }
});

// Fetch all tickets with the additional fields
app.get('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const tickets = await models.Ticket.findAll({
      include: [
        { model: models.Department, as: 'department' },
        { model: models.Category },
        { model: models.User, as: 'assignedTo' },  // Assuming 'assignedTo' is a user
      ],
    });
    res.status(200).json(tickets);
  } catch (err) {
    console.error('❌ Error fetching tickets:', err.message);
    res.status(500).json({ message: 'Server error fetching tickets' });
  }
});

// Fetch a single ticket by ID
app.get('/api/tickets/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await models.Ticket.findByPk(id, {
      include: [
        { model: models.Department, as: 'department' },
        { model: models.Category, as: 'category' },
        { model: models.User, as: 'user' },
      ],
    });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.status(200).json(ticket);
  } catch (err) {
    console.error('❌ Error fetching ticket:', err.message);
    res.status(500).json({ message: 'Server error fetching ticket' });
  }
});

// Update a ticket with new fields
app.put('/api/tickets/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { subject, description, status, priority, departmentId, categoryId, assignedTo, attachment } = req.body;

  try {
    const ticket = await models.Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.subject = subject || ticket.subject;
    ticket.description = description || ticket.description;
    ticket.status = status || ticket.status;
    ticket.priority = priority || ticket.priority;
    ticket.departmentId = departmentId || ticket.departmentId;
    ticket.categoryId = categoryId || ticket.categoryId;
    ticket.assignedTo = assignedTo || ticket.assignedTo;
    ticket.attachment = attachment || ticket.attachment;

    await ticket.save();
    res.status(200).json({ message: 'Ticket updated', ticket });
  } catch (err) {
    console.error('❌ Error updating ticket:', err.message);
    res.status(500).json({ message: 'Server error updating ticket' });
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

// ✅ Ticket Routes (modularized)
const ticketRoutes = require('./routes/tickets');
app.use('/api/tickets', authenticateToken, ticketRoutes);

// Routes
app.use('/departments', departmentRoutes);
app.use('/categories', categoryRoutes);

// ✅ Dashboard Stats Route
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const total = await Ticket.count(); // Count all tickets

    const open = await Ticket.count({ where: { status: 'Open' } });
    const inProgress = await Ticket.count({ where: { status: 'In Progress' } });
    const onHold = await Ticket.count({ where: { status: 'On Hold' } });
    const closed = await Ticket.count({ where: { status: 'Closed' } });

    res.json({
      total,
      open,
      inProgress,
      onHold,
      closed,
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
