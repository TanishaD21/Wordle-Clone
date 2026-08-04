import express from "express";
import axios from "axios";
import Word from "../models/Word.js";  // Only if using MongoDB

const router = express.Router();

/**
 * @route  GET /api/word/generate
 * @desc   Generate a random word for the game
 */
router.get("/generate", async (req, res) => {
    console.log("✅ /generate route accessed");

    try {
        // If using MongoDB
        const words = await Word.find({});
        console.log(`📌 Found ${words.length} words in the database`);

        if (words.length === 0) {
            console.log("⚠️ No words found in the database");
            return res.status(404).json({ error: "No words found in the database" });
        }

        const randomWord = words[Math.floor(Math.random() * words.length)].word;
        console.log(`🎯 Selected Word: ${randomWord}`);

        res.json({ word: randomWord });
    } catch (error) {
        console.error("❌ Error in /generate:", error);
        res.status(500).json({ error: "Failed to generate a word" });
    }
});

/**
 * @route  POST /api/word/validate
 * @desc   Validate if the guessed word is correct
 */
router.post("/validate", async (req, res) => {
    console.log("✅ /validate route accessed");
    console.log("📩 Request Body:", req.body);

    try {
        const { guessedWord, correctWord } = req.body;

        if (!guessedWord || !correctWord) {
            console.log("⚠️ Missing parameters:", { guessedWord, correctWord });
            return res.status(400).json({ error: "Missing required parameters" });
        }

        if (guessedWord.toLowerCase() === correctWord.toLowerCase()) {
            console.log(`✅ Correct Guess: ${guessedWord}`);
            return res.json({ valid: true, message: "Correct guess!" });
        } else {
            console.log(`❌ Incorrect Guess: ${guessedWord}`);
            return res.json({ valid: false, message: "Incorrect guess" });
        }
    } catch (error) {
        console.error("❌ Error in /validate:", error);
        res.status(500).json({ error: "Validation failed" });
    }
});

/**
 * @route  GET /api/word/check/:word
 * @desc   Check if the guessed word is a valid dictionary word
 */
router.get("/check/:word", async (req, res) => {
    console.log("✅ /check/:word route accessed");
    console.log(`🔍 Checking word: ${req.params.word}`);

    try {
        const { word } = req.params;

        // Check word in an external dictionary API
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        if (response.data && response.data.length > 0) {
            console.log(`✅ ${word} is a valid dictionary word`);
            res.json({ valid: true, message: "Valid dictionary word" });
        } else {
            console.log(`❌ ${word} is NOT a valid dictionary word`);
            res.json({ valid: false, message: "Not a valid dictionary word" });
        }
    } catch (error) {
        console.error("❌ Error in /check/:word:", error);
        res.status(500).json({ valid: false, message: "Word not found" });
    }
});

export default router;
