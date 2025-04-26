// controllers/delivery.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import Booking from "../model/booking.model.js";
import Delivery from "../model/delivery.model.js";
import {Vehicle} from "../model/vehicle.model.js"; 
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



// Create Delivery


// Helper function to generate Order ID
const generateOrderId = () => {
  const prefix = "BHA";
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Random 4 digit number
  const suffix = "DELIVERY";
  return `${prefix}${randomNumber}${suffix}`;
};

export const assignDelivery = asyncHandler(async (req, res) => {
  const { bookingId, driverName, vehicleId } = req.body;

  if (!bookingId || !driverName || !vehicleId) {
    throw new ApiError(400, "Booking ID, Driver Name, and Vehicle ID are required.");
  }

  // Find Booking by bookingId (custom booking code)
  const booking = await Booking.findOne({ bookingId: bookingId });
  if (!booking) {
    throw new ApiError(404, "Booking not found with this bookingId.");
  }

  // Find Vehicle by vehicleId (custom vehicle code)
  const vehicle = await Vehicle.findOne({ vehicleId: vehicleId });
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found with this vehicleId.");
  }

  // Check if delivery already exists for this booking
  const deliveryExist = await Delivery.findOne({ bookingId: booking._id });
  if (deliveryExist) {
    throw new ApiError(400, "Delivery already assigned to this booking.");
  }

  // Create Delivery
  const orderId = generateOrderId();

  const delivery = await Delivery.create({
    orderId,
    bookingId: booking._id,   // ✅ Use real Mongo _id
    driverName,               // ✅ Already plain string
    vehicleId: vehicle._id,    // ✅ Use real Mongo _id
    status: "Pending",
  });

  res.status(201).json(new ApiResponse(201, delivery, "Delivery assigned successfully."));
});

export const getDeliveries = asyncHandler(async (req, res) => {
    try {
      // Fetch all deliveries and properly populate references
      const deliveries = await Delivery.find({})
        .populate({
          path: "bookingId",
          select: "senderName receiverName startStation endStation", // Select necessary fields from the Booking
          populate: {
            path: "startStation endStation", // Populate both startStation and endStation
            select: "stationName", // Select stationName from manageStation model
          },
        })
        .populate("vehicleId", "vehicleName") // Populate Vehicle
        .lean();  // Using .lean() for optimized performance
  
      // Map and structure the data
      const data = deliveries.map((delivery, i) => ({
        SNo: i + 1, // Serial number based on index
        orderId: delivery.orderId,
        senderName: delivery.bookingId.senderName,
        receiverName: delivery.bookingId.receiverName,
        startStation: delivery.bookingId.startStation ? delivery.bookingId.startStation.stationName : "Not Assigned", // Safe access for startStation
        endStation: delivery.bookingId.endStation ? delivery.bookingId.endStation.stationName : "Not Assigned", // Safe access for endStation
        status: delivery.status || "Pending", // Default status to "Pending" if not set
        action: {
          markAsDelivered: `/api/delivery/finalize/${delivery._id}`, // Action URL for marking as Delivered
        }
      }));
  
      res.status(200).json(new ApiResponse(200, data, "Delivery list fetched successfully."));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });
  
  
  
  
  
  
  

// Finalize Delivery
export const finalizeDelivery = asyncHandler(async (req, res) => {
  const { deliveryId } = req.params;

  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    throw new ApiError(404, "Delivery not found.");
  }

  delivery.status = "Final Delivery";
  await delivery.save();

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
