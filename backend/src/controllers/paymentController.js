import crypto from "crypto";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      userId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // ✅ update order status
      await Order.findByIdAndUpdate(orderId, {
        status: "confirmed",
        paymentStatus: "paid",
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
    {
      new:true
    });

      // ✅ clear cart only after payment success
      await Cart.deleteMany({ user: userId });

      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid signature",order });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
