import express from "express";
import { orderData } from "../Controllers/order_controller.js";
import userMiddleware from "../middleware/user_mid.js";

const router = express.Router();

router.post("/", userMiddleware, orderData);

export default router;