const express = require('express');
const { StreamChat } = require('stream-chat');
const { verifyToken } = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();
const streamServerClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

router.post("/getToken", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing user ID" });

  try {
    const token = streamServerClient.createToken(id); // Fixed here
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Failed to create Stream token" });
  }
});


// DELETE /stream/delete-channel/:channelId
router.delete('/delete-channel/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required to delete a chat' });
    }

    const channel = streamServerClient.channel('messaging', channelId);
    await channel.watch();

    const memberIds = Object.keys(channel.state.members);

    if (!memberIds.includes(userId)) {
      return res.status(403).json({ error: 'You must be a participant to delete this chat' });
    }

    await channel.delete();
    return res.status(200).json({ message: 'Channel deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting channel:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
