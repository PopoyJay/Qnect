// routes/department.js
const express = require('express');
const router = express.Router();
const { Department } = require('../models');

// CREATE
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const department = await Department.create({ name });
    res.status(201).json({ message: 'Department created successfully', department });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);

    if (!department) return res.status(404).json({ message: 'Department not found' });

    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
