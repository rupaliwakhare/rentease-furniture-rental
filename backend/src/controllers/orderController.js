import Cart from "../models/Cart.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

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
      address: {
        ...address.toObject(), // ✅ सारे fields आ जाएंगे
      },
      totalAmount,
      status: "pending", // 🔥 important
    });

    // 🧹 clear cart
    await Cart.deleteMany({ user: req.user._id });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
