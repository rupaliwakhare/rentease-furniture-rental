import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        tenure: Number,
        deliveryDate: Date,
        totalRent: Number,
        deposit: Number,
      },
    ],

    addresses: [
      {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        mobile: {
          type: String,
          required: true,
          match: /^[0-9]{10}$/,
        },
        street: String,
        area: String,
        landmark: String,
        city: String,
        state: String,
        country: {
          type: String,
          default: "India",
        },
        pincode: String,

        type: {
          type: String,
          enum: ["home", "office"],
          default: "home",
        },

        // 🔥 Furniture rental specific fields
        floor: String,
        hasLift: {
          type: Boolean,
          default: false,
        },

        deliveryInstructions: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],

    totalAmount: Number,

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "active",
        "completed",
        "returned",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
