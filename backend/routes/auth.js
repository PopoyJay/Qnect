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
