import mongoose from "mongoose";

const hintSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    totalHints: { type: Number, default: 0 },
});

const Hint = mongoose.model("Hint", hintSchema);

export default Hint;
