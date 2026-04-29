import express from "express";
import { placeOrder} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
// router.get("/", protect, getOrderHistory); 

export default router;
