const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/student_housing")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/messages", chatRoutes); // ✅ Mounts at /api/messages

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
