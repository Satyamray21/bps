

import express from 'express';
import { 
  assignDelivery, 
  finalizeDelivery, 
  countBookingDeliveries, 
  countQuotationDeliveries, 
  listBookingDeliveries, 
  listQuotationDeliveries ,
  countFinalDeliveries,
  listFinalDeliveries
} from '../controller/delivery.controller.js';
import {parseFormData } from '../middleware/multerParser.middleware.js'
const router = express.Router();

// Assign a delivery to a booking
router.post('/assign', parseFormData,assignDelivery);

// List all Booking Deliveries
router.get('/booking', listBookingDeliveries);

// List all Quotation Deliveries
router.get('/quotation', listQuotationDeliveries);

// Count Booking Deliveries
router.get('/booking/count', countBookingDeliveries);

// Count Quotation Deliveries
router.get('/quotation/count', countQuotationDeliveries);

router.get("/final/count", countFinalDeliveries);

router.get("/final/list", listFinalDeliveries);

// Finalize a Delivery (based on orderId)
router.put('/finalize/:orderId', finalizeDelivery);

export default router;
