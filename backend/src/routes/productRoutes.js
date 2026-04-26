import express from "express";
import upload from "../config/multer.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
const router = express.Router();




router.get("/", getProducts);

// 🔎 Get single product
router.get("/:id", getProductById);




router.post(
  "/",
  protect,  
  authorize, 
  upload.single("image"),
  createProduct,
);


router.put("/:id", protect, authorize, upload.single("image"), updateProduct);


router.delete("/:id", protect, authorize, deleteProduct);

export default router;
