const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors package
const usersRouter = require('./routes/users');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345', // Replace with your MySQL password
  database: 'referral_system',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log(`Backend API listening at http://localhost:${port}`);
});