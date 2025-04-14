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
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role, // 👈 include role here
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1h' }
    );

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