const mysql = require('mysql');

// Create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',  // Your MySQL Password
  database: 'referral_system'
});

// Connect
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

module.exports = db;