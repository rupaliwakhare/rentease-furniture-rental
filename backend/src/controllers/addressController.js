import User from "../models/User.js";

export const addAddress = async (req, res) => {
  try {
    const {
      fullName,
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

    // 🔍 Basic validation
    if (!fullName || !mobile || !street || !city || !pincode) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🏠 Create new address
    const newAddress = {
      fullName,
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
      isDefault: user.addresses.length === 0, // first address default
    };

    // ➕ Add address
    user.addresses.push(newAddress);

    await user.save();

    res.status(201).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // update fields dynamically
    Object.keys(req.body).forEach((key) => {
      address[key] = req.body[key];
    });

    await user.save();

    res.json({
      message: "Address updated",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

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
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
