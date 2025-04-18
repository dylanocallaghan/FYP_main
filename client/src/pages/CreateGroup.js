import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateGroup.css';

// Create Group function
const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const navigate = useNavigate();

  const handleCreateGroup = async () => {
    try {
      await axios.post('http://localhost:5000/groups', { name: groupName }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/my-group');
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group.');
    }
  };

  return (
    <div className="create-group-container">
      <h2 className="create-group-title">Create a New Group</h2>
      <div className="create-group-form">
        <label>Group Name:</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="create-group-input"
          placeholder="e.g. Uni Roommates"
        />
        <button
          className="create-group-button"
          onClick={handleCreateGroup}
          disabled={!groupName.trim()}
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default CreateGroup;
