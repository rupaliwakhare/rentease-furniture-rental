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
    },

    tenure: {
      type: Number,
      required: true, // months
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

// one product per user
cartSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("Cart", cartSchema);
