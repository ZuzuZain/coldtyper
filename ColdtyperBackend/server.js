const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000; // This is the port of the local backend server

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres', // Default local PostgreSQL username
    host: 'localhost',
    database: 'coldtyper_db', // DB name
    password: 'REDACTED', // DB password
    port: 5432, // Default PostgreSQL port
});

// API endpoint for user signup
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    try {
        // Make sure the user doesn't already exist
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Add the user to the database
        await pool.query('INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5)', [firstName, lastName, username, email, password]);

        res.status(201).json({ message: 'Account created successfully!' });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// API endpoint for user login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query to find the user by username
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            // No user found with this username
            return res.status(400).json({ error: 'User not found' });
        }

        const dbPassword = user.rows[0].password;

        // For now, we're doing a simple password check
        if (password !== dbPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        res.status(200).json({ message: 'Login successful', user: user.rows[0] });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// API endpoint to fetch statistics for the user with id 1 for testing
app.get('/api/statistics/1', async (req, res) => {
    try {
        const stats = await pool.query('SELECT * FROM user_statistics WHERE user_id = 1');

        if (stats.rows.length === 0) {
            return res.status(404).json({ error: 'No statistics found for this user' });
        }

        res.status(200).json(stats.rows[0]);
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});