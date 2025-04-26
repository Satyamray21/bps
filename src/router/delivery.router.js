import express from "express";
import { getDeliveries, 
    assignDelivery, 
    finalizeDelivery,
    countPendingDeliveries,
    countFinalDeliveries,
    listPendingDeliveries,
    listFinalDeliveries
 } from "../controller/delivery.controller.js";

import {parseFormData } from "../middleware/multerParser.middleware.js"
const router = express.Router();


router.get("/deliveries", getDeliveries);


router.post("/assign", parseFormData ,assignDelivery);


router.put("/finalize/:orderId", finalizeDelivery);

router.get("/pending/count", countPendingDeliveries);
router.get("/final/count", countFinalDeliveries);
router.get("/pending/list", listPendingDeliveries);
router.get("/final/list", listFinalDeliveries);

export default router;
