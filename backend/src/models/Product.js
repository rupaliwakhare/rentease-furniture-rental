import mongoose from "mongoose";
import { CATEGORIES } from "../constants/categories.js";
import { TENURE_OPTIONS } from "../constants/tenureOptions.js";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },

    category: {
      type: String,
      enum: Object.values(CATEGORIES),
      required: true,
    },

    pricePerMonth: { type: Number, required: true },
    deposit: { type: Number, required: true },

    tenureOptions: {
      type: [Number],
      enum: TENURE_OPTIONS,
      default: [1, 3, 6],
    },
    maxTenure: { type: Number, default: 12 },
    renewable: { type: Boolean, default: true },

    stock: { type: Number, default: 1 },
    currentlyRented: { type: Number, default: 0 },

    condition: {
      type: String,
      enum: ["new", "good", "used", "needs repair"],
      default: "good",
    },
    lastMaintenanceDate: { type: Date },

    image: { type: String },
    gallery: [{ type: String }], // multiple images

    isAvailable: { type: Boolean, default: true },

    averageRating: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
      },
    ],

    deliveryCharge: { type: Number, default: 0 },
    returnPolicy: { type: String },
    warranty: { type: String }, // appliances specific
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
