import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

//localStorage.removeItem("wordleLeaderboard");


export function saveToLeaderboard(playerName, score, streak) {
    const username = localStorage.getItem("username");
    const leaderboardData = JSON.parse(localStorage.getItem("wordleLeaderboard")) || {
        daily: [],
        weekly: [],
        allTime: []
    };
    
    const newEntry = { name: username, score, streak, date: new Date().toISOString() };
    
    leaderboardData.daily.push(newEntry);
    leaderboardData.weekly.push(newEntry);
    leaderboardData.allTime.push(newEntry);
    
    localStorage.setItem("wordleLeaderboard", JSON.stringify(leaderboardData));
}

const Leaderboard = () => {
    const navigate = useNavigate();
    const [leaderboardData, setLeaderboardData] = useState({
        daily: [],
        weekly: [],
        allTime: []
    });
    const [activeTab, setActiveTab] = useState("daily");

    useEffect(() => {
        cleanupOldLeaderboardEntries();
        showLeaderboard("daily");
    }, []);

    const cleanupOldLeaderboardEntries = () => {
        const storedData = JSON.parse(localStorage.getItem("wordleLeaderboard")) || {
            daily: [],
            weekly: [],
            allTime: []
        };

        const now = new Date();
        const today = now.toDateString();
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);

        storedData.daily = storedData.daily.filter(entry => new Date(entry.date).toDateString() === today);
        storedData.weekly = storedData.weekly.filter(entry => new Date(entry.date) >= weekAgo);

        localStorage.setItem("wordleLeaderboard", JSON.stringify(storedData));
    };

    const getLeaderboardData = () => {
        const storedData = JSON.parse(localStorage.getItem("wordleLeaderboard")) || {
            daily: [],
            weekly: [],
            allTime: []
        };
        
        Object.keys(storedData).forEach(key => {
            storedData[key].sort((a, b) => b.score - a.score);
            storedData[key] = storedData[key].map((entry, index) => ({
                ...entry,
                rank: index + 1
            }));
        });
        
        return storedData;
    };

    const getMedalEmoji = (rank) => {
        switch (rank) {
            case 1: return "🥇";
            case 2: return "🥈";
            case 3: return "🥉";
            default: return "";
        }
    };

    const showLeaderboard = (type) => {
        setActiveTab(type);
        setLeaderboardData(getLeaderboardData());
    };

    const handleHomeClick = () => {
        navigate("/Home");
    };

    return (
        <div className="leaderboard-container">
            <button className="home-button" onClick={handleHomeClick}>🏠 Home</button>
            <h1 className="leaderboard-title">🏆 Leaderboard 🏆</h1>

            <div className="leaderboard-tabs">
                {["daily", "weekly", "allTime"].map(type => (
                    <button
                        key={type}
                        className={`tab ${activeTab === type ? "active" : ""}`}
                        onClick={() => showLeaderboard(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            <div className="leaderboard-table">
                <div className="table-header">
                    <div className="table-column rank">RANKING</div>
                    <div className="table-column name">NAME</div>
                    <div className="table-column score">SCORE</div>
                    <div className="table-column streak">STEAK</div>
                    <div className="table-column medal">MEDAL</div>
                </div>
                {leaderboardData[activeTab].length === 0 ? (
                    <div className="empty-state">No scores yet for {activeTab} leaderboard! 🎮</div>
                ) : (
                    leaderboardData[activeTab].map(player => (
                        <div key={player.rank} className="table-row">
                            <div className="table-column rank">{player.rank}</div>
                            <div className="table-column name">{player.name}</div>
                            <div className="table-column score">{player.score}</div>
                            <div className="table-column streak">{player.streak || 0}</div>
                            <div className="table-column medal">{getMedalEmoji(player.rank)}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
