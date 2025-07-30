import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css"; // Ensure you have this CSS file for styling

const Profile = () => {
  const navigate = useNavigate();
  const uname = localStorage.getItem("username");
  const [username, setUsername] = useState(uname);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    bestStreak: 0,
    winRate: 0,
  });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("token"); 
    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    loadUserData(); // Load stats from localStorage
  }, []);

  // Load user stats from localStorage
  const loadUserData = () => {
    const storedStats = JSON.parse(localStorage.getItem("wordleStats")) || {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      bestStreak: 0,
      winRate: 0,
    };
    setStats(storedStats);
  };

  // Save profile name
  const saveProfile = () => {
    localStorage.setItem("username", username);
    document.querySelector(".save-button").textContent = "Saved!";
    setTimeout(() => {
      document.querySelector(".save-button").textContent = "Save Changes";
    }, 2000);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  // Achievements Logic
  const achievements = [
    { id: "firstWin", icon: "🎯", name: "First Win", condition: stats.gamesWon > 0 },
    { id: "streak3", icon: "🔥", name: "3 Day Streak", condition: stats.currentStreak >= 3 },
    { id: "quickSolver", icon: "⚡", name: "Quick Solver", condition: stats.gamesWon > 0 && stats.winRate >= 50 },
    { id: "master", icon: "🌟", name: "Word Master", condition: stats.bestStreak >= 5 },
  ];

  return (
    <div className="container">
      <div className="nav-buttons">
        <a href="/home" className="nav-button">🏠 Home</a>
      </div>

      <div className="profile-header">
        <div className="profile-avatar">👤</div>
        <h1 className="profile-name">{username}</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.gamesPlayed}</div>
          <div className="stat-label">Games Played</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.winRate}%</div>
          <div className="stat-label">Win Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.bestStreak}</div>
          <div className="stat-label">Best Streak</div>
        </div>
      </div>

      <div className="achievements">
        <div className="achievement-title">🏆 Achievements</div>
        <div className="achievement-grid">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="achievement" style={{ opacity: achievement.condition ? "1" : "0.5" }}>
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-name">{achievement.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="edit-profile">
        <div className="achievement-title">✏️ Edit Profile</div>
        <div className="edit-field">
          <label>Display Name</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <button className="save-button" onClick={saveProfile}>Save Changes</button>
      </div>

      <button className="save-button logout-btn" onClick={logout}>🚪 Logout</button>
    </div>
  );
};

export default Profile;
