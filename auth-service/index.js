const express = require('express');
const { Pool } = require('pg'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
const pool = new Pool({
  user: 'postgres',
  host: process.env.DB_HOST || 'localhost', 
  database: 'postgres',
  password: '1234',
  port: 5432,
});

// --- ROBUST TABLE CREATION (With Retry) ---
// This function keeps trying to create the table until the database is ready
const connectWithRetry = () => {
  pool.query(`
    CREATE TABLE IF NOT EXISTS users_v2 (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'buyer' 
    )
  `)
  .then(() => console.log("✅ Table 'users_v2' created successfully!"))
  .catch((err) => {
    console.log("⏳ Database not ready, retrying in 5 seconds...", err.message);
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  });
};

// Start the retry loop immediately
connectWithRetry();

// REGISTER
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'buyer'; 

    const newUser = await pool.query(
      'INSERT INTO users_v2 (email, password, role) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, userRole]
    );
    res.json(newUser.rows[0]);
  } catch (err) { 
    console.error(err);
    res.status(500).json("Server Error"); 
  }
});

// LOGIN
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users_v2 WHERE email = $1', [email]);
    if (user.rows.length === 0) return res.status(401).json("User not found");
    
    const validPass = await bcrypt.compare(password, user.rows[0].password);
    if (!validPass) return res.status(401).json("Wrong password");

    const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, 'mySuperSecretKey123');
    res.json({ token, role: user.rows[0].role });
  } catch (err) { 
    console.error(err);
    res.status(500).json("Server Error"); 
  }
});

app.listen(3001, () => console.log("Auth Service running on 3001"));