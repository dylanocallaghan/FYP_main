const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { StreamChat } = require("stream-chat");


const JWT_SECRET = "secret123";

//  Stream credentials from .env
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

const crypto = require("crypto");

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

// Login function
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

// excxport the data for the quiz
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

// fetch compatibleUsers
exports.getCompatibleUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || !currentUser.quizResponses || !currentUser.priorityOrder) {
      return res.status(400).json({ message: "Incomplete quiz data." });
    }

    const allUsers = await User.find({ _id: { $ne: req.user.id }, accountType: "student" });

    const totalQuestions = currentUser.priorityOrder.length;
    const weights = {};
    currentUser.priorityOrder.forEach((key, index) => {
      weights[key] = totalQuestions - index;
    });

    const results = allUsers.map((user) => {
      let totalWeightedDiff = 0;
      let totalWeight = 0;

      currentUser.priorityOrder.forEach((key) => {
        const userAnswer = user.quizResponses?.[key];
        const myAnswer = currentUser.quizResponses?.[key];
        if (userAnswer != null && myAnswer != null) {
          const diff = Math.abs(userAnswer - myAnswer);
          const weight = weights[key];
          totalWeightedDiff += diff * weight;
          totalWeight += 4 * weight;
        }
      });

      const score = totalWeight > 0
        ? Math.round(100 - (totalWeightedDiff / totalWeight) * 100)
        : 0;

      return {
        userId: user._id,
        name: user.name,
        username: user.username,
        score,
      };
    });

    results.sort((a, b) => b.score - a.score);
    res.json(results);
  } catch (err) {
    console.error("Error calculating compatibility:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// forget password backend function
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = Date.now() + 3600000; // 1 hour

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await user.save();

  // In production, replace this with a real email service
  console.log(`🔗 Reset password link: http://localhost:3000/reset-password/${token}`);

  res.json({ message: "Password reset link sent to your email." });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: "Password reset successfully" });
};


