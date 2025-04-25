import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    // Auto-generated booking ID
    bookingId: { 
      type: String, 
      required: true, 
      unique: true 
    },

    // Stations
    startStation: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'manageStation', 
      required: true 
    },
    endStation: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'manageStation', 
      required: true 
    },

    // Customer Info
    firstName: { 
      type: String, 
      required: true 
    },
    middleName: { 
      type: String, 
      default: '' 
    },
    lastName: { 
      type: String, 
      required: true 
    },
    mobile: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    locality: { 
      type: String, 
      required: true 
    },

    // Dates
    bookingDate: { 
      type: Date, 
      required: true 
    },
    deliveryDate: { 
      type: Date, 
      required: true 
    },

    // Sender Info
    senderName: { 
      type: String, 
      required: true 
    },
    senderGgt: { 
      type: String, 
      required: true 
    },
    senderLocality: { 
      type: String, 
      required: true 
    },
    fromState: { 
      type: String, 
      required: true 
    },
    fromCity: { 
      type: String, 
      required: true 
    },
    senderPincode: { 
      type: String, 
      required: true 
    },

    // Receiver Info
    receiverName: { 
      type: String, 
      required: true 
    },
    receiverGgt: { 
      type: String, 
      required: true 
    },
    receiverLocality: { 
      type: String, 
      required: true 
    },
    toState: { 
      type: String, 
      required: true 
    },
    toCity: { 
      type: String, 
      required: true 
    },
    toPincode: { 
      type: String, 
      required: true 
    },

    // Reference Numbers
    receiptNo: { 
      type: String, 
      required: true 
    },
    refNo: { 
      type: String, 
      required: true 
    },

    // Shipment Details
    insurance: { 
      type: Number, 
      required: true 
    },
    vppAmount: { 
      type: Number, 
      required: true 
    },
    toPay: { 
      type: Number, 
      required: true 
    },
    weight: { 
      type: Number, 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    addComment: { 
      type: String, 
      default: '' 
    },

    // Tax & Billing
    freight: { 
      type: Number, 
      required: true 
    },
    ins_vpp: { 
      type: Number, 
      required: true 
    },
    cgst: { 
      type: Number, 
      required: true 
    },
    sgst: { 
      type: Number, 
      required: true 
    },
    igst: { 
      type: Number, 
      required: true 
    },
    billTotal: { 
      type: Number, 
      required: true 
    },
    grandTotal: { 
      type: Number, 
      required: true 
    },
    computedTotalRevenue: {
      type: Number,
      default: function () {
        return this.grandTotal;
      },
    },

    // Status
    activeDelivery: { 
      type: Boolean, 
      default: false 
    },
    totalCancelled: { 
      type: Number, 
      default: 0 
    },
  },
  { timestamps: true }
);

// Auto-generate bookingId before validation
BookingSchema.pre('validate', function (next) {
  if (!this.bookingId) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    this.bookingId = `BHPAR${randomDigits}BOOK`;
  }
  next();
});

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
