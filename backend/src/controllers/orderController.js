import Cart from "../models/Cart.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Razorpay from "razorpay";

export const placeOrder = async (req, res) => {
  try {
    const { addressId } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🏠 Get address
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // 🛒 Get cart items
    const cartItems = await Cart.find({ user: req.user._id }).populate(
      "product",
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 💰 total calculate
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.totalRent + item.deposit,
      0,
    );

    // 🎟 Coupon apply (agar diya ho)
    let discount = 0;
    if (req.body.couponCode) {
      const coupon = await Coupon.findOne({ code: req.body.couponCode });
      if (
        coupon &&
        coupon.expiry >= new Date() &&
        coupon.usedCount < coupon.usageLimit
      ) {
        if (coupon.discountType === "percentage") {
          discount = (totalAmount * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }
        totalAmount = totalAmount - discount; // ✅ final amount update
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    // 📦 create order
    const order = await Order.create({
      user: req.user._id,
      items: cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        tenure: item.tenure,
        deliveryDate: item.deliveryDate,
        totalRent: item.totalRent,
        deposit: item.deposit,
      })),
      addresses: {
        ...address.toObject(), // ✅ सारे fields आ जाएंगे
      },
      totalAmount,
      discount,
      coupon: req.body.couponCode || null,
      status: "pending", // 🔥 important
    });

    // 💳 create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `order_${order._id}`,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
      razorpayOrder, // frontend को भेजेंगे
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 

// ✅ Get User Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.activityLog.push({
      action: `Status updated to ${status}`,
      updatedBy: req.user._id,
    });

    await order.save();
    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

