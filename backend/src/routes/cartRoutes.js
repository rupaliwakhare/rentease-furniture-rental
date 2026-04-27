import express from "express";
import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:id", protect, updateCart);
router.delete("/:id", protect, removeFromCart);
router.delete("/", protect, clearCart);

export default router;
