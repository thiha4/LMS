import Loan from "../models/loanModel.js";
import User from "../models/userModel.js";
import Book from "../models/bookModel.js";
import sendEmail from "./sendEmail.js";
import { overdueReminderTemplate } from "./emailTemplates.js";

export const sendOverdueReminders = async () => {
  const now = new Date();
  const overdueLoans = await Loan.find({ status: { $ne: "returned" }, dueAt: { $lt: now } })
    .populate("user")
    .populate("book");

  for (const loan of overdueLoans) {
    if (loan.status !== "overdue") {
      loan.status = "overdue";
      await loan.save();
    }
    const message = overdueReminderTemplate(loan.user.name, loan.book.title, loan.dueAt);
    await sendEmail({
      email: loan.user.email,
      subject: "Overdue Book Reminder",
      message,
    });
  }
};
