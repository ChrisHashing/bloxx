import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [referredUsers, setReferredUsers] = useState([]);
  const [refererId,setRefererId] = useState()
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const profileResponse = await fetch('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData = await profileResponse.json();
        console.log(profileData);
        setUsername(profileData.username);
        setEmail(profileData.email);
        setReferralCode(profileData.referral_code || '');
        setReferralCount(profileData.referral_count || 0);
        setRefererId(profileData.referrer_id | '')

        const referredUsersResponse = await fetch(`http://localhost:3001/api/users/referred-users/${profileData.referral_code}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!referredUsersResponse.ok) {
          throw new Error('Failed to fetch referred users');
        }

        const referredUsersData = await referredUsersResponse.json();
        setReferredUsers(referredUsersData);
      } catch (error) {
        console.error('Error fetching profile:', error.message);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const generateReferralLink = () => {
    return `http://localhost:3000/signup?referralCode=${referralCode}`;
  };

  const handleSignOut = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Navigate to the home page
    navigate('/');
  };

  return (
    <div>
      <h2>Profile</h2>
      <p>Hi, {username}</p>
      <p>Email: {email}</p>
      <p>Referral Code: {referralCode}</p>
      <p>Referral Count: {referralCount}</p>
      <p>Referral Link: <a href={generateReferralLink()}>{generateReferralLink()}</a></p>
      
      <h3>Referred Users:</h3>
      {referredUsers.length === 0 ? (
        <p>No referred users found.</p>
      ) : (
        <ul>
          {referredUsers.map((user, index) => (
            <li key={index}>
              Username: {user.username} | Email: {user.email} | Referral Count: {user.referral_count}
            </li>
          ))}
        </ul>
      )}

      {/* Sign-out button */}
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Profile;