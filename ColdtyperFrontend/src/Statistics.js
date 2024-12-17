import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Statistics.css';
import Header from './Header';
import { useTheme } from './contexts/ThemeContext.tsx';
import './theme.css';

const Statistics = () => {
    const { theme } = useTheme();
    const [username, setUsername] = useState('User');
    const [fastestWpm, setFastestWpm] = useState(0);
    const [highestAccuracy, setHighestAccuracy] = useState(0);
    const [totalTests, setTotalTests] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/statistics`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const stats = await response.json();
                    setUsername(stats.username || 'User');
                    setFastestWpm(stats.fastest_wpm || 0);
                    setHighestAccuracy(stats.highest_accuracy || 0);
                    setTotalTests(stats.total_tests || 0);
                } else {
                    console.error('Failed to fetch statistics:', await response.json());
                }
            } catch (error) {
                console.error('Error fetching user statistics:', error);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div data-theme={theme} className="statistics-container">
            <Header />
            <div className="statistics-layout">
                <nav className="sidebar">
                    <button onClick={() => navigate('/main')} className="sidebar-button">
                        Main Menu
                    </button>
                    <button onClick={() => navigate('/leaderboard')} className="sidebar-button">
                        Leaderboard
                    </button>
                    <button onClick={() => navigate('/statistics')} className="sidebar-button">
                        User Statistics
                    </button>
                    <button onClick={() => navigate('/')} className="sidebar-button">
                        Logout
                    </button>
                </nav>

                <div className="statistics-content">
                    <h1>User Statistics</h1>
                    <h2>{username}</h2>
                    <div className="stat">
                        <label>Fastest WPM:</label>
                        <span>{fastestWpm.toFixed(2)}</span>
                    </div>
                    <div className="stat">
                        <label>Highest Accuracy:</label>
                        <span>{highestAccuracy.toFixed(2)}%</span>
                    </div>
                    <div className="stat">
                        <label>Total Tests Taken:</label>
                        <span>{totalTests}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;

