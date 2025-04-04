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
