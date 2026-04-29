import User from "../models/User.js";

export const addAddress = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mobile,
      street,
      area,
      landmark,
      city,
      state,
      pincode,
      type,
      floor,
      hasLift,
      deliveryInstructions,
    } = req.body;

    // 🔍 Validation
    if (!firstName || !lastName || !mobile || !street || !city || !pincode) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAddress = {
      firstName,
      lastName,
      mobile,
      street,
      area,
      landmark,
      city,
      state,
      pincode,
      type: type || "home",
      floor,
      hasLift: hasLift || false,
      deliveryInstructions,
      isDefault: user.addresses.length === 0,
    };

    user.addresses.push(newAddress);

    await user.save();

    res.status(201).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL ADDRESS

export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("addresses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE ADDRESS

export const getAddressById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({
      address,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};




// UPDATE ADDRESS

export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    Object.keys(req.body).forEach((key) => {
      address[key] = req.body[key];
    });

    await user.save();

    res.json({
      message: "Address updated",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE ADDRESS

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    address.deleteOne();

    await user.save();

    res.json({
      message: "Address deleted",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};