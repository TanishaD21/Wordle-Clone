import express from "express";
import Leaderboard from "../models/Leaderboard.js";

const router = express.Router();

/**
 * @route  GET /api/leaderboard
 * @desc   Get the top players sorted by highest score
 */
router.get("/", async (req, res) => {
    try {
        const topPlayers = await Leaderboard.find({})
            .sort({ highestScore: -1 }) // Sort by highest score (descending)
            .limit(10); // Limit to top 10 players

        res.json(topPlayers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

/**
 * @route  GET /api/leaderboard/:username
 * @desc   Get a specific player's leaderboard stats
 */
router.get("/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const player = await Leaderboard.findOne({ username });

        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }

        res.json(player);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch player data" });
    }
});

/**
 * @route  POST /api/leaderboard/update
 * @desc   Update player score and leaderboard stats
 */
router.post("/update", async (req, res) => {
    try {
        const { username, score } = req.body;

        if (!username || score === undefined) {
            return res.status(400).json({ error: "Username and score are required" });
        }

        let player = await Leaderboard.findOne({ username });

        if (player) {
            // Update stats if player exists
            player.totalScore += score;
            player.gamesPlayed += 1;
            player.highestScore = Math.max(player.highestScore, score);
            player.lastPlayed = new Date();
        } else {
            // Create new player entry if not found
            player = new Leaderboard({
                username,
                totalScore: score,
                gamesPlayed: 1,
                highestScore: score,
                lastPlayed: new Date(),
            });
        }

        await player.save();
        res.json({ message: "Leaderboard updated successfully", player });
    } catch (error) {
        res.status(500).json({ error: "Failed to update leaderboard" });
    }
});

export default router;
