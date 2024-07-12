import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('referralCode');
    setReferralCode(code || '');
  }, [location.search]);

  const handleSignUp = () => {
  fetch('http://localhost:3001/api/users/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, referralCode }), // Include referralCode
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to sign up');
      }
      return response.json();
    })
    .then((data) => {
      alert('User signed up successfully');
      // Redirect to profile or other page after successful signup
      navigate('/profile');
    })
    .catch((error) => {
      console.error('Error signing up:', error.message);
      setError('Failed to sign up. Please try again.');
    });
};

  return (
    <div>
      <h2>Sign Up</h2>
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
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignUp;