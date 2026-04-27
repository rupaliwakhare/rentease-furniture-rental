import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// ✅ ADD / UPDATE CART
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, tenure, deliveryDate } = req.body;

    if (!productId || !tenure || !deliveryDate) {
      return res.status(400).json({
        message: "productId, tenure, deliveryDate required",
      });
    }

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // tenure validation
    if (!product.tenureOptions.includes(Number(tenure))) {
      return res.status(400).json({
        message: `Invalid tenure. Allowed: ${product.tenureOptions}`,
      });
    }

    // 🔥 calculation
    const totalRent = product.pricePerMonth * tenure * quantity;
    const deposit = product.deposit;

    let cartItem = await Cart.findOne({
      user: req.user._id,
      product: productId,
    });

    if (cartItem) {
      cartItem.quantity = quantity;
      cartItem.tenure = tenure;
      cartItem.deliveryDate = deliveryDate;
      cartItem.totalRent = totalRent;
      cartItem.deposit = deposit;

      await cartItem.save();

      return res.json({
        message: "Cart updated",
        cartItem,
      });
    }

    cartItem = await Cart.create({
      user: req.user._id,
      product: productId,
      quantity,
      tenure,
      deliveryDate,
      totalRent,
      deposit,
    });

    res.status(201).json({
      message: "Added to cart",
      cartItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET CART
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user._id }).populate("product");

    const grandTotal = cart.reduce(
      (acc, item) => acc + item.totalRent + item.deposit,
      0,
    );

    res.json({
      items: cart,
      totalItems: cart.length,
      grandTotal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE CART ITEM
export const updateCart = async (req, res) => {
  try {
    const { quantity, tenure } = req.body;

    let cartItem = await Cart.findById(req.params.id).populate("product");

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity) cartItem.quantity = quantity;

    if (tenure) {
      if (!cartItem.product.tenureOptions.includes(Number(tenure))) {
        return res.status(400).json({
          message: `Invalid tenure. Allowed: ${cartItem.product.tenureOptions}`,
        });
      }
      cartItem.tenure = tenure;
    }

    // 🔥 recalc
    cartItem.totalRent =
      cartItem.product.pricePerMonth * cartItem.tenure * cartItem.quantity;

    await cartItem.save();

    res.json({
      message: "Cart updated",
      cartItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ REMOVE ITEM
export const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.deleteOne();

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ CLEAR CART
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user._id });

    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
