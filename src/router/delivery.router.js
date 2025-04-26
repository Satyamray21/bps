import express from "express";
import { getDeliveries, assignDelivery, finalizeDelivery } from "../controller/delivery.controller.js";

const router = express.Router();


router.get("/deliveries", getDeliveries);


router.post("/assign", assignDelivery);


router.put("/finalize/:deliveryId", finalizeDelivery);

export default router;
