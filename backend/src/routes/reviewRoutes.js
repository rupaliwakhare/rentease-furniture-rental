import express from "express";
import {
  addReview,
  getProductReviews,
  getAverageRating,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//  Add review (sirf logged-in user)
router.post("/:id", protect, addReview);

// Get all reviews for a product
router.get("/:id", getProductReviews);

//  Get average rating for a product
router.get("/:id/average", getAverageRating);

export default router;
