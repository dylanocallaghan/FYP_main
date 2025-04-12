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

  // 🆕 New profile fields
  gender: { type: String, default: "" }, // Male, Female, Non-binary, Prefer not to say
  pronouns: { type: String, default: "" }, // he/him, she/her, etc.
  age: { type: Number },
  course: { type: String, default: "" },
  year: { type: String, default: "" }, // e.g., 1st year, 2nd year
  smoking: { type: String, default: "" }, // Yes / No
  drinking: { type: String, default: "" },
  pets: { type: String, default: "" }, // Yes / No

  openTo: {
    smokers: { type: Boolean, default: false },
    petOwners: { type: Boolean, default: false },
    mixedGender: { type: Boolean, default: false },
    internationalStudents: { type: Boolean, default: false },
  },

  bio: { type: String, default: "" },
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
