import express from "express";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"

const app = express();

// middleware
app.use(express.json());

// auth route
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",cartRoutes)
export default app;
