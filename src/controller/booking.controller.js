import Booking from '../model/booking.model.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a booking by ID
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a booking by ID
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Get count of active deliveries
export const getActiveDeliveryCount = async (req, res) => {
  try {
    const activeDeliveriesCount = await Booking.countDocuments({ activeDelivery: true });
    res.status(200).json({ activeDeliveriesCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get list of active deliveries with specific fields
export const getActiveDeliveries = async (req, res) => {
  try {
    // Fetch active deliveries
    const activeDeliveries = await Booking.find({ activeDelivery: true })
      .select('bookingId firstName lastName bookingDate startStation endStation activeDelivery') // Choose only required fields
      .populate('startStation endStation', 'stationName') // Assuming 'stationName' is the field in the stations
      .lean(); // Use lean to get plain JS objects

    // Prepare response data with required fields
    const formattedDeliveries = activeDeliveries.map((delivery, index) => ({
      SNo: index + 1,
      bookingId: delivery.bookingId,
      orderBy: `${delivery.firstName} ${delivery.lastName}`,
      date: delivery.bookingDate.toISOString().split('T')[0], // Formatting date as YYYY-MM-DD
      name: `${delivery.firstName} ${delivery.lastName}`,
      pickup: delivery.startStation.stationName,
      drop: delivery.endStation.stationName,
      status: delivery.activeDelivery ? 'Active' : 'Inactive', // Mapping status based on 'activeDelivery'
      action: 'View', // Placeholder for action, can be customized
    }));

    res.status(200).json(formattedDeliveries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getBookingRequestCount = async (req, res) => {
    try {
      const bookingRequestsCount = await Booking.countDocuments({ activeDelivery: false }); // Assuming activeDelivery is false for requests
      res.status(200).json({ bookingRequestsCount });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Get list of booking requests with specific fields
  export const getBookingRequests = async (req, res) => {
    try {
      // Fetch booking requests where activeDelivery is false
      const bookingRequests = await Booking.find({ activeDelivery: false })
        .select('bookingId firstName lastName bookingDate startStation endStation activeDelivery') // Choose only required fields
        .populate('startStation endStation', 'stationName') // Assuming 'stationName' is the field in the stations
        .lean(); // Use lean to get plain JS objects
  
      // Prepare response data with required fields
      const formattedRequests = bookingRequests.map((request, index) => ({
        SNo: index + 1,
        bookingId: request.bookingId,
        orderBy: `${request.firstName} ${request.lastName}`,
        date: request.bookingDate.toISOString().split('T')[0], // Formatting date as YYYY-MM-DD
        name: `${request.firstName} ${request.lastName}`,
        pickup: request.startStation.stationName,
        drop: request.endStation.stationName,
        status: request.activeDelivery ? 'Active' : 'Pending', // Mapping status based on 'activeDelivery'
        action: 'Approve', // Placeholder for action, can be customized
      }));
  
      res.status(200).json(formattedRequests);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };