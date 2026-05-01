import express from "express";
import {
  createCoupon,
  getCoupons,
  getActiveCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from "../controllers/couponController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

//  Admin CRUD
router.post("/", protect, authorize("admin"), createCoupon);
router.get("/", protect, authorize("admin"), getCoupons);
router.put("/:id", protect, authorize("admin"), updateCoupon);
router.delete("/:id", protect, authorize("admin"), deleteCoupon);

// User
router.get("/active", protect, getActiveCoupons);
router.post("/apply", protect, applyCoupon);

export default router;
