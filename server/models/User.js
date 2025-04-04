const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  accountType: {
    type: String,
    enum: ["student", "listing owner"],
    required: true,
  },
  quizResponses: {
    cleanliness: Number,
    sleepSchedule: Number,
    sociability: Number,
    guestPolicy: Number,
    personalSpace: Number,
    financialHabits: Number,
  },
  matches: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      score: Number,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
