// ReferralForm.js

import React, { useState } from 'react';
import db from './db'; // Adjust path as needed

const ReferralForm = () => {
  const [referrerId, setReferrerId] = useState('');
  const [refereeId, setRefereeId] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    db.query(
      'INSERT INTO referrals (referrer_id, referee_id) VALUES (?, ?)',
      [referrerId, refereeId],
      err => {
        if (err) {
          console.error(err);
        } else {
          console.log('Referral added successfully');
          // Optionally, clear form fields or update state
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Referrer ID:
        <input
          type="text"
          value={referrerId}
          onChange={e => setReferrerId(e.target.value)}
        />
      </label>
      <label>
        Referee ID:
        <input
          type="text"
          value={refereeId}
          onChange={e => setRefereeId(e.target.value)}
        />
      </label>
      <button type="submit">Refer</button>
    </form>
  );
};

export default ReferralForm;
