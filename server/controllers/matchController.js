const User = require("../models/User");
const mongoose = require("mongoose");

// Weighted compatiable score algo
const calculateScore = (a, b) => {
  let totalDiff = 0;
  const keys = Object.keys(a);
  for (let key of keys) {
    const aVal = a[key] ?? 0;
    const bVal = b[key] ?? 0;
    totalDiff += Math.abs(aVal - bVal);
  }
  const maxDiff = 5 * keys.length;
  return Math.round(((maxDiff - totalDiff) / maxDiff) * 100);
};

// Get matches using the above algo
exports.getMatches = async (req, res) => {
  try {
    console.log("🔍 Match route hit!");

    const currentUser = await User.findById(req.user._id || req.user.id);
    if (!currentUser) {
      console.log("❌ Current user not found");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("🧠 Logged in as:", currentUser.email, "| Username:", currentUser.username);

    const others = await User.find(
      {
        _id: { $ne: new mongoose.Types.ObjectId(currentUser._id.toString()) },
        username: { $exists: true, $ne: null, $ne: "" }
      },
      "name email username quizResponses"
    );

    console.log("✅ Fetched others:", others.map(u => ({
      name: u.name,
      username: u.username
    })));

    const matches = others.map((other) => {
      const score = calculateScore(currentUser.quizResponses, other.quizResponses);
      return {
        id: other._id,
        name: other.name,
        email: other.email,
        username: other.username,
        score,
        quizResponses: other.quizResponses
      };
    });

    // Dispaly top 5 matches from score
    const topMatches = matches
      .filter((m) => !isNaN(m.score))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json(topMatches);
  } catch (err) {
    console.error("❌ Match error:", err);
    res.status(500).json({ error: "Match error" });
  }
};
