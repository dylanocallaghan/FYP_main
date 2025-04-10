// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const token = req.header('x-access-token');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
}

function isAdmin(req, res, next) {
  if (req.user?.accountType !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
}

module.exports = { verifyToken, isAdmin };
