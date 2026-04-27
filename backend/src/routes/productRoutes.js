import express from "express";
import upload from "../config/multer.js";
import { validateProduct } from "../middleware/validationProduct.js";

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
  authorize("admin"),

  upload.single("image"),
  validateProduct,
  createProduct,
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  updateProduct,
  validateProduct,
);

router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
