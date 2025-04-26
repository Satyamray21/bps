import express from "express";
import { getDeliveries, assignDelivery, finalizeDelivery } from "../controller/delivery.controller.js";

import {parseFormData } from "../middleware/multerParser.middleware.js"
const router = express.Router();


router.get("/deliveries", getDeliveries);


router.post("/assign", parseFormData ,assignDelivery);


router.put("/finalize/:orderId", finalizeDelivery);

export default router;
