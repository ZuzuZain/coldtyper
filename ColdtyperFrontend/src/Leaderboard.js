import React, { useState, useEffect } from 'react';
import Header from './Header';
import './Leaderboard.css';
import './MainScreen.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext.tsx';
import './theme.css';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/leaderboard`, {
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

    const handleLeaderboardClick = () => {
        navigate('/leaderboard');
    };

    const handleStatisticsClick = () => {
        navigate('/statistics');
    };

    const handleMainClick = () => {
        navigate('/main');
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                navigate('/');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div data-theme={theme} className="leaderboard-container">
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
                    <button onClick={handleLogout} className="sidebar-button">
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

