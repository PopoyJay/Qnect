const express = require('express');
const router = express.Router();
const { User, Role } = require('../models');

// GET all users with roles
router.get('/', async (req, res) => {
  const users = await User.findAll({ include: Role });
  res.json(users);
});

// POST create new user
router.post('/', async (req, res) => {
  const { username, email, roleId } = req.body;
  try {
    const newUser = await User.create({ username, email, roleId });
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  const { username, email, roleId } = req.body;
  try {
    await User.update({ username, email, roleId }, { where: { id: req.params.id } });
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
