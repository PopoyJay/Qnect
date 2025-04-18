import React, { useState } from 'react';

const StatusesPage = () => {
  // State to hold the list of statuses
  const [statuses, setStatuses] = useState([
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Resolved' },
    { id: 3, name: 'Closed' },
  ]);

  // State for adding/editing status
  const [newStatus, setNewStatus] = useState('');
  const [editingStatusId, setEditingStatusId] = useState(null);

  // Handle adding a new status
  const handleAddStatus = () => {
    if (newStatus.trim()) {
      const newId = statuses.length ? statuses[statuses.length - 1].id + 1 : 1;
      const newStatusObj = { id: newId, name: newStatus };
      setStatuses([...statuses, newStatusObj]);
      setNewStatus('');
    }
  };

  // Handle editing a status
  const handleEditStatus = (id) => {
    const statusToEdit = statuses.find((status) => status.id === id);
    setNewStatus(statusToEdit.name);
    setEditingStatusId(id);
  };

  // Handle saving the edited status
  const handleSaveEdit = () => {
    setStatuses(
      statuses.map((status) =>
        status.id === editingStatusId ? { ...status, name: newStatus } : status
      )
    );
    setNewStatus('');
    setEditingStatusId(null);
  };

  // Handle deleting a status
  const handleDeleteStatus = (id) => {
    setStatuses(statuses.filter((status) => status.id !== id));
  };

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '20px', background: '#fff', borderRadius: '8px' }}>
      <h2>Manage Ticket Statuses</h2>

      {/* Input and Add button container */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          placeholder="Enter Status Name"
          style={{
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: 'calc(100% - 110px)', // Adjust width to fit button on the right
            marginRight: '10px', // Space between input and button
          }}
        />
        <button
          onClick={editingStatusId ? handleSaveEdit : handleAddStatus}
          style={{
            padding: '10px 20px',
            backgroundColor: editingStatusId ? '#28a745' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {editingStatusId ? 'Save' : 'Add'}
        </button>
      </div>

      {/* List of current statuses */}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {statuses.map((status) => (
          <li
            key={status.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              backgroundColor: '#f9f9f9',
              marginBottom: '10px',
            }}
          >
            <span style={{ fontWeight: 'bold' }}>{status.name}</span>

            <div>
              {/* Edit Button */}
              <button
                onClick={() => handleEditStatus(status.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#ffc107',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px',
                }}
              >
                Edit
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteStatus(status.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusesPage;
