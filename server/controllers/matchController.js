const User = require("../models/User");

// Basic scoring using inverse of total difference
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
  

exports.getMatches = async (req, res) => {
    try {
      console.log("🔍 Match route hit!");
  
      const currentUser = await User.findById(req.user._id || req.user.id);
      console.log("Logged in as:", currentUser?.email);
  
      const mongoose = require("mongoose");
      const others = await User.find(
        { _id: { $ne: new mongoose.Types.ObjectId(currentUser._id) } },
        "name email quizResponses"
      );
      
      
  
      const matches = others.map((other) => {
        const score = calculateScore(currentUser.quizResponses, other.quizResponses);
        console.log(`Match with ${other.email}: ${score}%`);
        return {
          id: other._id,
          name: other.name,
          email: other.email,
          score,
          quizResponses: other.quizResponses
        };
      });
  
      const topMatches = matches
        .filter((m) => !isNaN(m.score)) // filter out broken matches
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
  
      res.json(topMatches);
    } catch (err) {
      console.error("❌ Match error:", err);
      res.status(500).json({ error: "Match error" });
    }
};

const { getMatches } = require("../controllers/matchController");
