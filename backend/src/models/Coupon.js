import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ["percentage", "flat"], required: true },
  discountValue: { type: Number, required: true },
  expiry: { type: Date, required: true },
  usageLimit: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  applicableProducts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  ],
});

export default mongoose.model("Coupon", couponSchema);
