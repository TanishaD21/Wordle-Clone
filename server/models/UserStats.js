import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    winStreak: { type: Number, default: 0 },
    averageAttempts: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 }
});

userStatsSchema.methods.updateStats = function (isWin, attempts) {
    this.gamesPlayed += 1;
    this.totalAttempts += attempts;

    if (isWin) {
        this.gamesWon += 1;
        this.winStreak += 1;
    } else {
        this.winStreak = 0; // Reset streak on loss
    }

    this.averageAttempts = (this.totalAttempts / this.gamesPlayed).toFixed(2);
};

const UserStats = mongoose.model("UserStats", userStatsSchema);

export default UserStats;
