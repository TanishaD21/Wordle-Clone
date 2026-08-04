import express from "express";
import DailyReward from "../models/DailyReward.js";

const router = express.Router();

/**
 * @route  GET /api/rewards/:username
 * @desc   Get user's daily rewards progress
 */
router.get("/:username", async (req, res) => {
    try {
        const { username } = req.params;
        let user = await DailyReward.findOne({ username });

        if (!user) {
            user = new DailyReward({ username });
            await user.save();
        }

        // Check if rewards should reset (every Sunday)
        const today = new Date();
        if (today.getDay() === 0) {
            user.streak = 0; // Reset streak on Sunday
            await user.save();
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch rewards" });
    }
});

/**
 * @route  POST /api/rewards/claim
 * @desc   Claim daily reward
 */
router.post("/claim", async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        let user = await DailyReward.findOne({ username });

        if (!user) {
            user = new DailyReward({ username });
        }

        const today = new Date().toDateString();
        const lastClaim = user.lastClaimDate ? new Date(user.lastClaimDate).toDateString() : null;

        if (lastClaim === today) {
            return res.status(400).json({ message: "Reward already claimed today!" });
        }

        // Increase streak and total hints
        user.streak = (lastClaim && new Date(user.lastClaimDate).getDate() === new Date().getDate() - 1) ? user.streak + 1 : 1;
        user.totalHints += user.streak;
        user.lastClaimDate = new Date();

        await user.save();

        res.json({ message: `Claimed ${user.streak} hints!`, totalHints: user.totalHints });
    } catch (error) {
        res.status(500).json({ error: "Failed to claim reward" });
    }
});

export default router;
