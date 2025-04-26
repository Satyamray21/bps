import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true, // Ensures the Order ID is unique
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking", // Reference to the Booking model
    required: true,
  },
  driverName: {
    type:String,
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle", 
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Final Delivery"], 
    default: "Pending",
  },
}, {
  timestamps: true,
});

const Delivery = mongoose.model("Delivery", deliverySchema);
export default Delivery;
