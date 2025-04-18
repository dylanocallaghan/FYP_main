const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

// verifyToken functioin for authorization
function verifyToken(req, res, next) {
  const bearer = req.header("Authorization");
  const token = bearer?.startsWith("Bearer ") ? bearer.split(" ")[1] : req.header("x-access-token");

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
}

// Check if the account has an admin login
function isAdmin(req, res, next) {
  if (req.user?.accountType !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
}

module.exports = { verifyToken, isAdmin };
