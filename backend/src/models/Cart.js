import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1, // zero ya negative na ho
    },

    tenure: {
      type: Number,
      required: true,
      min: 1, // ❗ at least 1 month
    },

    deliveryDate: {
      type: Date,
      required: true,
    },

    totalRent: {
      type: Number,
      required: true,
    },

    deposit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

//  One product per user (duplicate entry avoid)
cartSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("Cart", cartSchema);
