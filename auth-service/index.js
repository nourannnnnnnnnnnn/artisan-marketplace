const express = require('express');
const { Pool } = require('pg'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION (Docker Ready) ---
// If running in Docker, it uses 'postgres'. If running locally, it uses 'localhost'.
const pool = new Pool({
  user: 'postgres',
  host: process.env.DB_HOST || 'localhost', 
  database: 'postgres',
  password: '1234',
  port: 5432,
});

// Create Table V2 (With Roles)
pool.query(`
  CREATE TABLE IF NOT EXISTS users_v2 (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'buyer' 
  )
`).catch(err => console.log("DB Error:", err));

// REGISTER (Accepts Role)
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

// LOGIN (Returns Role & Token)
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users_v2 WHERE email = $1', [email]);
    if (user.rows.length === 0) return res.status(401).json("User not found");
    
    const validPass = await bcrypt.compare(password, user.rows[0].password);
    if (!validPass) return res.status(401).json("Wrong password");

    // Include Role in Token
    const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, 'mySuperSecretKey123');
    res.json({ token, role: user.rows[0].role });
  } catch (err) { 
    console.error(err);
    res.status(500).json("Server Error"); 
  }
});

app.listen(3001, () => console.log("Auth Service running on 3001"));