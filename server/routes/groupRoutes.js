// routes/groupRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Group = require('../models/Group');
const verifyToken = require('../middleware/authMiddleware');

// Create group (user becomes creator and first member)
router.post('/', verifyToken, async (req, res) => {
  try {
    const creatorId = req.user.id;

    const newGroup = new Group({
      creator: creatorId,
      members: [creatorId],
      pendingInvites: []
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error });
  }
});

router.patch('/:id/invite', verifyToken, async (req, res) => {
  try {
    const groupId = req.params.id;
    const inviteeId = req.body.inviteeId;

    const objectId = new mongoose.Types.ObjectId(groupId);

    const group = await Group.findById(objectId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the group creator can send invites' });
    }

    if (group.pendingInvites.includes(inviteeId) || group.members.includes(inviteeId)) {
      return res.status(400).json({ message: 'User already invited or in group' });
    }

    group.pendingInvites.push(inviteeId);
    await group.save();

    res.status(200).json({ message: 'Invite sent successfully', group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while inviting user' });
  }
});

// ✅ NEW: Get current user's group
router.get('/mygroup', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const group = await Group.findOne({
      $or: [
        { creator: userId },
        { members: userId },
        { pendingInvites: userId }
      ]
    }).populate('creator members pendingInvites', 'username email');

    if (!group) {
      return res.status(404).json({ message: 'No group found for this user' });
    }

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching group' });
  }
});

module.exports = router;
