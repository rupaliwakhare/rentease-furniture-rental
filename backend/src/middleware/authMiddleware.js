
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// VERIFY TOKEN
export const protect = async (req, res, next) => {
  try {
    let token;

    // TOKEN FROM HEADER
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // GET USER (without password)
   const user = await User.findById(decoded.id).select("-password");

   if (!user) {
     return res.status(401).json({ message: "User not found" });
   }

   req.user = user;
    next();
  } catch (error) {

    console.error("Auth Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ROLE-BASED ACCESS
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied for roles:  ${roles.join(", ")}, but you are: ${req.user.role}`,
      });
    }
    next();
  };
};