import express from "express";
import connectDB from "./config/db.js";  // Import the database connection
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import statsRoutes from "./routes/statsRoutes.js";
import wordRoutes from "./routes/wordRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import dailyRewardRoutes from "./routes/dailyRewardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
//import hintRoutes from "./routes/hintRoutes.js";

// Initialize express app
const app = express();

// Setup environment variables
dotenv.config();

// Connect to the database
connectDB();

// Use CORS and JSON middleware
app.use(cors());
app.use(express.json());

// Set up routes
app.use("/api/stats", statsRoutes);
app.use("/api/word", wordRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/rewards", dailyRewardRoutes);
app.use("/api/auth", authRoutes);
//app.use("/api/hints", hintRoutes);

// Start server on the correct port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
