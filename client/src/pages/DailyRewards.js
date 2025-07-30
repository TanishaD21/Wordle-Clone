import React, { useState, useEffect } from "react";
import './DailyRewards.css';

const DailyRewards = () => {
  // State variables
  const [hints, setHints] = useState(parseInt(localStorage.getItem("wordleHints")) || 0);
  const [currentDay, setCurrentDay] = useState(parseInt(localStorage.getItem("currentDay")) || 1);
  const [claimedDates, setClaimedDates] = useState(JSON.parse(localStorage.getItem("claimedDates")) || {});

  // Check if today's reward can be claimed
  const canClaimToday = () => {
    const today = new Date().toDateString();
    return !claimedDates[today];
  };

  // Update UI and localStorage when claiming reward
  const claimReward = (day) => {
    if (day === currentDay && canClaimToday()) {
      const today = new Date().toDateString();

      // Add hints
      const newHints = hints + day;
      setHints(newHints);
      localStorage.setItem("wordleHints", newHints);

      // Mark as claimed
      const updatedClaims = { ...claimedDates, [today]: true };
      setClaimedDates(updatedClaims);
      localStorage.setItem("claimedDates", JSON.stringify(updatedClaims));

      // Move to the next day
      const newDay = currentDay + 1;
      setCurrentDay(newDay);
      localStorage.setItem("currentDay", newDay);
    }
  };

  // Check for weekly reset on Sundays
  useEffect(() => {
    const today = new Date();
    if (today.getDay() === 0) {
      const lastReset = localStorage.getItem("lastResetDate");
      if (lastReset !== today.toDateString()) {
        // Reset everything
        setCurrentDay(1);
        setClaimedDates({});
        localStorage.setItem("currentDay", 1);
        localStorage.setItem("claimedDates", JSON.stringify({}));
        localStorage.setItem("lastResetDate", today.toDateString());
      }
    }
  }, []);

  // Update state when returning to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setHints(parseInt(localStorage.getItem("wordleHints")) || 0);
        setCurrentDay(parseInt(localStorage.getItem("currentDay")) || 1);
        setClaimedDates(JSON.parse(localStorage.getItem("claimedDates")) || {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <div className="container">
      <h1>Daily Rewards</h1>

      <div className="weekly-info">
        <div className="weekly-text">Rewards reset every Sunday</div>
      </div>

      <div className="hints-available">
        <div className="total-hints">
          🎯 Available Hints: <span>{hints}</span>
        </div>
        <p>Use hints in your next game!</p>
      </div>

      <div className="rewards-grid">
        {[...Array(7)].map((_, index) => {
          const day = index + 1;
          const isClaimed = day < currentDay;
          const isToday = day === currentDay;
          const canClaim = isToday && canClaimToday();
          const buttonText = isClaimed
            ? "Claimed"
            : isToday
            ? canClaim
              ? "Claim"
              : "Come back tomorrow"
            : `Come back in ${day - currentDay} days`;

          return (
            <div key={day} className={`reward-card ${isClaimed ? "claimed" : ""}`} data-day={day}>
              <div className="reward-day">Day {day}</div>
              <div className="reward-icon">🎯</div>
              <div className="hint-count">+{day} Hints</div>
              <button
                className="claim-button"
                disabled={!canClaim}
                onClick={() => claimReward(day)}
              >
                {buttonText}
              </button>
            </div>
          );
        })}
      </div>

      <div className="nav-buttons">
        <a href="/home" className="nav-button home-button">🏠 Home</a>
        <a href="/leaderboard" className="nav-button">🏆 Leaderboard</a>
      </div>
    </div>
  );
};

export default DailyRewards;
