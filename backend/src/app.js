import express from "express";
import authRoutes from "./routes/authRoutes.js";
import addressRoutes from "./routes/addressRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js"


const app = express();

// middleware
app.use(express.json());

// auth route
app.use("/api/auth", authRoutes);
app.use("/api/address",addressRoutes)
app.use("/api/products", productRoutes);
app.use("/api/cart",cartRoutes)
app.use("/api/orders", orderRoutes);
app.use("api/coupons",cartRoutes);
app.use("/api/reviews", reviewRoutes);
export default app;
