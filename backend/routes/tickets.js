const express = require('express');
const router = express.Router();
const { Ticket, Category, Department } = require('../models');

// CREATE
router.post('/', async (req, res) => {
  const { subject, description, status = 'Open', agent, categoryId, departmentId, userId } = req.body;

  if (!subject || !description || !agent || !userId) {
    return res.status(400).json({ message: 'Subject, Description, Agent, and User are required' });
  }

  try {
    // Check if category, department, and user exist
    const category = await Category.findByPk(categoryId);
    const department = await Department.findByPk(departmentId);
    // (Optional) If you want to verify userId too, you should import User model and check it

    if (!category || !department) {
      return res.status(400).json({ message: 'Invalid Category or Department ID' });
    }

    const ticket = await Ticket.create({ subject, description, status, agent, categoryId, departmentId, userId });
    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [Category, Department],
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [Category, Department],
    });

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { subject, description, status, agent, categoryId, departmentId } = req.body;

  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    await ticket.update({ subject, description, status, agent, categoryId, departmentId });
    res.json({ message: 'Ticket updated', ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Ticket.destroy({ where: { id: req.params.id } });

    if (deleted) {
      res.json({ message: 'Ticket deleted successfully' });
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
