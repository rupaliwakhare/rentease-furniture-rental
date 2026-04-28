import express from "express"
import { addAddress,updateAddress,deleteAddress } from "../controllers/addressController.js";

const router = express.Router();
router.post("/address", protect, addAddress);
router.put("/address/:id", protect, updateAddress);
router.delete("/address/:id", protect, deleteAddress);

export default router;