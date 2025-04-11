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
  const { name, email, username, password, quizResponses, accountType } = req.body;

  try {
    // Check if user already exists (including soft deleted users)
    const existingUser = await User.findOne({ username });

    if (existingUser && existingUser.isDeleted) {
      // Reactivate soft-deleted user
      existingUser.isDeleted = false;
      existingUser.password = await bcrypt.hash(password, 10);
      await existingUser.save();
    } else if (existingUser) {
      // If user exists and is not deleted, return an error
      return res.status(400).json({ error: "User already exists" });
    } else {
      // Create a new user
      const hashed = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        username,
        password: hashed,
        accountType, // Save type
        quizResponses,
      });

      await user.save();
    }

    // Create or update the user in Stream Chat too
    await streamClient.upsertUser({
      id: username,
      name: name,
      accountType: accountType, // Send accountType to Stream
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
