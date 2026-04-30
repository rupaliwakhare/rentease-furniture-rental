import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, age, email, password, mobile } = req.body;

    // VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (age && age < 18) {
      return res.status(400).json({ message: "Must be 18+ to register" });
    }

    if (mobile && !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be 6+ characters",
      });
    }

    // CHECK EXISTING USER
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // CREATE USER
    const user = await User.create({
      name,
      age,
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile,
      role: "user", // 🔒 force user
    });

    // REMOVE PASSWORD
    const { password: _, ...safeUser } = user._doc;

    res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
      token: generateToken({
        id: user._id,
        role: user.role,
      }),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const { password: _, ...safeUser } = user._doc;

    res.json({
      message: "Login successful",
      user: safeUser,
      token: generateToken({
        id: user._id,
        role: user.role,
      }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//  LOGOUT USER
export const logoutUser = async (req, res) => {
  try {
    // Frontend se refreshToken ya accessToken bhejna hoga
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // Agar aap refresh token use kar rahe ho toh DB se delete karo
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Refresh token ko null kar dena (invalidate)
    user.refreshToken = null;
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
};