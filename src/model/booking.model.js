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
      required: true, 
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: props => `${props.value} is not a valid mobile number!`
      }
    },
    email: { 
      type: String, 
      required: true, 
      validate: {
        validator: (v) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v),
        message: props => `${props.value} is not a valid email address!`
      }
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
      required: true, 
      validate: {
        validator: (v) => /^\d{6}$/.test(v),
        message: props => `${props.value} is not a valid pincode!`
      }
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
      required: true, 
      validate: {
        validator: (v) => /^\d{6}$/.test(v),
        message: props => `${props.value} is not a valid pincode!`
      }
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
      type: String, 
      required: true ,
      enum:["pay","paid"]
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

BookingSchema.pre('save', function (next) {
  // Basic charge (you can replace this with custom logic)
  const weightRate = 50; // example: ₹50 per kg
  this.amount = (this.weight || 0) * weightRate;

  // Calculate grandTotal
  this.grandTotal = 
    (this.freight || 0) +
    (this.ins_vpp || 0) +
    (this.cgst || 0) +
    (this.sgst || 0) +
    (this.igst || 0) +
    this.amount;

  // Set computedTotalRevenue (optional)
  this.computedTotalRevenue = this.grandTotal;

  next();
});


const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
