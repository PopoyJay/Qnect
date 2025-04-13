// JWT Login (jsonwebtoken)
// In controllers/authController.js 

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
