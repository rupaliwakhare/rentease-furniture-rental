import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ONLY ADMIN
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin Access Granted" });
});

// USER + ADMIN
router.get("/dashboard", protect, authorize("user", "admin"), (req, res) => {
  res.json({ message: "Dashboard Access" });
});

export default router;
