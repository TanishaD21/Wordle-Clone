import mongoose from "mongoose";
import dotenv from "dotenv";
import Word from "./models/Word.js"; // Ensure this path is correct

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Sample words to insert
const words = [
    { word: "APPLE", difficulty: "easy" },
    { word: "BANJO", difficulty: "easy" },
    { word: "CHAIR", difficulty: "medium" },
    { word: "MANGO", difficulty: "easy" },
    { word: "PEACH", difficulty: "easy" },
    { word: "QUICK", difficulty: "hard" },
    { word: "ZEBRA", difficulty: "medium" },
    { word: "BRAVE", difficulty: "easy" },
    { word: "CRISP", difficulty: "medium" },
    { word: "DRIVE", difficulty: "easy" },
    { word: "EAGER", difficulty: "medium" },
    { word: "FAITH", difficulty: "hard" },
    { word: "GLASS", difficulty: "easy" },
    { word: "HAPPY", difficulty: "easy" },
    { word: "JOLLY", difficulty: "medium" },
    { word: "KNOCK", difficulty: "hard" },
    { word: "LUCKY", difficulty: "easy" },
    { word: "BRAIN", difficulty: "medium" },
    { word: "NOBLE", difficulty: "hard" },
    { word: "OCEAN", difficulty: "easy" },
    { word: "PLUMB", difficulty: "medium" },
    { word: "QUILT", difficulty: "hard" },
    { word: "RIDER", difficulty: "easy" },
    { word: "SHINE", difficulty: "medium" },
    { word: "TIGER", difficulty: "easy" },
    { word: "UPPER", difficulty: "medium" },
    { word: "VIVID", difficulty: "hard" },
    { word: "WONKY", difficulty: "hard" },
    { word: "XYLOX", difficulty: "hard" },
    { word: "YOUTH", difficulty: "medium" },
    { word: "ZAPPY", difficulty: "hard" },
    { word: "BREAD", difficulty: "easy" },
    { word: "CROWN", difficulty: "medium" },
    { word: "DANCE", difficulty: "easy" },
    { word: "ELDER", difficulty: "medium" },
    { word: "FROST", difficulty: "hard" },
    { word: "GRAND", difficulty: "easy" },
    { word: "HOVER", difficulty: "medium" },
    { word: "INNER", difficulty: "hard" },
    { word: "JUMBO", difficulty: "medium" },
    { word: "KARMA", difficulty: "hard" },
    { word: "LIGHT", difficulty: "easy" },
    { word: "MIRTH", difficulty: "medium" },
    { word: "NERVE", difficulty: "hard" },
    { word: "ORBIT", difficulty: "medium" },
    { word: "PIXEL", difficulty: "hard" },
    { word: "QUARK", difficulty: "hard" },
    { word: "ROBOT", difficulty: "easy" },
    { word: "SOLAR", difficulty: "medium" },
    { word: "THRUM", difficulty: "hard" }
];

// Function to insert words
const seedDB = async () => {
    try {
        await Word.deleteMany(); // Clear existing data
        console.log("Old words deleted.");

        words.forEach(word => console.log("Inserting:", word)); // Log each word

        const insertedWords = await Word.insertMany(words);
        console.log("Words added successfully!", insertedWords);

        mongoose.connection.close();
    } catch (err) {
        console.error("Seeding error:", err);
    }
};


// Run the function
seedDB();
