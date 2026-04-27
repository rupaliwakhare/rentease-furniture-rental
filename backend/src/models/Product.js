import mongoose from "mongoose";
import { CATEGORIES } from "../constants/categories.js";
import { TENURE_OPTIONS } from "../constants/tenureOptions.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    category: {
      type: String,
      enum: Object.values(CATEGORIES),
      required: true,
    },

    pricePerMonth: {
      type: Number,
      required: true,
    },

    deposit: {
      type: Number,
      required: true,
    },

    tenureOptions: {
      type: [Number],
      enum: TENURE_OPTIONS,
      default: [1, 3, 6],
    },

    stock: {
      type: Number,
      default: 1,
    },

    image: {
      type: String,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
