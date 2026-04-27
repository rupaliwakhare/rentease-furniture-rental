import { CATEGORIES } from "../constants/categories.js";
import { TENURE_OPTIONS } from "../constants/tenureOptions.js";
import fs from "fs";

export const validateProduct = (req, res, next) => {
  const { name, category, pricePerMonth, deposit, tenureOptions, stock } =
    req.body || {};

  const deleteImage = () => {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log("File delete error:", err);
      });
    }
  };

  // 🔴 Required fields
  if (!name || !category || !pricePerMonth || !deposit) {
    deleteImage();
    return res.status(400).json({
      message: "name, category, pricePerMonth, deposit are required",
    });
  }

  // 🔴 Category validation
  if (!Object.values(CATEGORIES).includes(category)) {
    deleteImage();
    return res.status(400).json({
      message: `Invalid category. Allowed: ${Object.values(CATEGORIES).join(", ")}`,
    });
  }

  // 🔴 Number validation
  if (isNaN(pricePerMonth) || pricePerMonth <= 0) {
    deleteImage();
    return res.status(400).json({
      message: "pricePerMonth must be a positive number",
    });
  }

  if (isNaN(deposit) || deposit < 0) {
    deleteImage();
    return res.status(400).json({
      message: "deposit must be a valid number",
    });
  }

  // 🔴 Tenure validation
  if (tenureOptions) {
    const parsed = Array.isArray(tenureOptions)
      ? tenureOptions
      : [tenureOptions];

    const invalid = parsed.filter((t) => !TENURE_OPTIONS.includes(Number(t)));

    if (invalid.length > 0) {
      deleteImage();
      return res.status(400).json({
        message: `Invalid tenureOptions. Allowed: ${TENURE_OPTIONS.join(", ")}`,
      });
    }
  } // ✅ yaha close karo

  // 🔴 Stock validation (separate block)
  if (stock !== undefined && (isNaN(stock) || stock < 0)) {
    deleteImage();
    return res.status(400).json({
      message: "stock must be a valid number",
    });
  }

  next();
};
