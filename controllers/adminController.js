import User from "../models/userModel.js";
import Loan from "../models/loanModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const listUsers = catchAsyncErrors(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, users });
});

export const listLoans = catchAsyncErrors(async (req, res) => {
  const loans = await Loan.find().populate("user").populate("book").sort({ createdAt: -1 });
  res.json({ success: true, loans });
});
