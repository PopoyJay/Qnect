import React, { useState } from "react";

const TicketFilterForm = ({ onFilterSubmit }) => {
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
    assignedTo: "",
    department: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterSubmit(filters); // Submit the filters to parent component
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Status:</label>
      <select name="status" value={filters.status} onChange={handleChange}>
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Resolved">Resolved</option>
        <option value="Closed">Closed</option>
      </select>

      <label>Category:</label>
      <input
        type="text"
        name="category"
        value={filters.category}
        onChange={handleChange}
        placeholder="Enter category"
      />

      <label>Priority:</label>
      <select name="priority" value={filters.priority} onChange={handleChange}>
        <option value="">All</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <label>Assigned To:</label>
      <input
        type="text"
        name="assignedTo"
        value={filters.assignedTo}
        onChange={handleChange}
        placeholder="Assigned To"
      />

      <label>Department:</label>
      <input
        type="text"
        name="department"
        value={filters.department}
        onChange={handleChange}
        placeholder="Enter department"
      />

      <button type="submit">Filter</button>
    </form>
  );
};

export default TicketFilterForm;
