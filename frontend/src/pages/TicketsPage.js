import React, { useState } from 'react';
import '../styles/ticket.css';

const TicketsPage = () => {
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Collect ticket data
    const ticketData = {
      subject,
      department,
      priority,
      status,
      assignedTo,
      category,
      description,
      attachment
    };
    // Log for testing purposes
    console.log(ticketData);
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

            {/* Newly Added Assigned To Field - Now in Right Column */}
            <div className="form-group">
              <label htmlFor="assignedTo">Assigned To</label>
              <input
                type="text"
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">Create Ticket</button>
      </form>
    </div>
  );
};

export default TicketsPage;
