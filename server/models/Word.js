import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
    word: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true }
});

const Word = mongoose.model("Word", wordSchema);

export default Word;
