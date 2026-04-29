import express from "express";
import { verifyPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Verify Razorpay payment
router.post("/verify", protect, verifyPayment);

export default router;
