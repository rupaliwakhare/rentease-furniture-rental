import mongoose from "mongoose";
import { CATEGORIES } from "../constants/categories.js";
import { TENURE_OPTIONS } from "../constants/tenureOptions.js";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true }, // SEO friendly

    description: { type: String },

    category: {
      type: String,
      enum: Object.values(CATEGORIES),
      required: true,
      index: true,
    },

    pricePerMonth: { type: Number, required: true, min: 0 },
    deposit: { type: Number, required: true, min: 0 },

    tenureOptions: {
      type: [Number],
      enum: TENURE_OPTIONS,
      default: [1, 3, 6],
    },
    maxTenure: { type: Number, default: 12 },
    renewable: { type: Boolean, default: true },

    stock: { type: Number, default: 1, min: 0 },
    currentlyRented: { type: Number, default: 0, min: 0 },

    condition: {
      type: String,
      enum: ["new", "good", "used", "needs repair"],
      default: "good",
    },
    lastMaintenanceDate: { type: Date },

    image: { type: String },
    gallery: [{ type: String }],

    isAvailable: { type: Boolean, default: true, index: true },

    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
      },
    ],

    deliveryCharge: { type: Number, default: 0 },
    returnPolicy: { type: String },
    warranty: { type: String },

    discount: { type: Number, default: 0 }, // percentage

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
