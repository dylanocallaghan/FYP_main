const express = require('express');
const { StreamChat } = require('stream-chat');
require('dotenv').config();

const router = express.Router();
const streamServerClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

// POST /stream/getToken
router.post('/getToken', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const token = streamServerClient.createToken(id);
    res.json({ token });
  } catch (err) {
    console.error("❌ Error generating token:", err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

module.exports = router;
