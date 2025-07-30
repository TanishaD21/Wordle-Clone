// Function to update user stats after a game
export const updateStats = (isWin, attempts) => {
    console.log("📤 Updating local stats...", { isWin, attempts });

    // Get existing stats from localStorage
    const stats = JSON.parse(localStorage.getItem("wordleStats")) || {
        gamesPlayed: 0,
        gamesWon: 0,
        totalAttempts: 0,
        winStreak: 0,
        maxWinStreak: 0
    };

    // Update stats
    stats.gamesPlayed += 1;
    stats.totalAttempts += attempts;
    
    if (isWin) {
        stats.gamesWon += 1;
        stats.winStreak += 1;
        stats.maxWinStreak = Math.max(stats.winStreak, stats.maxWinStreak);
    } else {
        stats.winStreak = 0;  // Reset win streak if lost
    }

    // Save updated stats to localStorage
    localStorage.setItem("wordleStats", JSON.stringify(stats));
    console.log("✅ Stats updated in localStorage:", stats);
};

// Function to fetch user stats for profile page
export const fetchUserStats = () => {
    console.log("📤 Fetching stats from localStorage...");

    // Read from localStorage
    const stats = JSON.parse(localStorage.getItem("wordleStats")) || {
        gamesPlayed: 0,
        gamesWon: 0,
        totalAttempts: 0,
        winStreak: 0,
        maxWinStreak: 0
    };

    console.log("📡 Stats retrieved:", stats);
    return stats;
};
