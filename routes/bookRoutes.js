import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { createBook, getBooks, getBook, updateBook, deleteBook, issueBook, returnBook, myLoans } from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBook);

// Admin book management
router.post("/", isAuthenticated, authorizeRoles("admin"), createBook);
router.put("/:id", isAuthenticated, authorizeRoles("admin"), updateBook);
router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteBook);

// Borrowing
router.post("/:bookId/issue", isAuthenticated, authorizeRoles("member", "admin"), issueBook);
router.post("/return/:loanId", isAuthenticated, authorizeRoles("member", "admin"), returnBook);
router.get("/me/loans/list", isAuthenticated, myLoans);

export default router;
