import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 🔹 User who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔹 Items rented in this order
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        tenure: { type: Number, required: true }, // months
        deliveryDate: Date,
        returnDate: Date,
        totalRent: { type: Number, required: true },
        deposit: { type: Number, required: true },
        renewable: { type: Boolean, default: true },
        extendedTenure: Number,
      },
    ],

    // 🔹 Delivery addresses
    addresses: [
      {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
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
        country: { type: String, default: "India" },
        pincode: String,

        type: { type: String, enum: ["home", "office"], default: "home" },

        // 🔥 Furniture rental specific fields
        floor: String,
        hasLift: { type: Boolean, default: false },
        deliveryInstructions: String,
        isDefault: { type: Boolean, default: false },
      },
    ],

    // 🔹 Financials
    totalAmount: { type: Number, required: true },
    paymentId: { type: String, index: true },
    razorpayOrderId: { type: String, index: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    // 🔹 Order status
    status: {
      type: String,
      enum: [
        "pending", // order placed
        "confirmed", // payment verified
        "shipped", // dispatched
        "delivered", // furniture delivered
        "active", // rental period running
        "completed", // rental finished
        "returned", // furniture returned
        "cancelled", // cancelled
      ],
      default: "pending",
    },

    // 🔹 Rental lifecycle
    rentalStatus: {
      type: String,
      enum: ["active", "expired", "extended"],
      default: "active",
    },
    refundAmount: { type: Number, default: 0 },

    // 🔹 Delivery logistics
    deliverySlot: String, // e.g. "10AM-1PM"
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    trackingId: String,

    // 🔹 Return tracking
    isReturned: { type: Boolean, default: false },
    returnCondition: {
      type: String,
      enum: ["good", "damaged", "needs repair"],
      default: "good",
    },

    // 🔹 Audit & history
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    activityLog: [
      {
        action: String, // e.g. "status updated to delivered"
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
