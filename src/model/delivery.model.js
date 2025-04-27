

import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
quotationId: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation" },
deliveryType: { type: String, enum: ["Booking", "Quotation"], required: true },

 
  
  driverName: {
    type: String,
    required: true,
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
