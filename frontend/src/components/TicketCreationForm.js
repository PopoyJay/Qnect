import React, { useState } from 'react';
import '../styles/ticket.css'; // ✅ adjust the path and filename as needed

const TicketForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    category: '',
    priority: '',
    status: '',
    assignedTo: '',
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting ticket:', formData);
    // TODO: submit to backend
  };

  return (
    <div className="container mt-4">
      <h3>Create New Ticket</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Department</label>
              <select className="form-select" name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                {/* Add more departments */}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select Category</option>
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                {/* Add more */}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Priority</label>
              <select className="form-select" name="priority" value={formData.priority} onChange={handleChange}>
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" rows="5" value={formData.description} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Assigned To</label>
              <input type="text" className="form-control" name="assignedTo" value={formData.assignedTo} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Attachment</label>
              <input type="file" className="form-control" name="attachment" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-end">
          <button type="submit" className="btn btn-primary">Submit Ticket</button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;
