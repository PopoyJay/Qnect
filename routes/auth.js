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