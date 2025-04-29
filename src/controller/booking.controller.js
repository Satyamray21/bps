import Booking from '../model/booking.model.js';
import Station from '../model/manageStation.model.js';  


async function resolveStation(name) {
  const station = await Station.findOne({ stationName: new RegExp(`^${name}$`, 'i') });
  if (!station) throw new Error(`Station "${name}" not found`);
  return station._id;
}

/** 
 * View a single booking by its bookingId or _id
 * GET /api/bookings/:id
 */
export const viewBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({
      $or: [{ bookingId: id }]
    })
    .populate('startStation endStation', 'stationName')
    .lean();

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/** 
 * Create a new booking
 * POST /api/bookings
 */
export const createBooking = async (req, res) => {
  try {
    const {
      startStation: startName,
      endStation: endName,
      firstName, lastName, mobile, email, locality,
      bookingDate, deliveryDate,
      senderName, senderGgt, senderLocality, fromState, fromCity, senderPincode,
      receiverName, receiverGgt, receiverLocality, toState, toCity, toPincode,
      receiptNo, refNo,
      insurance, vppAmount, toPay, weight, amount, addComment,
      freight, ins_vpp, cgst, sgst, igst, billTotal, grandTotal
    } = req.body;

    const startStation = await resolveStation(startName);
    const endStation   = await resolveStation(endName);

    const booking = new Booking({
      startStation, endStation,
      firstName, lastName, mobile, email, locality,
      bookingDate, deliveryDate,
      senderName, senderGgt, senderLocality, fromState, fromCity, senderPincode,
      receiverName, receiverGgt, receiverLocality, toState, toCity, toPincode,
      receiptNo, refNo,
      insurance, vppAmount, toPay, weight, amount, addComment,
      freight, ins_vpp, cgst, sgst, igst, billTotal, grandTotal
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.startStation) {
      updates.startStation = await resolveStation(updates.startStation);
    }
    if (updates.endStation) {
      updates.endStation = await resolveStation(updates.endStation);
    }

    const booking = await Booking.findOneAndUpdate(
      { bookingId: id },
      updates,
      { new: true }
    ).populate('startStation endStation', 'stationName');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


 

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBooking = await Booking.findOneAndDelete({ bookingId: id });

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking permanently deleted",
      deletedBooking,
    });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ message: err.message });
  }
};


/** 
 * List bookings by “status”
 * GET /api/bookings/booking-list?type=request|active|cancelled
 */
export const getBookingStatusList = async (req, res) => {
  try {
    const { type } = req.query;
    let filter;

    if (type === 'active') {
      filter = { activeDelivery: true };
    } else if (type === 'cancelled') {
      filter = { totalCancelled: { $gt: 0 } };
    } else {
      // request = neither active nor cancelled
      filter = { activeDelivery: false, totalCancelled: 0 };
    }
    

    const bookings = await Booking.find(filter)
      .select('bookingId firstName lastName senderName receiverName bookingDate mobile startStation endStation')
      .populate('startStation endStation', 'stationName')
      .lean();

    const data = bookings.map((b, i) => ({
      SNo:      i + 1,
      orderBy:  `${b.firstName} ${b.lastName}`,
      date:     b.bookingDate.toISOString().slice(0,10),
      fromName: b.senderName,
      pickup:   b.startStation.stationName,
      toName:   b.receiverName,
      drop:     b.endStation.stationName,
      contact:  b.mobile,
      action: {
        view:   `/bookings/${b.bookingId}`,
        edit:   `/bookings/edit/${b.bookingId}`,
        delete: `/bookings/delete/${b.bookingId}`
      }
    }));

    res.json({ count: data.length, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// PATCH /api/v2/bookings/:bookingId/cancel
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      { $inc: { totalCancelled: 1 }, activeDelivery: false },
      { new: true }
    ).populate('startStation endStation', 'stationName');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const getBookingRevenueList = async (req, res) => {
  try {
    const bookings = await Booking.find({ totalCancelled: 0 })
      .select('bookingId bookingDate startStation endStation grandTotal')
      .populate('startStation endStation', 'stationName')
      .lean();

    const totalRevenue = bookings.reduce((sum, b) => sum + b.grandTotal, 0);

    const data = bookings.map((b, i) => ({
      SNo:       i + 1,
      bookingId: b.bookingId,
      date:      b.bookingDate.toISOString().slice(0,10),
      pickup:    b.startStation.stationName,
      drop:      b.endStation.stationName,
      revenue:   b.grandTotal.toFixed(2),
      action: {
        view:   `/bookings/${b.bookingId}`,
        edit:   `/bookings/edit/${b.bookingId}`,
        delete: `/bookings/delete/${b.bookingId}`
      }
    }));

    res.json({
      totalRevenue: totalRevenue.toFixed(2),
      count:        data.length,
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// GET /api/v2/bookings/count/requests
export const getBookingRequestsCount = async (req, res) => {
  try {
    const count = await Booking.countDocuments({ activeDelivery: false, totalCancelled: 0 });
    res.json({ bookingRequests: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// GET /api/v2/bookings/count/active
export const getActiveDeliveriesCount = async (req, res) => {
  try {
    const count = await Booking.countDocuments({ activeDelivery: true });
    res.json({ activeDeliveries: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// GET /api/v2/bookings/count/cancelled
export const getCancelledBookingsCount = async (req, res) => {
  try {
    const count = await Booking.countDocuments({ totalCancelled: { $gt: 0 } });
    res.json({ cancelledCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// GET /api/v2/bookings/revenue/total
export const getTotalRevenue = async (req, res) => {
  try {
    const bookings = await Booking.find({ totalCancelled: 0 }).select('grandTotal').lean();
    const totalRevenue = bookings.reduce((sum, b) => sum + b.grandTotal, 0);
    res.json({ totalRevenue: totalRevenue.toFixed(2) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/v2/bookings/:id/activate
export const activateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOneAndUpdate(
      { bookingId: id },
      { activeDelivery: true },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking marked as active delivery', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

