import React, { useEffect, useState } from "react";
import "./Victory.css"; 

const VictoryPage = () => {
    const [word, setWord] = useState("HELLO");
    const [attempts, setAttempts] = useState(0);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        // Load game stats from localStorage
        const stats = JSON.parse(localStorage.getItem("wordleStats") || "{}");
        setWord(stats.word || "HELLO");
        setAttempts(stats.attempts || 0);
        setStreak(stats.streak || 0);

        // Start confetti effect
        createConfetti();
        const interval = setInterval(createConfetti, 3000);
        
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const createConfetti = () => {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement("div");
            confetti.className = "confetti";
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.animationDelay = Math.random() * 3 + "s";
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }
    };

    const shareResult = () => {
        const text = `I solved today's Wordle in ${attempts} attempts! 🎯\nCurrent streak: ${streak} 🔥\nPlay at: [your-game-url]`;

        if (navigator.share) {
            navigator.share({ title: "My Wordle Victory!", text });
        } else {
            navigator.clipboard.writeText(text)
                .then(() => alert("Result copied to clipboard!"))
                .catch(() => alert("Unable to copy to clipboard"));
        }
    };

    const playAgain = () => {
        localStorage.removeItem("wordleStats"); // Reset game stats
        window.location.href = "/"; // Redirect to home
    };

    return (
        <div className="victory-container">
            <h1>Congratulations!</h1>

            <div className="stats-card">
                <div className="word-reveal">{word}</div>

                <div className="stats">
                    <div className="stat-item">
                        <div className="stat-value">{attempts}</div>
                        <div className="stat-label">Attempts</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{streak}</div>
                        <div className="stat-label">Streak</div>
                    </div>
                </div>

                <div className="streak-bonus">
                    🌟 +50 points for maintaining streak! 🌟
                </div>

                <div className="buttons">
                    <button className="button play-again" onClick={playAgain}>Play Again</button>
                    <button className="button share" onClick={shareResult}>Share</button>
                </div>
            </div>

            <div className="nav-buttons">
                <a href="/home" className="nav-button home-button">🏠 Home</a>
                <a href="/leaderboard" className="nav-button leaderboard-button">🏆 Leaderboard</a>
                <a href="/daily-rewards" className="nav-button rewards-button">🎁 Daily Rewards</a>
            </div>
        </div>
    );
};

export default VictoryPage;
