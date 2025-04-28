import express from "express";
import { 
  createQuotation, 
  getAllQuotations, 
  getQuotationById, 
  updateQuotation, 
  deleteQuotation, 
  getTotalBookingRequests, 
  getTotalActiveDeliveries, 
  getTotalCancelled, 
  getTotalRevenue, 
  getActiveList,
  getCancelledList,
  searchQuotationByBookingId 
} from "../controller/customerQuotation.controller.js";
import { parseFormData } from "../middleware/multerParser.middleware.js"; 

const router = express.Router();

// Route to create a new quotation with form data (including files)
router.post("/", parseFormData, createQuotation);

// Route to get all quotations
router.get("/", getAllQuotations);

// Route to get total booking requests
router.get("/total-booking-requests", getTotalBookingRequests);

// Route to get total active deliveries
router.get("/total-active-deliveries", getTotalActiveDeliveries);

// Route to get total cancelled quotations
router.get("/total-cancelled", getTotalCancelled);

// Route to get total revenue
router.get("/total-revenue", getTotalRevenue);

router.get("/active-list",getActiveList);

router.get("/cancelled-list",getCancelledList);

// Route to get a single quotation by its ID
router.get("/:id", getQuotationById);

// Route to update a quotation
router.put("/:id", updateQuotation);

// Route to delete a quotation
router.delete("/:id", deleteQuotation);

router.get("/search/:bookingId", searchQuotationByBookingId);

export default router;
