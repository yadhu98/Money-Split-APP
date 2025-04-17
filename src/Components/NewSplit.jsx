import React, { useState } from 'react';
import { getUsers } from '../utils/auth';

function NewSplit({ creator, onSave, onCancel }) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [customShares, setCustomShares] = useState({});

  const users = getUsers().filter(user => user.id !== creator.id);

  const handleUserToggle = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleShareChange = (userId, value) => {
    setCustomShares({
      ...customShares,
      [userId]: parseFloat(value) || 0,
    });
  };

  const handleSubmit = () => {
    if (!description || !totalAmount || selectedUsers.length === 0) return;

    const amount = parseFloat(totalAmount);
    const shares = [];

    if (splitType === 'equal') {
      const share = amount / (selectedUsers.length + 1);
      selectedUsers.forEach(userId => {
        shares.push({
          userId,
          amount: share,
          userName: users.find(u => u.id === userId).name,
        });
      });
    } else if (splitType === 'specific') {
      selectedUsers.forEach(userId => {
        shares.push({
          userId,
          amount: customShares[userId] || 0,
          userName: users.find(u => u.id === userId).name,
        });
      });
    } else if (splitType === 'percentage') {
      selectedUsers.forEach(userId => {
        shares.push({
          userId,
          amount: (amount * (customShares[userId] || 0)) / 100,
          userName: users.find(u => u.id === userId).name,
        });
      });
    }

    const newSplit = {
      id: Date.now(),
      description,
      totalAmount: amount,
      creatorId: creator.id,
      creatorName: creator.name,
      shares,
      payments: [],
    };

    onSave(newSplit);
  };

  return (
    <div className="new-split">
      <h3>Create New Split</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Total Amount:</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />
        </div>
        <div>
          <label>Split Type:</label>
          <select value={splitType} onChange={(e) => setSplitType(e.target.value)}>
            <option value="equal">Equal</option>
            <option value="specific">Specific Amounts</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
        <div>
          <label>Select Users:</label>
          <div className="user-selection">
            {users.map(user => (
              <div key={user.id}>
                <input
                  type="checkbox"
                  id={`user-${user.id}`}
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleUserToggle(user.id)}
                />
                <label htmlFor={`user-${user.id}`}>{user.name}</label>
              </div>
            ))}
          </div>
        </div>
        {(splitType === 'specific' || splitType === 'percentage') && (
          <div className="custom-shares">
            <h4>Enter {splitType === 'specific' ? 'Amounts' : 'Percentages'}:</h4>
            {selectedUsers.map(userId => {
              const user = users.find(u => u.id === userId);
              return (
                <div key={userId}>
                  <label>{user.name}:</label>
                  <input
                    type="number"
                    value={customShares[userId] || ''}
                    onChange={(e) => handleShareChange(userId, e.target.value)}
                    required
                  />
                  {splitType === 'percentage' && <span>%</span>}
                </div>
              );
            })}
          </div>
        )}
        <div className="form-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Create Split</button>
        </div>
      </form>
    </div>
  );
}

export default NewSplit;