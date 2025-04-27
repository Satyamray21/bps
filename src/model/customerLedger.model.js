import mongoose from "mongoose";

const customerLedgerSchema = new mongoose.Schema({
  orderType: {
    type: String,
    enum: ["Booking", "Quotation"],
    required: true,
  },
  orderRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "orderTypeRef",
  },
  orderTypeRef: {
    type: String,
    required: true,
    enum: ["Booking", "CustomerQuotation"],
  },
  date: {
    type: Date,
  },
  amount: {
    type: Number,
    required: true,
  },
  remainingAmount: {
    type: Number,
    default: 0,
  },
  additionalComments: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

export default mongoose.model("CustomerLedger", customerLedgerSchema);