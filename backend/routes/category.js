// routes/category.js
const express = require('express');
const router = express.Router();
const { Category } = require('../models');

// CREATE
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    const category = await Category.create({ name });
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
