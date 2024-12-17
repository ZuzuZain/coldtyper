import React from 'react';
import './Header.css';
import { useTheme } from './contexts/ThemeContext.tsx';
import './theme.css';

const Header = () => {
    const { theme } = useTheme();
    
    return (
        <header className="App-header">
            <h1 className="line-1 anim-typewriter">Welcome to...Coldtyper</h1>
        </header>
    );
};

export default Header;

