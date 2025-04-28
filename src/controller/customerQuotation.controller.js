import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import Quotation from "../model/Customerquotation.model.js";
import { Customer } from "../model/customer.model.js";
import manageStation from "../model/manageStation.model.js";

 const formatQuotations = (quotations) => {
  return quotations.map((q, index) => ({
    "S.No.": index + 1,
    "Booking ID": q.bookingId,
    "Date": q.quotationDate ? q.quotationDate.toISOString().split("T")[0] : "",
    "Name": q.customerId ? `${q.customerId.firstName} ${q.customerId.lastName}` : "",
    "Pick up": q.startStation ? q.startStation.stationName : "",
    "": "",
    "Name (Drop)": q.toCustomerName || "",
    "Drop": q.toCity || "",
    "Contact": q.mobile || "",
    "Action": [
      { name: "View", icon: "view-icon", action: `/api/quotations/${q._id}` },
      { name: "Edit", icon: "edit-icon", action: `/api/quotations/edit/${q._id}` },
      { name: "Delete", icon: "delete-icon", action: `/api/quotations/delete/${q._id}` },
    ],
  }));
};

// Create Quotation Controller
export const createQuotation = asyncHandler(async (req, res, next) => {
  const { customerId, startStation, ...data } = req.body;

  // Validate customerId
  if (!customerId) {
    return next(new ApiError(400, "Customer ID is required"));
  }

  const customer = await Customer.findOne({ customerId: customerId });
  if (!customer) return next(new ApiError(404, "Customer not found"));

  // Validate startStation
  if (!startStation) {
    return next(new ApiError(400, "Start Station ID is required"));
  }

  const station = await manageStation.findOne({ stationId: startStation });
  if (!station) return next(new ApiError(404, "Start station not found"));

  // Create a new quotation document
  const quotation = new Quotation({
    ...data,
    customerId: customer._id,
    startStation: station._id,
    startStationName: station.stationName,
    firstName: customer.firstName,
    middleName: customer.middleName,
    lastName: customer.lastName,
    mobile: customer.contactNumber,
    email: customer.emailId,
  });

  await quotation.save();

  res.status(201).json(new ApiResponse(201, quotation, "Quotation created successfully"));
});

// Get All Quotations Controller
export const getAllQuotations = asyncHandler(async (req, res) => {
  const quotations = await Quotation.find()
    .populate("startStation", "stationName")
    .populate("customerId", "firstName lastName");

    const formatted = formatQuotations(quotations);


  res.status(200).json(new ApiResponse(200, formatted));
});

// Get Quotation by ID Controller
export const getQuotationById = asyncHandler(async (req, res, next) => {
  const quotation = await Quotation.findById(req.params.id)
    .populate("startStation", "stationName")
    .populate("customerId", "firstName lastName");

  if (!quotation) return next(new ApiError(404, "Quotation not found"));

  res.status(200).json(new ApiResponse(200, quotation));
});

// Update Quotation Controller
export const updateQuotation = asyncHandler(async (req, res, next) => {
  const updatedQuotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  if (!updatedQuotation) return next(new ApiError(404, "Quotation not found"));

  res.status(200).json(new ApiResponse(200, updatedQuotation, "Quotation updated successfully"));
});

// Delete Quotation Controller
export const deleteQuotation = asyncHandler(async (req, res, next) => {
  const deletedQuotation = await Quotation.findByIdAndDelete(req.params.id);
  
  if (!deletedQuotation) return next(new ApiError(404, "Quotation not found"));

  res.status(200).json(new ApiResponse(200, null, "Quotation deleted successfully"));
});

// Get Total Booking Requests Controller
export const getTotalBookingRequests = asyncHandler(async (req, res) => {
  const total = await Quotation.countDocuments(); 
  res.status(200).json(new ApiResponse(200, { totalBookingRequests: total }));
});

// Get Total Active Deliveries Controller
export const getTotalActiveDeliveries = asyncHandler(async (req, res) => {
  const total = await Quotation.countDocuments({ activeDelivery: true });
  res.status(200).json(new ApiResponse(200, { totalActiveDeliveries: total }));
});

// Get Total Cancelled Quotations Controller
export const getTotalCancelled = asyncHandler(async (req, res) => {
  const total = await Quotation.countDocuments({ totalCancelled: { $gt: 0 } });
  res.status(200).json(new ApiResponse(200, { totalCancelled: total }));
});

// Get Total Revenue Controller
// Get Total Revenue Controller
export const getTotalRevenue = asyncHandler(async (req, res) => {
  const quotations = await Quotation.find();

  const total = quotations.reduce((sum, q) => {
    // Use the computedTotalRevenue from the virtual field
    const computedRevenue = Number(q.computedTotalRevenue) || 0;

    // Accumulate the computed revenue
    return sum + computedRevenue;
  }, 0);

  res.status(200).json(new ApiResponse(200, { totalRevenue: total }));
});


// Search Quotation by Booking ID Controller
export const searchQuotationByBookingId = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;  // Get the bookingId from the route parameter

  if (!bookingId) {
    return next(new ApiError(400, "Booking ID is required"));
  }

  const quotation = await Quotation.findOne({ bookingId })
    .populate("startStation", "stationName")
    .populate("customerId", "firstName lastName");

  if (!quotation) {
    return next(new ApiError(404, "Quotation not found with the provided Booking ID"));
  }

  res.status(200).json(new ApiResponse(200, quotation));
});

export const getActiveList = asyncHandler(async(req,res)=>{
  const activeQuotations = await Quotation.find({ activeDelivery: true })
    .populate("startStation", "stationName")
    .populate("customerId", "firstName lastName");

    const formatted = formatQuotations(activeQuotations);

  res.status(200).json(new ApiResponse(200, {
    totalActiveDeliveries: activeQuotations.length,
    deliveries: formatted
  }));
});

export const getCancelledList = asyncHandler(async(req,res)=>{
  const cancelledQuotations = await Quotation.find({ totalCancelled: { $gt: 0 } })
    .populate("startStation", "stationName")
    .populate("customerId", "firstName lastName");

  const formatted = formatQuotations(cancelledQuotations);

  res.status(200).json(new ApiResponse(200, {
    totalCancelledDeliveries: cancelledQuotations.length,
    deliveries: formatted
  }));
});


export const getQuotationRevenueList = async (req, res) => {
  try {
    const quotation = await Quotation.find({ totalCancelled: 0 })
      .select('bookingId bookingDate startStation endStation toCity grandTotal')
      .populate('startStation endStation', 'stationName')
      .lean();

    const totalRevenue = quotation.reduce((sum, b) => sum + b.grandTotal, 0);

    const data = quotation.map((b, i) => ({
      SNo:       i + 1,
      bookingId: b.bookingId,
      date:      b.quotationDate,
      pickup:    b.startStation.stationName,
      drop:      b.toCity,
      revenue:   b.grandTotal.toFixed(2),
      action: {
        view:   `/quotation/${b.bookingId}`,
        edit:   `/quotation/edit/${b.bookingId}`,
        delete: `/quotation/delete/${b.bookingId}`
      }
    }));

    res.json({
      totalRevenue: totalRevenue.toFixed(2),
      count:        data.length,
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};