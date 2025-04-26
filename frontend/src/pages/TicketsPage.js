import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ticket.css';

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [agent, setAgent] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  
  // New states for dynamic dropdowns
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  // Retrieve token from localStorage
  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/departments', {
          headers: { Authorization: `Bearer ${token}` }, // Pass the token here
        });
        setDepartments(response.data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories', {
          headers: { Authorization: `Bearer ${token}` }, // Pass the token here
        });
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchDepartments();
    fetchCategories();
    
    // Fetch Tickets (no token needed for this API)
    fetch('http://localhost:5000/api/tickets')
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(err => console.error(err));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ticketData = {
      subject,
      department,
      priority,
      status,
      agent,
      category,
      description,
    };

    console.log('Submitting ticket data:', ticketData);

    try {
      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add token for POST request
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      const createdTicket = await response.json();
      console.log('Ticket created:', createdTicket);

      setTickets(prev => [...prev, createdTicket]);

      // Reset form
      setSubject('');
      setDepartment('');
      setPriority('');
      setStatus('');
      setAgent('');
      setCategory('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting ticket:', error);
    }
  };

  return (
    <div className="ticket-form-container">
      <h2>Create Ticket</h2>
      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-columns">
          {/* Left Column */}
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map(dep => (
                  <option key={dep.id} value={dep.name}>{dep.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">Select Priority</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="Progress">Progress</option>
                <option value="Closed">Closed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="agent">Agent</label>
              <input
                type="text"
                id="agent"
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">Create Ticket</button>
      </form>

      {/* Display Tickets */}
      <div className="tickets-list">
        <h2>Existing Tickets</h2>
        <ul>
          {tickets.map(ticket => (
            <li key={ticket.id}>
              {ticket.subject} - {ticket.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TicketsPage;
