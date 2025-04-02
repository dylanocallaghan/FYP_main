const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const pusher = require("../config/pusher");

// ✅ Save message (POST /api/messages)
router.post("/", async (req, res) => {
  const { sender, receiver, message } = req.body;

  try {
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    pusher.trigger("chat", "message", { sender, receiver, message, timestamp: newMessage.timestamp });
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Failed to save message" });
  }
});

// ✅ Get message history for a user (POST /api/messages/history)
router.post("/history", async (req, res) => {
  const { email } = req.body;

  try {
    const messages = await Message.find({
      $or: [
        { sender: email },
        { receiver: email }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching message history:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
