const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  const users = await User.find().populate('friends').populate('thoughts');
  res.json(users);
});

// POST new user
router.post('/', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

// PUT update user
router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

// DELETE user
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// ADD friend
router.post('/:id/friends/:friendId', async (req, res) => {
  const user = await User.findById(req.params.id);
  user.friends.addToSet(req.params.friendId);
  await user.save();
  res.json(user);
});

// REMOVE friend
router.delete('/:id/friends/:friendId', async (req, res) => {
  const user = await User.findById(req.params.id);
  user.friends.pull(req.params.friendId);
  await user.save();
  res.json(user);
});

module.exports = router;
