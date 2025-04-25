import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  startStation: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "manageStation",
  },
  startStationName: {
    type: String,
    required: true,
  },
  endStation: { 
    type: String, 
    required: true 
  },

  firstName: String,
  middleName: String,
  lastName: String,
  mobile: String,
  email: String,
  locality: String,

  quotationDate: { 
    type: Date, 
    required: true 
  },
  proposedDeliveryDate: { 
    type: Date, 
    required: true 
  },

  fromCustomerName: { 
    type: String, 
    required: true 
  },
  fromAddress: { 
    type: String, 
    required: true 
  },
  fromCity: { 
    type: String, 
    required: true 
  },
  fromState: { 
    type: String, 
    required: true 
  },
  fromPincode: { 
    type: String, 
    required: true 
  },

  toCustomerName: { 
    type: String, 
    required: true 
  },
  toAddress: { 
    type: String, 
    required: true 
  },
  toCity: { 
    type: String, 
    required: true 
  },
  toState: { 
    type: String, 
    required: true 
  },
  toPincode: { 
    type: String, 
    required: true 
  },

  additionalCmt: String,
  sTax: { 
    type: Number, 
    required: true 
  },
  sgst: { 
    type: Number, 
    required: true 
  },
  grandTotal: { 
    type: Number, 
    required: true 
  },

  productDetails: [
    {
      name: { 
        type: String, 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true 
      },
      price: { 
        type: Number, 
        required: true 
      },
      weight: { 
        type: Number, 
        required: true 
      },
    },
  ],

  activeDelivery: { 
    type: Boolean, 
    default: false 
  },
  totalCancelled: { 
    type: Number, 
    default: 0 
  },
}, { timestamps: true });

// Booking ID auto-generation
quotationSchema.pre("save", async function (next) {
  if (!this.bookingId) {
    const count = await mongoose.model("Quotation").countDocuments();
    const padded = (count + 1).toString().padStart(4, "0");
    this.bookingId = `BHPAR4${padded}QUOK`;
  }
  next();
});

// Virtuals
quotationSchema.virtual("bookingRequestTotal").get(function () {
  return this.productDetails.reduce((acc, item) => acc + item.quantity, 0);
});

quotationSchema.virtual("totalTax").get(function () {
  return this.sTax + this.sgst;
});

quotationSchema.virtual("computedTotalRevenue").get(function () {
  // Calculate the total cost of products
  const productTotal = this.productDetails.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);
  
  // Subtract the tax (sTax and sgst) from the total product cost
  const totalRevenue = productTotal - (this.sTax + this.sgst);

  return totalRevenue;
});


quotationSchema.set("toJSON", { virtuals: true });
quotationSchema.set("toObject", { virtuals: true });

const Quotation = mongoose.model("Quotation", quotationSchema);

export default Quotation;
