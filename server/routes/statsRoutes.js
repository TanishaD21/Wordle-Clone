import express from "express";
import UserStats from "../models/UserStats.js";

const router = express.Router();

/**
 * @route  GET /api/stats/:userId
 * @desc   Get user game stats
 */
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const stats = await UserStats.findOne({ userId });

        if (!stats) {
            return res.status(404).json({ message: "User stats not found" });
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

/**
 * @route  POST /api/stats/update
 * @desc   Update user stats after a game
 */
router.post("/update", async (req, res) => {
    try {
        const { userId, isWin, attempts } = req.body;

        let stats = await UserStats.findOne({ userId });

        if (!stats) {
            stats = new UserStats({ userId });
        }

        // Update stats using schema method
        stats.updateStats(isWin, attempts);
        await stats.save();

        res.json({ message: "Stats updated", stats });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
