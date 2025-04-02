const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { getMatches } = require("../controllers/matchController");


const JWT_SECRET = "secret123";

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, quizResponses } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, quizResponses });
    await user.save();
    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed", details: err });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ error: "Invalid email" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

// Protected dashboard route
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}!` });
});

// Get full profile of another user
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "name email quizResponses");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile", err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Optional: Get logged-in user's own profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "name email quizResponses");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch your profile" });
  }
});

router.get("/matches", verifyToken, getMatches);

module.exports = router;
