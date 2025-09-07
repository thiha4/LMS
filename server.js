import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import cron from "node-cron";
import { sendOverdueReminders } from "./utils/overdueJobs.js";

dotenv.config({ path: "./config/config.env" });

// Connect DB
connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Cron job: check overdue loans every day at 09:00
cron.schedule("0 9 * * *", async () => {
  try {
    await sendOverdueReminders();
  } catch (err) {
    console.error("Cron job failed:", err.message);
  }
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});
