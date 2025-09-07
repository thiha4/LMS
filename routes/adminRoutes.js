import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { listUsers, listLoans } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", isAuthenticated, authorizeRoles("admin"), listUsers);
router.get("/loans", isAuthenticated, authorizeRoles("admin"), listLoans);

export default router;
