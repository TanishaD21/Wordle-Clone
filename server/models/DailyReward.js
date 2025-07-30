import mongoose from "mongoose";

const dailyRewardSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    lastClaimDate: { type: Date, default: null },
    streak: { type: Number, default: 0 },
    totalHints: { type: Number, default: 0 },
});

const DailyReward = mongoose.model("DailyReward", dailyRewardSchema);

export default DailyReward;
