import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

// Function to generate 6-character User ID
const generateUserId = () => {
  return uuidv4().replace(/-/g, '').slice(0, 6);
};

const UserRegister = ({ setUser }) => {
  const [name, setName] = useState('');
  const [userClass, setUserClass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // To redirect after registration

  const handleRegister = async () => {
    const userId = generateUserId();  // Generate 6-digit User ID

    if (!name || !userClass) {
      setError("Name and Class are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        name,
        userClass,
        userId, // Send generated userId
      });

      // Update the global user state
      setUser({ name, userClass, userId });

      // Handle success
      setSuccess(`Registration successful! Your User ID is: ${userId}.`);
      setError('');

      // Navigate to the login page and pass userId as state
      navigate("/login", { state: { userId } });
    } catch (error) {
      setError("Registration failed. Please try again.");
      setSuccess('');
    }
  };

  return (
    <div className="register-form">
      <h2>Register for Tests</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter your class"
        value={userClass}
        onChange={(e) => setUserClass(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default UserRegister;
