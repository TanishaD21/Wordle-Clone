import React, { useState, useEffect } from "react";
import "./Home.css"; // Ensure you have this CSS file
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const navigate = useNavigate();
    const [menuActive, setMenuActive] = useState(false);
    const [hints, setHints] = useState(0);
    const [topPlayers, setTopPlayers] = useState([]);

    useEffect(() => {

        // Fetch leaderboard
        axios.get("/api/leaderboard")
            .then(response => setTopPlayers(response.data))
            .catch(error => console.error("Error fetching leaderboard:", error));
    }, []);

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    return (
        <div className="home-container">
            <div className="doodle doodle1">🎯</div>
            <div className="doodle doodle2">🎲</div>
            <div className="doodle doodle3">🎮</div>
            <div className="doodle doodle4">🔠</div>
            {/* Navigation Menu */}
            <nav className="nav-menu">
                <div className="nav-container">
                    <Link to="/" className="logo">WORDLE</Link>
                    <div className="menu-toggle" onClick={toggleMenu}>☰</div>
                    <div className={`nav-links ${menuActive ? "active" : ""}`}>
                        <Link to="/about" className="nav-link">About Us</Link>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-link">Sign Up</Link>
                        <Link to="/daily-rewards" className="nav-link">Daily Rewards</Link>
                        <div className="profile-icon"><Link to="/profile">👤</Link></div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <br></br>
            <div className="container">
                <h1 className="game-over letter">WORDLE</h1>
                <div className="description">
                    You think you can compete with Shakespeare? Try this word game and see for yourself!
                </div>
                <Link to="/game"><button className="play-button">Play Now</button></Link>

                {/* Instructions */}
                <div className="instructions">
                    <h2>How to Play</h2>
                    <p>🎯 Guess the WORDLE in 6 tries</p>
                    <p>🎲 Each guess must be a valid 5-letter word</p>
                    <p>🔵 Blue tiles mean correct letter, correct spot</p>
                    <p>🟣 Purple tiles mean correct letter, wrong spot</p>
                    <p>⚪ Gray tiles mean letter not in word</p>
                </div>

                {/* Game Modes */}
                <div className="game-modes">
                    <div className="game-card" onClick={() => window.location.href='/daily-puzzle'}>
                        <h3>Daily Puzzle</h3>
                    </div>
                    <div className="game-card" onClick={() => window.location.href='/classic-mode'}>
                        <h3>Classic Shenanigans</h3>
                    </div>
                    <div className="game-card" onClick={() => window.location.href='/daily-rewards'}>
                        <h3>Daily Rewards</h3>
                    </div>
                    <div className="game-card" onClick={() => window.location.href='/leaderboard'}>
                        <h3>Leaderboard</h3>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="leaderboard-section">
                    <h2>🏆 Top Players</h2>
                    <ul>
                        {topPlayers.length > 0 ? (
                            topPlayers.map((player, index) => (
                                <li key={index}>
                                    {player.username}: {player.score} points
                                </li>
                            ))
                        ) : (
                            <p>No leaderboard data available</p>
                        )}
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <footer>
                <p>&copy; 2025 Wordle</p>
            </footer>
        </div>
    );
};

export default Home;
