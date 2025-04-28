
import { asyncHandler } from "../utils/asyncHandler.js";
import Booking from "../model/booking.model.js";
import Quotation from "../model/customerQuotation.model.js"; 
import Delivery from "../model/delivery.model.js";
import { Vehicle } from "../model/vehicle.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



// Helper function to generate Order ID
const generateOrderId = () => {
  const prefix = "BHA";
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Random 4 digit number
  const suffix = "DELIVERY";
  return `${prefix}${randomNumber}${suffix}`;
};

// Refactored Helper function to populate vehicle and booking info
const populateVehicleAndBooking = (query) => {
  return query.populate({
    path: "bookingId",
    select: "senderName receiverName startStation endStation", 
    populate: {
      path: "startStation endStation",
      select: "stationName", 
    },
  }).populate("vehicleId", "vehicleName"); // Populate Vehicle information with vehicleName
};

// Assign a delivery to a booking
// Assign a delivery to a booking or quotation
export const assignDelivery = asyncHandler(async (req, res) => {
  const { bookingId, driverName, vehicleId } = req.body;

  if (!bookingId || !driverName || !vehicleId) {
    throw new ApiError(400, "Booking ID (or Quotation ID), Driver Name, and Vehicle ID are required.");
  }

  const vehicle = await Vehicle.findOne({ vehicleId: vehicleId });
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found with this vehicleId.");
  }

  // First try to find booking
  const booking = await Booking.findOne({ bookingId: bookingId });

  // If not booking, try to find quotation
  let quotation = null;
  if (!booking) {
    quotation = await Quotation.findOne({ bookingId: bookingId });
    if (!quotation) {
      throw new ApiError(404, `No Booking or Quotation found with bookingId: ${bookingId}`);
    }
  }

  // Check if a delivery is already assigned
  let deliveryExist;
  if (booking) {
    deliveryExist = await Delivery.findOne({ bookingId: booking._id });
  } else {
    deliveryExist = await Delivery.findOne({ quotationId: quotation._id });
  }

  if (deliveryExist) {
    throw new ApiError(400, "Delivery already assigned to this Booking/Quotation.");
  }

  const orderId = generateOrderId();

  const deliveryData = {
    orderId,
    driverName,
    vehicleId: vehicle._id,
    status: "Pending",
  };

  if (booking) {
    deliveryData.bookingId = booking._id;
    deliveryData.deliveryType = "Booking";
  } else {
    deliveryData.quotationId = quotation._id;
    deliveryData.deliveryType = "Quotation";
  }

  const delivery = await Delivery.create(deliveryData);

  res.status(201).json(new ApiResponse(201, delivery, "Delivery assigned successfully."));
});


// List all Booking Deliveries
export const listBookingDeliveries = asyncHandler(async (req, res) => {
  const deliveries = await Delivery.find({ deliveryType: "Booking",status: { $ne: "Final Delivery" } })
  .populate([
    { path: "vehicleId", select: "vehicleModel" },
    { path: "bookingId", populate: [
        { path: "startStation", select: "stationName" },
        { path: "endStation", select: "stationName" }
      ]
    }
  ]);
  

  const data = deliveries.map((delivery, i) => ({
    SNo: i + 1,
    orderId: delivery.orderId,
    senderName: delivery.bookingId?.senderName || "N/A",
    receiverName: delivery.bookingId?.receiverName || "N/A",
    startStation: delivery.bookingId?.startStation?.stationName || "N/A",
    endStation: delivery.bookingId?.endStation?.stationName || "N/A",
    status: delivery.status || "Pending",
    driverName: delivery.driverName || "N/A",
    vehicleName: delivery.vehicleId?.vehicleModel || "N/A",
  }));

  res.status(200).json(new ApiResponse(200, data, "Booking deliveries fetched successfully."));
});

// List all Quotation Deliveries
export const listQuotationDeliveries = asyncHandler(async (req, res) => {
  const deliveries = await Delivery.find({
    deliveryType: "Quotation",
    status: { $ne: "Final Delivery" }
  })
    .populate({
      path: "quotationId", 
      select: "fromCustomerName toCustomerName startStation endStation quotationDate",
      populate: {
        path: "startStation", 
        select: "stationName"
      }
    })
    .populate("vehicleId", "vehicleModel") 
    .lean();

  const data = deliveries.map((delivery, i) => ({
    SNo: i + 1,
    orderId: delivery.orderId,
    senderName: delivery.quotationId?.fromCustomerName || "N/A",
    receiverName: delivery.quotationId?.toCustomerName || "N/A",
    startStation: delivery.quotationId?.startStation?.stationName || "N/A",
    endStation: delivery.quotationId?.endStation || "N/A", // Corrected here
    status: delivery.status || "Pending",
    driverName: delivery.driverName || "N/A",
    vehicleName: delivery.vehicleId?.vehicleModel || "N/A",
  }));

  res.status(200).json(new ApiResponse(200, data, "Quotation deliveries fetched successfully."));
});




// Finalize Delivery
export const finalizeDelivery = asyncHandler(async (req, res) => {
  const { orderId } = req.params; // Getting orderId from params

  // Find delivery based on orderId, not _id
  const delivery = await Delivery.findOne({ orderId: orderId });

  if (!delivery) {
    throw new ApiError(404, "Delivery not found with this Order ID.");
  }

  if (delivery.status === "Final Delivery") {
    throw new ApiError(400, "Delivery is already finalized.");
  }

  // Mark as "Final Delivery"
  delivery.status = "Final Delivery";
  await delivery.save();

  // Update the associated booking to reflect no delivery assigned
  const booking = await Booking.findById(delivery.bookingId);
  if (booking) {
    booking.deliveryAssigned = false;
    await booking.save();
  }

  res.status(200).json(new ApiResponse(200, {
    orderId: delivery.orderId,
    status: "Final Delivery",
  }, "Delivery marked as final."));
});

// Count Deliveries
export const countBookingDeliveries = asyncHandler(async (req, res) => {
  const count = await Delivery.countDocuments({ deliveryType: "Booking",status: { $ne: "Final Delivery" } });

  res.status(200).json(new ApiResponse(200, { count }, "Booking deliveries count fetched successfully."));
});

export const countQuotationDeliveries = asyncHandler(async (req, res) => {
  const count = await Delivery.countDocuments({ deliveryType: "Quotation",status: { $ne: "Final Delivery" } });

  res.status(200).json(new ApiResponse(200, { count }, "Quotation deliveries count fetched successfully."));
});
export const countFinalDeliveries = asyncHandler(async (req, res) => {
  const count = await Delivery.countDocuments({ status: "Final Delivery" });

  res.status(200).json(new ApiResponse(200, { finalDeliveries: count }, "Final deliveries counted successfully."));
});

export const listFinalDeliveries = asyncHandler(async (req, res) => {
  const deliveries = await Delivery.find({ status: "Final Delivery" })
    .populate({
      path: "bookingId",
      select: "startStation endStation",
      populate: {
        path: "startStation endStation",
        select: "stationName"
      }
    })
    .populate("vehicleId", "vehicleName")
    .lean();

  const data = deliveries.map((delivery, i) => ({
    SNo: i + 1,
    orderId: delivery.orderId,
    startStation: delivery.bookingId?.startStation?.stationName || "N/A",
    endStation: delivery.bookingId?.endStation?.stationName || "N/A",
    driverName: delivery.driverName || "N/A",
    vehicle: delivery.vehicleId,
  }));

  res.status(200).json(new ApiResponse(200, data, "Final delivery list fetched successfully."));
});
