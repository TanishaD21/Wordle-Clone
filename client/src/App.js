import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import DailyRewards from "./pages/DailyRewards";
import Victory from './pages/Victory';
import About from './pages/About';
import DailyPuzzle from './pages/DailyPuzzle';
import ClassicMode from './pages/ClassicMode';
import Profile from './pages/Profile';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check localStorage for an existing session
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          setUser(storedUser);
        }
      }, []);
      
    return (
        <Router>
            <div>
                {/* Navigation Bar */}
                <nav className="navbar">
                    <Link to="/" className="nav-link">🏠 Home</Link>
                    <Link to="/game" className="nav-link">🎮 Play</Link>
                    <Link to="/daily-rewards" className="nav-link">🎁 Daily Rewards</Link>
                    <Link to="/leaderboard" className="nav-link">🏆 Leaderboard</Link>
                    <Link to="/login" className="nav-link">🔑 Login</Link>
                    <Link to="/signup" className="nav-link">Sign up</Link>
                    <Link to="/about" className="nav-link">About</Link>
                </nav>

                {/* Page Routes */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/daily-rewards" element={<DailyRewards />} />
                    <Route path="/victory" element={<Victory />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/daily-puzzle" element={<DailyPuzzle />} />
                    <Route path="/classic-mode" element={<ClassicMode />} />
                    <Route path="/profile" element={<Profile user={user} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
