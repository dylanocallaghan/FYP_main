const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: { type: String, enum: ["student", "listing owner", "admin"], required: true },
  quizResponses: { type: Object, default: {} },
  priorityOrder: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },

  // Added profile fields
  gender: { type: String, default: "" }, 
  pronouns: { type: String, default: "" },
  age: { type: Number },
  course: { type: String, default: "" },
  year: { type: String, default: "" }, 
  smoking: { type: String, default: "" }, 
  drinking: { type: String, default: "" },
  pets: { type: String, default: "" }, 

  openTo: {
    smokers: { type: Boolean, default: false },
    petOwners: { type: Boolean, default: false },
    mixedGender: { type: Boolean, default: false },
    internationalStudents: { type: Boolean, default: false },
  },

  bio: { type: String, default: "" },

  // Forgot password support
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

// 🔐 Password hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
