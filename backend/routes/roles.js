const express = require('express');
const router = express.Router();
const { Role } = require('../models');

// GET all roles
router.get('/', async (req, res) => {
  const roles = await Role.findAll();
  res.json(roles);
});

module.exports = router;
