const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');
const { verifyToken } = require("../middleware/authMiddleware");
const { StreamChat } = require("stream-chat");

const streamClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

// Create group with optional invites
router.post('/', verifyToken, async (req, res) => {
  try {
    const creatorId = req.user.id;
    const { memberIds = [] } = req.body;

    const newGroup = new Group({
      name: req.body.name,
      creator: creatorId,
      members: [creatorId],
      pendingInvites: memberIds,
    });

    await newGroup.save();

    const user = await User.findById(creatorId);
    const invitedUsers = await User.find({ _id: { $in: memberIds } });
    const allUsernames = [user.username, ...invitedUsers.map(u => u.username)];

    const channel = streamClient.channel("messaging", newGroup._id.toString(), {
      name: `Group ${newGroup._id}`,
      members: allUsernames,
    });

    try {
      await channel.create({ created_by: { id: user.username } });
    } catch (err) {
      console.warn("^ Failed to create Stream channel.", err);
    }

    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Group creation error:", error);
    res.status(500).json({ message: 'Error creating group', error });
  }
});

// Group chat creation logic
router.post("/:id/chat", verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate("members", "username");
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the group creator can create the chat" });
    }

    const memberUsernames = group.members.map(m => m.username);
    const creatorUser = await User.findById(req.user.id);

    const channel = streamClient.channel("messaging", group._id.toString(), {
      name: `Group Chat: ${memberUsernames.join(", ")}`,
      members: memberUsernames,
      created_by_id: creatorUser.username,
    });

    await channel.create({ created_by: { id: creatorUser.username } });

    res.status(200).json({ message: "Group chat created" });
  } catch (error) {
    console.error("Create group chat error:", error);
    res.status(500).json({ message: "Failed to create group chat" });
  }
});

// Invite users to group
router.patch('/:id/invite', verifyToken, async (req, res) => {
  try {
    const groupId = req.params.id;
    const { usernames } = req.body;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Only the group creator can send invites' });
    }

    const users = await User.find({ username: { $in: usernames } });
    const foundUsernames = users.map((u) => u.username);

    const notFound = usernames.filter(u => !foundUsernames.includes(u));
    const invited = [];
    const alreadyInvited = [];
    const alreadyMembers = [];

    for (const user of users) {
      const id = user._id.toString();
      const isAlreadyInvited = group.pendingInvites.some(i => i.toString() === id);
      const isAlreadyMember = group.members.some(m => m.toString() === id);

      if (isAlreadyMember) {
        alreadyMembers.push(user.username);
        continue;
      }

      if (isAlreadyInvited) {
        alreadyInvited.push(user.username);
        continue;
      }

      if (id !== userId) {
        group.pendingInvites.push(user._id);
        invited.push(user.username);
      }
    }

    await group.save();

    res.status(200).json({
      message: 'Processed invites',
      invited,
      alreadyInvited,
      alreadyMembers,
      notFound,
    });
  } catch (error) {
    console.error('Error sending invites:', error);
    res.status(500).json({ message: 'Server error during invite' });
  }
});

// Accept invite and join chat
router.patch('/:id/accept', verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.pendingInvites.includes(req.user.id)) {
      return res.status(400).json({ message: 'You were not invited to this group' });
    }

    group.pendingInvites = group.pendingInvites.filter(id => id.toString() !== req.user.id);
    group.members.push(req.user.id);
    await group.save();

    const user = await User.findById(req.user.id);
    const channel = streamClient.channel("messaging", group._id.toString());

    try {
      await channel.query(); // Check if channel exists
      await channel.addMembers([user.username]);
    } catch (err) {
      console.warn("⚠️ Group chat doesn't exist yet, skipping addMembers.");
    }

    res.status(200).json({ message: 'Invite accepted', group });
  } catch (error) {
    console.error('Accept error:', error);
    res.status(500).json({ message: 'Error accepting invite', error });
  }
});

// Decline invite
router.patch('/:id/decline', verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.pendingInvites = group.pendingInvites.filter(id => id.toString() !== req.user.id);
    await group.save();

    res.status(200).json({ message: 'Invite declined' });
  } catch (error) {
    console.error('Decline error:', error);
    res.status(500).json({ message: 'Error declining invite', error });
  }
});

// Leave group and remove from Stream
router.patch('/:id/leave', verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.creator.toString() === req.user.id) {
      return res.status(400).json({ message: 'Creator cannot leave the group. Delete it instead.' });
    }

    group.members = group.members.filter(id => id.toString() !== req.user.id);
    await group.save();

    const user = await User.findById(req.user.id);
    const channel = streamClient.channel("messaging", group._id.toString());

    try {
      await channel.query(); // Check if channel exists
      await channel.removeMembers([user.username]);
    } catch (err) {
      console.warn("⚠️ Group chat doesn't exist yet, skipping removeMembers.");
    }

    res.status(200).json({ message: 'You have left the group' });
  } catch (error) {
    console.error('Leave error:', error);
    res.status(500).json({ message: 'Error leaving group', error });
  }
});

// Delete group and Stream channel
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the group creator can delete the group' });
    }

    const user = await User.findById(req.user.id);
    const channel = streamClient.channel("messaging", group._id.toString());

    try {
      await channel.delete({ created_by: { id: user.id } });
    } catch (err) {
      console.warn("⚠️ Failed to delete Stream channel. It may not exist:", err.message);
    }

    await group.deleteOne();

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting group', error });
  }
});

// Get current user's group
router.get('/mygroup', verifyToken, async (req, res) => {
  try {
    const group = await Group.findOne({
      $or: [
        { creator: req.user.id },
        { members: req.user.id },
        { pendingInvites: req.user.id },
      ],
    }).populate('creator members pendingInvites', 'username email');

    if (!group) {
      return res.status(200).json(null); // Don't send a 404 if no group
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Fetch group error:', error);
    res.status(500).json({ message: 'Server error while fetching group', error });
  }
});

module.exports = router;
