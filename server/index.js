// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
require("dotenv").config();

// Import route files
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const streamRoutes = require("./routes/streamRoutes");
const groupRoutes = require("./routes/groupRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require('./routes/adminRoutes');
const Application = require("./models/Application");

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/student_housing")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes); 
app.use("/api/stream", streamRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/applications", applicationRoutes);
app.use('/admin', adminRoutes);
app.use("/groups", groupRoutes);
app.use('/applications', applicationRoutes); 


// Start server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
