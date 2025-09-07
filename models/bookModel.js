import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, unique: true, sparse: true },
  description: { type: String },
  category: { type: String },
  copies: { type: Number, default: 1, min: 0 },
  available: { type: Number, default: 1, min: 0 },
  coverUrl: { type: String }
}, { timestamps: true });

export default mongoose.model("Book", bookSchema);
