const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought');
const User = require('../models/User');

// GET all thoughts
router.get('/', async (req, res) => {
  const thoughts = await Thought.find();
  res.json(thoughts);
});

// POST new thought
router.post('/', async (req, res) => {
  const { username, thoughtText } = req.body;
  const thought = new Thought({ username, thoughtText });
  await thought.save();

  await User.findOneAndUpdate(
    { username },
    { $push: { thoughts: thought._id } },
    { new: true }
  );

  res.status(201).json(thought);
});

// PUT update thought
router.put('/:id', async (req, res) => {
  const updated = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE thought
router.delete('/:id', async (req, res) => {
  await Thought.findByIdAndDelete(req.params.id);
  res.json({ message: 'Thought deleted' });
});

// ADD reaction
router.post('/:id/reactions', async (req, res) => {
  const thought = await Thought.findById(req.params.id);
  thought.reactions.push(req.body);
  await thought.save();
  res.json(thought);
});

// REMOVE reaction
router.delete('/:id/reactions/:reactionId', async (req, res) => {
  const thought = await Thought.findById(req.params.id);
  thought.reactions.id(req.params.reactionId).remove();
  await thought.save();
  res.json(thought);
});

module.exports = router;
