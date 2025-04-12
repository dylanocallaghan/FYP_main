const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { StreamChat } = require("stream-chat");


const JWT_SECRET = "secret123";

// 🔑 Stream credentials from .env
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

exports.registerUser = async (req, res) => {
  const {
    name,
    email,
    username,
    password,
    quizResponses,
    accountType,
    gender,
    pronouns,
    age,
    course,
    year,
    smoking,
    drinking,
    pets,
    openTo,
    bio
  } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser && existingUser.isDeleted) {
      existingUser.isDeleted = false;
      existingUser.password = await bcrypt.hash(password, 10);
      await existingUser.save();
    } else if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    } else {
      const user = new User({
        name,
        email,
        username,
        password,
        accountType,
        quizResponses,
        gender,
        pronouns,
        age,
        course,
        year,
        smoking,
        drinking,
        pets,
        openTo,
        bio
      });

      await user.save();
    }

    await streamClient.upsertUser({
      id: username,
      name,
      accountType,
    });

    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed", details: err });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ error: "Invalid email" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, email: user.email, accountType: user.accountType },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
  

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      accountType: user.accountType,
    },
  });
};

exports.updateQuiz = async (req, res) => {
  try {
    console.log("🔥 Incoming quiz data:", req.body);
    console.log("🔐 Decoded user ID:", req.user.id);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        quizResponses: req.body.quizResponses,
        priorityOrder: req.body.priorityOrder,
      },
      { new: true }
    ).select("-password");

    if (!user) {
      console.warn("⚠️ User not found in DB");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Quiz updated for user:", user.username);
    res.json(user);
  } catch (err) {
    console.error("❌ Failed to update quiz:", err);
    res.status(500).json({ error: "Failed to update quiz." });
  }
};


