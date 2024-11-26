const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const axios = require("axios");

const app = express();
const port = 5000; // This is the port of the local backend server

app.set("trust proxy", 1); // Trust first proxy

require("dotenv").config({ path: "../.env" });

// Middleware
app.use(
  cors({
    origin: 'https://frontend.coldtyper.com',
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true, // Allow cookies to be included
  })
);
app.use(express.json()); // For parsing application/json

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'none',
      domain: 'coldtyper.com',
    },
  })
);

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// API endpoint for user signup
app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Make sure the user doesn't already exist
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert the new user into the database
    await pool.query(
      "INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5)",
      [firstName, lastName, username, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Signup failed" });
  }
});

// API endpoint for user login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query to find the user by username
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      // No user found with this username
      return res.status(400).json({ error: "User not found" });
    }

    const dbPassword = user.rows[0].password;

    const match = await bcrypt.compare(password, dbPassword);

    if (!match) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Create a session for the user
    req.session.userId = user.rows[0].id;

    res.status(200).json({ message: "Login successful", user: user.rows[0] });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/statistics", async (req, res) => {
  const userId = req.session.userId; // Get user ID from the session

  if (!userId) {
    console.log("Unauthorized access: userId is not set"); // Log if userId is not set
    return res.status(401).json({ error: "Unauthorized" }); // User not logged in
  }

  try {
    const stats = await pool.query(
      "SELECT * FROM user_statistics WHERE id = $1",
      [userId]
    );
    console.log("Statistics fetched:", stats.rows); // Log the fetched statistics

    if (stats.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No statistics found for this user" });
    }

    // Optionally fetch username if it's in the users table
    const user = await pool.query("SELECT username FROM users WHERE id = $1", [
      userId,
    ]);

    res.status(200).json({
      username: user.rows[0]?.username || "User",
      fastest_wpm: stats.rows[0].fastest_wpm,
      highest_accuracy: stats.rows[0].highest_accuracy,
      total_tests: stats.rows[0].total_tests,
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// API endpoint to update user's typing test results
app.post("/api/updateResults", async (req, res) => {
  const userId = req.session.userId; // Get user ID from the session
  const { wpm, accuracy } = req.body; // Get WPM and accuracy from request body

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Check if the user already has statistics in the table
    const existingStats = await pool.query(
      "SELECT * FROM user_statistics WHERE id = $1",
      [userId]
    );

    if (existingStats.rows.length === 0) {
      // No entry exists, insert new statistics
      await pool.query(
        "INSERT INTO user_statistics (id, fastest_wpm, highest_accuracy, total_tests) VALUES ($1, $2, $3, $4)",
        [userId, wpm, accuracy, 1]
      );
      res.status(201).json({ message: "Statistics added successfully" });
    } else {
      // Entry exists, update the statistics if the new results are better
      const currentStats = existingStats.rows[0];
      const newFastestWpm = Math.max(currentStats.fastest_wpm, wpm);
      const newHighestAccuracy = Math.max(
        currentStats.highest_accuracy,
        accuracy
      );

      await pool.query(
        "UPDATE user_statistics SET fastest_wpm = $1, highest_accuracy = $2, total_tests = total_tests + 1 WHERE id = $3",
        [newFastestWpm, newHighestAccuracy, userId]
      );
      res.status(200).json({ message: "Statistics updated successfully" });
    }
  } catch (error) {
    console.error("Error updating statistics:", error);
    res.status(500).json({ error: "Failed to update statistics" });
  }
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    const leaderboard = await pool.query(`
            SELECT username, fastest_wpm, highest_accuracy, total_tests
            FROM user_statistics
            JOIN users ON user_statistics.id = users.id
            ORDER BY fastest_wpm DESC;
        `);
    res.status(200).json(leaderboard.rows);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to retrieve leaderboard" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).json({ message: "Logout successful" });
  });
});

app.get("/api/generate-text", async (req, res) => {
  const { difficulty = "medium", wordCount = 75 } = req.query;

  try {
    const text = await generateText(difficulty, wordCount);
    res.json({ text });
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).json({ error: "Failed to generate text" });
  }
});

async function generateText(difficulty, wordCount) {
    const maxLength = difficulty === "easy" ? 5 : difficulty === "medium" ? 7 : 9;
  
    let selectedWords = [];
    while (selectedWords.length < wordCount) {
      const words = await fetchWords(wordCount * 2); // Fetch extra words to filter
      const filteredWords = words.filter((word) => word.length <= maxLength);
      selectedWords = selectedWords.concat(filteredWords);
  
      // Limit to the required number of words
      selectedWords = selectedWords.slice(0, wordCount);
    }
  
    return selectedWords.join(" ");
  }
  

async function fetchWords(count) {
  try {
    const response = await axios.get(
      `https://random-word-api.vercel.app/api?words=${count}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching words:", error);
    throw new Error("Failed to fetch words");
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});