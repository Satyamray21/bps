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
  getQuotationRevenueList,
  searchQuotationByBookingId ,
  RequestBookingList,
  updateQuotationStatus,
  sendBookingEmail
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

router.get("/revenue-list",getQuotationRevenueList)

router.get("/send-Booking-Email",sendBookingEmail)

router.get("/booking-request-list",RequestBookingList)

router.patch("/status/:bookingId", updateQuotationStatus);
// Route to get a single quotation by its ID
router.get("/:id", getQuotationById);

// Route to update a quotation
router.put("/:bookingId", updateQuotation);

// Route to delete a quotation
router.delete("/:bookingId", deleteQuotation);

router.get("/search/:bookingId", searchQuotationByBookingId);

export default router;
