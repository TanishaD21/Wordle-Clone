import express from "express";
import Hint from "../models/Hint.js";

const router = express.Router();

/**
 * @route  GET /api/hints/:username
 * @desc   Get user's total hints
 */
router.get("/:username", async (req, res) => {
    try {
        const { username } = req.params;
        let user = await Hint.findOne({ username });

        if (!user) {
            user = new Hint({ username });
            await user.save();
        }

        res.json({ totalHints: user.totalHints });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch hints" });
    }
});

/**
 * @route  POST /api/hints/add
 * @desc   Add hints to a user's account
 */
router.post("/add", async (req, res) => {
    try {
        const { username, amount } = req.body;

        if (!username || amount <= 0) {
            return res.status(400).json({ error: "Invalid request" });
        }

        let user = await Hint.findOne({ username });

        if (!user) {
            user = new Hint({ username, totalHints: amount });
        } else {
            user.totalHints += amount;
        }

        await user.save();

        res.json({ message: `Added ${amount} hints!`, totalHints: user.totalHints });
    } catch (error) {
        res.status(500).json({ error: "Failed to add hints" });
    }
});

/**
 * @route  POST /api/hints/use
 * @desc   Use a hint in the game
 */
router.post("/use", async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        let user = await Hint.findOne({ username });

        if (!user || user.totalHints <= 0) {
            return res.status(400).json({ error: "No hints available" });
        }

        user.totalHints -= 1;
        await user.save();

        res.json({ message: "Hint used!", totalHints: user.totalHints });
    } catch (error) {
        res.status(500).json({ error: "Failed to use hint" });
    }
});

export default router;
