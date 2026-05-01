import Coupon from "../models/Coupon.js";

// ✅ Create (Admin)
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ message: "Coupon created", coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Read all (Admin)
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Read active (User)
export const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      expiry: { $gte: new Date() },
      $expr: { $lt: ["$usedCount", "$usageLimit"] },
    });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update (Admin)
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon updated", coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete (Admin)
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Apply (User)
export const applyCoupon = async (req, res) => {
  try {
    const { couponCode, totalAmount } = req.body;

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    if (coupon.expiry < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (totalAmount * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    const finalAmount = totalAmount - discount;

    res.json({ message: "Coupon applied", discount, finalAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
