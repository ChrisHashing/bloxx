const express = require('express');
const router = express.Router();
const db = require('../../src/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const util = require('util');
const query = util.promisify(db.query).bind(db);

// Helper function to generate a referral code
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Add a new user (signup)
router.post('/signup', async (req, res) => {
  const { username, email, password, referralCode } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(referralCode);

  try {
    let referrerId = null;
    let actualReferralCode = referralCode;


    if (referralCode) {

      const sql = 'SELECT * FROM users WHERE referral_code = ?';
      const results = await query(sql, [referralCode]);

      console.log(results[0].id);

      // Log the results
      console.log('Query results:', results);

    
        
      if (results.length > 0) {
        console.log("WOrking");
        referrerId = results[0].id;
     
      }else {
        console.log("Not working");
        return res.status(400).json({ error: 'Invalid referral code' });
      }
      // referrerId = results[0].id;
      actualReferralCode = generateReferralCode();
    } else {
      // If referralCode is empty, generate a new referral code
      actualReferralCode = generateReferralCode();
    }

    console.log(actualReferralCode);
    // Insert user into the database
    const insertQuery = 'INSERT INTO users (username, email, password, referral_code, referrer_id) VALUES (?, ?, ?, ?, ?)';
    const insertParams = [username, email, hashedPassword, actualReferralCode, referrerId];      
    const insertResult = await db.query(insertQuery, insertParams);

    const insertedUser = {
      id: insertResult.insertId,
      username,
      email,
      referralCode: actualReferralCode // Use actualReferralCode here
    };
    
    res.json(insertedUser);
  } catch (err) {
    console.error('Error signing up:', err.message);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

// User login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      console.error('Error logging in:', err ? err.message : 'User not found');
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  });
});

// Get user profile
router.get('/profile', (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    db.query('SELECT username, email, referral_code, referrer_id FROM users WHERE id = ?', [decoded.id], (err, results) => {
      if (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ error: 'Failed to fetch profile' });
        return;
      }
      res.json(results[0]);
    });
  } catch (error) {
    console.error('Error decoding token:', error.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Refer a user
router.post('/refer', async (req, res) => {
  const { referrerCode, username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'SELECT id FROM users WHERE referral_code = ?',
    [referrerCode],
    (err, results) => {
      if (err || results.length === 0) {
        console.error('Error referring user:', err ? err.message : 'Invalid referral code');
        res.status(400).json({ error: 'Invalid referral code' });
        return;
      }

      const referrerId = results[0].id;
      const referralCode = generateReferralCode();

      db.query(
        'INSERT INTO users (username, email, password, referral_code) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, referralCode],
        (err, userResults) => {
          if (err) {
            console.error('Error inserting referred user:', err.message);
            res.status(500).json({ error: 'Failed to refer user' });
            return;
          }

          const refereeId = userResults.insertId;

          db.query(
            'INSERT INTO referrals (referrer_id, referee_id) VALUES (?, ?)',
            [referrerId, refereeId],
            (err) => {
              if (err) {
                console.error('Error recording referral:', err.message);
                res.status(500).json({ error: 'Failed to record referral' });
                return;
              }
              res.json({ id: refereeId, username, email, referralCode });
            }
          );
        }
      );
    }
  );
});

// Fetch referred users based on referralCode
router.get('/referred-users/:referralCode', (req, res) => {
  const { referralCode } = req.params;

  // Perform database query to fetch referred users based on referralCode
  db.query(
    `SELECT u.username, u.email, COUNT(r.referee_id) AS referral_count
     FROM users u
     LEFT JOIN referrals r ON u.id = r.referee_id
     WHERE u.referral_code = ?
     GROUP BY u.username, u.email`,
    [referralCode],
    (err, results) => {
      if (err) {
        console.error('Error fetching referred users:', err.message);
        res.status(500).json({ error: 'Failed to fetch referred users' });
        return;
      }
      res.json(results);
    }
  );
});

module.exports = router;