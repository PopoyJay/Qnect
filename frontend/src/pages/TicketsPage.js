import React, { useState, useEffect } from 'react';
import '../styles/ticket.css';

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]); // State to hold tickets from API
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [agent, setAgent] = useState(''); // Use 'agent' instead of 'assignedTo'
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);

  // Fetch tickets when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/tickets') // Ensure the backend API URL is correct
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch((err) => console.error(err));
  }, []); // Empty dependency array makes it run once when component mounts

  // Handle ticket creation form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('department', department);
    formData.append('priority', priority);
    formData.append('status', status);
    formData.append('agent', agent);
    formData.append('category', category);
    formData.append('description', description);
    if (attachment) {
      formData.append('attachment', attachment);
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }
  
      const newTicket = await response.json();
      setTickets((prevTickets) => [...prevTickets, newTicket]);
  
      // Clear form fields
      setSubject('');
      setDepartment('');
      setPriority('');
      setStatus('');
      setAgent('');
      setCategory('');
      setDescription('');
      setAttachment(null);
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
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Support">Support</option>
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
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
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
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Newly Added Category Field */}
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Network">Network</option>
                <option value="General">General</option>
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
              <label htmlFor="attachment">Attachment</label>
              <input
                type="file"
                id="attachment"
                onChange={(e) => setAttachment(e.target.files[0])}
              />
            </div>

            {/* Newly Added Assigned To Field */}
            <div className="form-group">
              <label htmlFor="agent">Agent</label>
              <input
                type="text"
                id="agent"
                value={agent} // Use 'agent' here
                onChange={(e) => setAgent(e.target.value)} // Use 'setAgent' here
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
