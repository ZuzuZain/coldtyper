const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000; // This is the port of the backend server

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

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
