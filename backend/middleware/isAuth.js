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
