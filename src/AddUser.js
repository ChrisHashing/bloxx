import React, { useState } from 'react';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState(null);

  // Function to handle adding a new user
  const handleAddUser = () => {
    fetch('http://localhost:3001/api/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add user');
        }
        return response.json();
      })
      .then((data) => {
        alert(`User added with referral code: ${data.referralCode}`);
        setReferralCode(data.referralCode); // Set the generated referral code
      })
      .catch((error) => {
        console.error('Error adding user:', error.message);
        setError('Failed to add user. Please try again.');
      });
  };

  // Function to refer a user
  const handleReferUser = () => {
    fetch('http://localhost:3001/api/users/refer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referrerCode: referralCode, username, email }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to refer user');
        }
        return response.json();
      })
      .then((data) => {
        alert(`User referred with referral code: ${data.referralCode}`);
        setReferralCode(data.referralCode); // Set the new generated referral code
      })
      .catch((error) => {
        console.error('Error referring user:', error.message);
        setError('Failed to refer user. Please try again.');
      });
  };

  return (
    <div>
      <h2>Add User</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleAddUser}>Add User</button>

      <h2>Refer User</h2>
      <input
        type="text"
        placeholder="Referrer Code"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
      />
      <button onClick={handleReferUser}>Refer User</button>

      {error && <p>{error}</p>}
    </div>
  );
};

export default AddUser;