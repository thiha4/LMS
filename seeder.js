// seeder.js
import mongoose from "mongoose";
import User from "./models/userModel.js";
import Book from "./models/bookModel.js";

// ✅ Hardcoded MongoDB URI (your local DB)
const MONGO_URI = "mongodb://127.0.0.1:27017/libraryDB";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected to libraryDB");
  } catch (error) {
    console.error("❌ DB Connection failed:", error);
    process.exit(1);
  }
};

// Sample users
const users = [
  { name: "Admin User", email: "admin@example.com", password: "123456", role: "admin" },
  { name: "John Doe", email: "john@example.com", password: "123456", role: "member" },
  { name: "Jane Smith", email: "jane@example.com", password: "123456", role: "member" },
];

// Sample books
const books = [
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic", isbn: "9780743273565", availableCopies: 5 },
  { title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", isbn: "9780061120084", availableCopies: 3 },
  { title: "1984", author: "George Orwell", category: "Dystopian", isbn: "9780451524935", availableCopies: 4 },
];

// Import sample data
const importData = async () => {
  try {
    await connectDB();

    // Delete existing data
    await User.deleteMany();
    await Book.deleteMany();

    // Insert sample data
    await User.insertMany(users);
    await Book.insertMany(books);

    console.log("✅ Sample data imported successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error importing data:", err);
    process.exit(1);
  }
};

// Run seeder
importData();
