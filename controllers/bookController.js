import Book from "../models/bookModel.js";
import Loan from "../models/loanModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, isbn, description, category, copies } = req.body;
  const book = await Book.create({
    title, author, isbn, description, category, copies: copies || 1, available: copies || 1
  });
  res.status(201).json({ success: true, book });
});

export const getBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json({ success: true, books });
});

export const getBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 404));
  res.json({ success: true, book });
});

export const updateBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!book) return next(new ErrorHandler("Book not found", 404));
  res.json({ success: true, book });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 404));
  if (book.copies !== book.available) return next(new ErrorHandler("Cannot delete: book has active loans", 400));
  await book.deleteOne();
  res.json({ success: true, message: "Book deleted" });
});

export const issueBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { days = 14 } = req.body;
  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorHandler("Book not found", 404));
  if (book.available < 1) return next(new ErrorHandler("No copies available", 400));

  const dueAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const loan = await Loan.create({ user: req.user._id, book: book._id, dueAt });
  book.available -= 1;
  await book.save();

  res.status(201).json({ success: true, loan });
});

export const returnBook = catchAsyncErrors(async (req, res, next) => {
  const { loanId } = req.params;
  const loan = await Loan.findById(loanId).populate("book");
  if (!loan) return next(new ErrorHandler("Loan not found", 404));
  if (loan.status === "returned") return next(new ErrorHandler("Already returned", 400));

  loan.status = "returned";
  loan.returnedAt = new Date();
  await loan.save();

  const book = loan.book;
  book.available += 1;
  await book.save();

  res.json({ success: true, loan });
});

export const myLoans = catchAsyncErrors(async (req, res, next) => {
  const loans = await Loan.find({ user: req.user._id }).populate("book");
  res.json({ success: true, loans });
});
