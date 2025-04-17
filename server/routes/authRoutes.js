const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerUser, loginUser } = require("../controllers/authController");
const { getMatches } = require("../controllers/matchController");
const { updateQuiz } = require("../controllers/authController");
const { forgotPassword, resetPassword } = require("../controllers/authController");

const JWT_SECRET = "secret123";

// ✅ Middleware to verify and decode token
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

// ✅ Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Fixed /me route — returns full user object
router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.patch("/update-quiz", verifyToken, updateQuiz);

const { StreamChat } = require("stream-chat");

const streamClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);


// Fetch a user by Mongo ID to get their username (used in chat logic)
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Matches
router.get("/matches", verifyToken, getMatches);

const { getCompatibleUsers } = require("../controllers/authController");
router.get("/match/compatible-users", verifyToken, getCompatibleUsers);

module.exports = router;
