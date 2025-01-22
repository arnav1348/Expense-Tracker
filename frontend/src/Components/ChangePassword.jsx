import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../Components/auth/AuthPage';

const ChangePassword = ({ onClose }) => {
  const { token } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          oldPassword, 
          newPassword 
        }),
        
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to change password');
        return;
      }

      setMessage('Password changed successfully!');
      
      // Close the modal after a short delay
      if (onClose) {
        setTimeout(onClose, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred');
    }
  };

  return (
    <ChangePasswordStyled>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div className="form-group">
          <label>Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            placeholder="Enter current password"
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password"
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm new password"
          />
        </div>
        
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        
        <button type="submit">Change Password</button>
      </form>
    </ChangePasswordStyled>
  );
};

const ChangePasswordStyled = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 15px;

    label {
      display: block;
      margin-bottom: 5px;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  }

  button {
    width: 100%;
    padding: 10px;
    background-color: #222260;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .error-message {
    color: red;
    text-align: center;
    margin-bottom: 10px;
  }

  .success-message {
    color: green;
    text-align: center;
    margin-bottom: 10px;
  }
`;

export default ChangePassword;