import express from 'express';
import { 
  viewBooking, 
  createBooking, 
  updateBooking, 
  deleteBooking, 
  getBookingStatusList, 
  getBookingRevenueList, 
  getBookingRevenueDashboard ,
  activateBooking
} from '../controller/booking.controller.js';

const router = express.Router();

router.get('/booking-list', getBookingStatusList);
router.get('/revenue-list', getBookingRevenueList);
router.get('/revenue-dashboard', getBookingRevenueDashboard);

// ✅ CRUD routes AFTER static routes
router.post('/', createBooking);           // Create a new booking
router.patch('/:id/activate', activateBooking);
router.get('/:id', viewBooking);           // View by bookingId (not _id!)
router.put('/:id', updateBooking);         // Update by bookingId
router.delete('/:id', deleteBooking);      // Delete by bookingId

export default router;
