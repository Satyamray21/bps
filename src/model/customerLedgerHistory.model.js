import mongoose from "mongoose";

const customerLedgerHistorySchema = new mongoose.Schema({
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
    enum: ["Booking", "Quotation"],
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

const CustomerLedgerHistory = mongoose.models.CustomerLedgerHistory || mongoose.model("CustomerLedgerHistory", customerLedgerHistorySchema);

export default CustomerLedgerHistory;
