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
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTicketId, setEditingTicketId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsRes, categoriesRes, ticketsRes] = await Promise.all([
          axios.get('/api/departments', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/categories', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/tickets', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setDepartments(departmentsRes.data);
        setCategories(categoriesRes.data);
        setTickets(ticketsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const resetForm = () => {
    setSubject('');
    setDepartment('');
    setPriority('');
    setStatus('');
    setAgent('');
    setCategory('');
    setDescription('');
    setEditingTicketId(null);
  };

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

    try {
      if (editingTicketId) {
        const response = await axios.put(`http://localhost:5000/api/tickets/${editingTicketId}`, ticketData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        setTickets(prev =>
          prev.map(ticket => (ticket.id === editingTicketId ? response.data : ticket))
        );
      } else {
        const response = await axios.post('http://localhost:5000/api/tickets', ticketData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        setTickets(prev => [...prev, response.data]);
      }

      resetForm();
    } catch (error) {
      console.error('Error submitting ticket:', error);
    }
  };

  const handleEdit = (ticket) => {
    setEditingTicketId(ticket.id);
    setSubject(ticket.subject);
    setDepartment(ticket.department);
    setPriority(ticket.priority);
    setStatus(ticket.status);
    setAgent(ticket.agent);
    setCategory(ticket.category);
    setDescription(ticket.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  return (
    <div className="ticket-form-container">
      <h2>{editingTicketId ? 'Edit Ticket' : 'Create Ticket'}</h2>
      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-columns">
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

        <div className="form-action-buttons">
          <button
            type="submit"
            className={editingTicketId ? 'update-btn' : 'create-btn'}
          >
            {editingTicketId ? 'Update Ticket' : 'Create Ticket'}
          </button>
          {editingTicketId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Display Tickets */}
      <div className="tickets-list">
        <h2>Existing Tickets</h2>
        {loading ? (
          <p>Loading tickets...</p>
        ) : (
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Status</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Agent</th>
                <th>Description</th>
                <th>Date Created</th> {/* NEW COLUMN */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>{ticket.subject}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.department}</td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.category}</td>
                  <td>{ticket.agent}</td>
                  <td>{ticket.description}</td>
                  <td>{formatDate(ticket.createdAt)}</td> {/* FORMATTED DATE */}
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(ticket)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(ticket.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
