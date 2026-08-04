import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    totalScore: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    highestScore: { type: Number, default: 0 },
    lastPlayed: { type: Date, default: Date.now },
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

export default Leaderboard;
