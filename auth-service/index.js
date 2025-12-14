const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // <--- 1. ADD THIS

const app = express();
app.use(express.json());
app.use(cors()); // <--- 2. USE THIS

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@postgres:5432/market_auth'
});

// Wait for DB to start
setTimeout(() => {
  pool.query(`
    CREATE TABLE IF NOT EXISTS users_v2 (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL
    );
  `).then(() => console.log("✅ Table 'users_v2' created successfully!"))
    .catch(err => console.error("❌ Error creating table:", err));
}, 5000);

// --- ROUTES ---

// REGISTER
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users_v2 (email, password, role) VALUES ($1, $2, $3) RETURNING *",
      [email, hashedPassword, role]
    );
    
    const token = jwt.sign({ id: newUser.rows[0].id, role }, 'mySuperSecretKey123');
    res.json({ token, role, message: "User created!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "User already exists or DB error" });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users_v2 WHERE email = $1", [email]);
    if (user.rows.length === 0) return res.status(400).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.rows[0].password);
    if (!validPass) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, 'mySuperSecretKey123');
    res.json({ token, role: user.rows[0].role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3001, () => console.log("Auth Service running on 3001"));