// import jwt from "jsonwebtoken";
// import User from "../models/User";

// const protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) return res.status(401).send("Token not provided");

//     const decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = {
//       id: decode.id,
//       role: decode.role,
//     };
//     next();
//   } catch (error) {
//     res.status(401).send("Invalid token");
//   }
// };

// export default protect;

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
      return res.status(401).json({ message: "Not authorized, no token" });
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
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ROLE-BASED ACCESS
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied for role: ${req.user.role}`,
      });
    }
    next();
  };
};