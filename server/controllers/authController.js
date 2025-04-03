const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "secret123";

exports.registerUser = async (req, res) => {
  const { name, email, username, password, quizResponses } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      username,
      password: hashed,
      quizResponses
    });

    await user.save();
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

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username, // ✅ include username in response
    },
  });
};
