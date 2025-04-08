// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');

// Create group (user becomes creator and first member)
router.post('/', verifyToken, async (req, res) => {
  try {
    const creatorId = req.user.id;

    const newGroup = new Group({
      creator: creatorId,
      members: [creatorId],
      pendingInvites: [],
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error });
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

    // Only group creator can send invites
    if (group.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Only the group creator can send invites' });
    }

    // Fetch user docs for provided usernames
    const users = await User.find({ username: { $in: usernames } });
    const foundUsernames = users.map(u => u.username);
    const invitesSent = [];

    for (const user of users) {
      if (!user || !user._id) continue;

      const alreadyInvited = group.pendingInvites.some(id => id.toString() === user._id.toString());
      const alreadyMember = group.members.some(id => id.toString() === user._id.toString());

      if (!alreadyInvited && !alreadyMember) {
        group.pendingInvites.push(user._id);
        invitesSent.push(user.username);
      }
    }

    await group.save();
    res.status(200).json({ message: 'Invites sent', invitesSent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while inviting users' });
  }
});


// Accept invite
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

// Leave group
router.patch('/:id/leave', verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.creator.toString() === req.user.id) {
      return res.status(400).json({ message: 'Creator cannot leave the group. Delete it instead.' });
    }

    group.members = group.members.filter(id => id.toString() !== req.user.id);
    await group.save();

    res.status(200).json({ message: 'You have left the group' });
  } catch (error) {
    console.error('Leave error:', error);
    res.status(500).json({ message: 'Error leaving group', error });
  }
});

// Delete group
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the group creator can delete the group' });
    }

    await group.deleteOne();
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting group', error });
  }
});

// Get user's current group
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
      return res.status(404).json({ message: 'No group found for this user' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Fetch group error:', error);
    res.status(500).json({ message: 'Server error while fetching group', error });
  }
});

module.exports = router;
