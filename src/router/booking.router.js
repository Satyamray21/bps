import express from 'express';
import { createBooking, getBookings, getBookingById, updateBooking, deleteBooking, getActiveDeliveryCount, getActiveDeliveries,getBookingRequestCount, getBookingRequests} from "../controller/booking.controller.js";

const router = express.Router();

// POST: Create a new booking
router.post('/bookings', createBooking);

// GET: Get all bookings
router.get('/bookings', getBookings);

// GET: Get a booking by ID
router.get('/bookings/:id', getBookingById);

// PUT: Update a booking by ID
router.put('/bookings/:id', updateBooking);

// DELETE: Delete a booking by ID
router.delete('/bookings/:id', deleteBooking);

// GET: Get count of active deliveries
router.get('/active-delivery-count', getActiveDeliveryCount);

// GET: Get list of active deliveries with specific fields
router.get('/active-deliveries', getActiveDeliveries);

router.get('/booking-request-count', getBookingRequestCount);

// GET: Get list of booking requests with specific fields
router.get('/booking-requests', getBookingRequests);


export default router;
