import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import CustomerLedgerHistory from "../model/customerLedgerHistory.model.js";
import Booking from "../model/booking.model.js";
import Quotation from "../model/customerQuotation.model.js";

// Fetch all ledger history
export const getAllLedgerHistory = asyncHandler(async (req, res) => {
  const ledgerEntries = await CustomerLedgerHistory.find().populate('orderRef');

  if (!ledgerEntries || ledgerEntries.length === 0) {
    throw new ApiError(404, "No ledger history entries found.");
  }

  const formattedEntries = await Promise.all(ledgerEntries.map(async (entry, index) => {
    const order = entry.orderRef;
    let orderDetails = {};

    if (entry.orderType === "Booking") {
      orderDetails = {
        bookingId: order.bookingId,
        date: order.date,
        name: order.senderName,
        order: "Booking",
      };
    } else if (entry.orderType === "Quotation") {
      orderDetails = {
        bookingId: order.bookingId,
        date: order.quotationDate,
        name: order.fromCustomerName,
        order: "Quotation",
      };
    }

    const invoiceId = `BHPAR${Math.floor(Math.random() * 1000)}INVO`;

    return {
      sNo: index + 1,
      invoiceId: invoiceId,
      bookingId: orderDetails.bookingId,
      date: orderDetails.date,
      name: orderDetails.name,
      order: orderDetails.order,
      amount: entry.amount,
      paidAmount: entry.amount - entry.remainingAmount,
      remainingAmount: entry.remainingAmount,
      invoiceLink: `/invoice/${invoiceId}`,
    };
  }));

  res.status(200).json(new ApiResponse(200, formattedEntries, "Ledger history entries fetched successfully."));
});

// Search Ledger entries with filter
export const getLedgerEntries = asyncHandler(async (req, res) => {
  const { senderName, orderType, startDate, endDate } = req.query;
  const filter = {};

  if (orderType) filter.orderType = orderType;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const ledgerEntries = await CustomerLedgerHistory.find(filter).populate("orderRef");

  let filteredEntries = ledgerEntries;

  if (senderName) {
    filteredEntries = ledgerEntries.filter((entry) => {
      if (entry.orderType === "Booking") {
        return entry.orderRef?.senderName?.toLowerCase().includes(senderName.toLowerCase());
      } else if (entry.orderType === "Quotation") {
        return entry.orderRef?.fromCustomerName?.toLowerCase().includes(senderName.toLowerCase());
      }
      return false;
    });
  }

  const data = filteredEntries.map((entry, index) => ({
    sno: index + 1,
    orderType: entry.orderType,
    bookingId: entry.orderRef?.bookingId || "",
    date: entry.orderRef?.date || entry.orderRef?.quotationDate || "",
    pickupLocation: entry.orderRef?.startStationName || "",
    dropLocation: entry.orderRef?.endStationName || "",
  }));
  

  res.status(200).json(new ApiResponse(200, data, "Ledger entries fetched successfully."));
});

// Create a Ledger entry
export const createLedgerEntry = asyncHandler(async (req, res) => {
  const { orderType, bookingId, amount, remainingAmount, additionalComments } = req.body;

  if (!orderType || !bookingId || amount == null) {
    throw new ApiError(400, "orderType, bookingId, and amount are required.");
  }

  let orderDoc;
  let refModel;

  if (orderType === "Booking") {
    orderDoc = await Booking.findOne({ bookingId });
    refModel = "Booking";
  } else if (orderType === "Quotation") {
    orderDoc = await Quotation.findOne({ bookingId });
    refModel = "Quotation";
  } else {
    throw new ApiError(400, "orderType must be either 'Booking' or 'Quotation'.");
  }

  if (!orderDoc) {
    throw new ApiError(404, `${orderType} not found with bookingId: ${bookingId}`);
  }

  const ledger = await CustomerLedgerHistory.create({
    orderType,
    orderRef: orderDoc._id,
    orderTypeRef: refModel,
    amount,
    remainingAmount: remainingAmount || 0,
    additionalComments: additionalComments || "",
  });

  res.status(201).json(new ApiResponse(201, ledger, "Ledger entry created successfully."));
});

// Update a Ledger entry
export const updateLedgerEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { remainingAmount, additionalComments } = req.body;

  const ledger = await CustomerLedgerHistory.findById(id);
  if (!ledger) throw new ApiError(404, "Ledger entry not found.");

  if (remainingAmount != null) ledger.remainingAmount = remainingAmount;
  if (additionalComments != null) ledger.additionalComments = additionalComments;

  await ledger.save();
  res.status(200).json(new ApiResponse(200, ledger, "Ledger entry updated successfully."));
});
