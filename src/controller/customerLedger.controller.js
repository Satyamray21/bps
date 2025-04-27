// controllers/customerLedger.controller.js

import Booking from "../model/booking.model.js";
import Quotation from "../model/customerQuotation.model.js"; // Import Quotation model
import CustomerLedger from "../model/customerLedger.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get ledger entries with dynamic customer name, order type, and date range
export const getLedgerEntries = asyncHandler(async (req, res) => {
  const { senderName, orderType, startDate, endDate } = req.query;
  const filter = {};

  if (senderName) filter["orderRef.senderName"] = new RegExp(senderName, 'i'); // Case-insensitive search for customer name
  if (orderType) filter.orderType = orderType;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  // Search in both Booking and Quotation collections
  let bookings = await Booking.find(filter).populate("startStation endStation");
  let quotations = await Quotation.find(filter).populate("startStation endStation");

  // Combine the results from both collections
  let entries = [...bookings, ...quotations];

  // Map entries to desired response format
  const data = entries.map(entry => ({
    id: entry._id,
    orderType: entry.orderType,
    bookingId: entry.bookingId || entry.quotationId,
    date: entry.date,
    pickupLocation: entry.startStation?.stationName || "",
    dropLocation: entry.endStation?.stationName || "",
    amount: entry.amount,
    remainingAmount: entry.remainingAmount,
    additionalComments: entry.additionalComments,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  }));

  res.status(200).json(new ApiResponse(200, data, "Ledger entries fetched successfully."));
});

// Create a ledger entry
export const createLedgerEntry = asyncHandler(async (req, res) => {
  const { orderType, bookingId, amount, remainingAmount, additionalComments } = req.body;

  if (!orderType || !bookingId  || amount == null) {
    throw new ApiError(400, "orderType, bookingId,  and amount are required.");
  }

  let orderDoc;
  let refModel;

  if (orderType === "Booking") {
    orderDoc = await Booking.findOne({ bookingId })
      .populate("startStation", "stationName")
      .populate("endStation", "stationName");
    refModel = "Booking";
  } else if (orderType === "Quotation") {
    orderDoc = await Quotation.findOne({ bookingId })
      .populate("startStation", "stationName")
      .populate("endStation", "stationName");
    refModel = "CustomerQuotation";
  } else {
    throw new ApiError(400, "orderType must be either 'Booking' or 'Quotation'.");
  }

  if (!orderDoc) {
    throw new ApiError(404, `${orderType} not found with bookingId: ${bookingId}`);
  }

  const ledger = await CustomerLedger.create({
    orderType,
    orderRef: orderDoc._id,
    orderTypeRef: refModel,
    amount,
    remainingAmount: remainingAmount || 0,
    additionalComments: additionalComments || "",
  });

  res.status(201).json(new ApiResponse(201, ledger, "Ledger entry created successfully."));
});

// Update a ledger entry by its ID
export const updateLedgerEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { remainingAmount, additionalComments } = req.body;

  const ledger = await CustomerLedger.findById(id);
  if (!ledger) throw new ApiError(404, "Ledger entry not found.");

  if (remainingAmount != null) ledger.remainingAmount = remainingAmount;
  if (additionalComments != null) ledger.additionalComments = additionalComments;

  await ledger.save();
  res.status(200).json(new ApiResponse(200, ledger, "Ledger entry updated successfully."));
});

//customer history


// Get all ledger entries with formatted history
export const getAllLedgerWithHistory = asyncHandler(async (req, res) => {
    const ledgerEntries = await CustomerLedger.find().populate('orderRef'); 
  
    if (!ledgerEntries) {
      throw new ApiError(404, "No ledger entries found.");
    }
  
    const formattedEntries = await Promise.all(ledgerEntries.map(async (entry, index) => {
      const order = entry.orderRef;
      let orderDetails = {};
  
      if (entry.orderType === "Booking") {
        orderDetails = {
          bookingId: order.bookingId,
          date: order.date,
          name: order.senderName, // Customer name from Booking model
          order: "Booking",
        };
      } else if (entry.orderType === "Quotation") {
        orderDetails = {
          bookingId: order.bookingId,
          date: order.quotationDate, // Date from Quotation model
          name: order.customerName, // Customer name from Quotation model
          order: "Quotation",
        };
      }
  
      const invoiceId = `BHPAR${Math.floor(Math.random() * 1000)}INVO`; // Generate random invoice ID
  
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
        invoiceLink: `/invoice/${invoiceId}`, // Link to view invoice
      };
    }));
  
    res.status(200).json(new ApiResponse(200, formattedEntries, "Ledger entries with history fetched successfully."));
  });
  
