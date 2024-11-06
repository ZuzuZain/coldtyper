// Leaderboard.js imports
import React, { useState, useEffect } from 'react';
import Header from './Header';
import './Leaderboard.css';
import './MainScreen.css';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    const navigate = useNavigate();

    // Fetch leaderboard data when the component mounts
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/leaderboard', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const data = await response.json();
                setLeaderboard(data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        };
        fetchLeaderboard();
    }, []);

    // Navigate to Leaderboard page
  const handleLeaderboardClick = () => {
    navigate('/leaderboard'); 
  };

  const handleStatisticsClick = () => {
    navigate('/statistics'); // Navigate to the statistics page
  };

  const handleMainClick = () => {
    navigate('/main'); // Navigate to the main page
  };

  // Function to handle logout
  const handleGoBack = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include', // Make sure cookies/sessions are included
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // Redirect to login page on successful logout
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

    return (
        <div>
            <Header />
            <div className="MainScreen-container">
            <nav className="sidebar">

                <button onClick={handleMainClick} className="sidebar-button">
                    Main Menu
                </button>
          
                <button onClick={handleLeaderboardClick} className="sidebar-button">
                    Leaderboard
                </button>

                <button onClick={handleStatisticsClick} className="sidebar-button">
                    User Statistics
                </button>

                <button onClick={handleGoBack} className="sidebar-button">
                    Logout
                </button>

            </nav>

            <div className="leaderboard-content">
            <h1>Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Fastest WPM</th>
                        <th>Highest Accuracy</th>
                        <th>Total Tests</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((user, index) => (
                        <tr key={user.username}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.fastest_wpm}</td>
                            <td>{user.highest_accuracy}%</td>
                            <td>{user.total_tests}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            </div>
        </div>
    );
};

export default Leaderboard;