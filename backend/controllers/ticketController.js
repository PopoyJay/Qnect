exports.createTicket = async (req, res) => {
  try {
    const { subject, description, priority, category_id, user_id, agent } = req.body;

    // Set default value for agent if not provided
    const newTicket = await Ticket.create({
      subject,
      description,
      priority,
      category_id,
      user_id,
      agent: agent || null, // Defaults to null if no agent provided
    });

    res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
