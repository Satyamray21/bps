import express from 'express';
import { 
  viewBooking, 
  createBooking, 
  updateBooking, 
  deleteBooking, 
  getBookingStatusList, 
  getBookingRevenueList, 
  activateBooking,
  cancelBooking,
  getBookingRequestsCount,
  getActiveDeliveriesCount,
  getCancelledBookingsCount,
  getTotalRevenue,
  sendBookingEmail
} from '../controller/booking.controller.js';

import {parseFormData} from "../middleware/multerParser.middleware.js";
const router = express.Router();

router.get('/booking-list', getBookingStatusList);
router.get('/revenue-list', getBookingRevenueList);
router.get('/bookings/count/requests', getBookingRequestsCount);
router.get('/bookings/count/active', getActiveDeliveriesCount);
router.get('/bookings/count/cancelled', getCancelledBookingsCount);
router.get('/bookings/revenue/total', getTotalRevenue);
router.post('/send-booking-email', sendBookingEmail);


//  CRUD routes AFTER static routes
router.post('/', createBooking);           // Create a new booking
router.patch('/:id/activate', activateBooking);
router.patch('/:bookingId/cancel',cancelBooking);
router.get('/:id', viewBooking);           // View by bookingId (not _id!)
router.put('/:id', updateBooking);         // Update by bookingId
router.delete('/:id', deleteBooking);      // Delete by bookingId

export default router;
