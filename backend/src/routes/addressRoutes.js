import express from "express";
import {
  addAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Clean REST routes
router.post("/", protect, addAddress); 
router.get("/", protect, getAddresses); // all
router.get("/:id", protect, getAddressById); // single
router.put("/:id", protect, updateAddress); 
router.delete("/:id", protect, deleteAddress); 

export default router;
