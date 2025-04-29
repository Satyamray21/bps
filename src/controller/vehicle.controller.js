import { Vehicle } from "../model/vehicle.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper function to format vehicle details
const formatVehicleDetails = (vehicles) => {
  return vehicles.map((vehicle, index) => ({
    sNo: index + 1,
    vehicleId: vehicle.vehicleId,
    location: vehicle.currentLocation,
    ownedBy: vehicle.ownedBy,
    vehicleModel: vehicle.vehicleModel,
  }));
};

// CREATE Vehicle
export const createVehicle = asyncHandler(async (req, res) => {
  console.log("Reg body:", req.body);
  const {
    registrationDate,
    regExpiryDate,
    vehicleModel,
    registrationNumber,
    manufactureYear,
    ownedBy,
    currentLocation,
    dateofPurchase,
    purchasedFrom,
    PurchasedUnder,
    purchasePrice,
    depreciation,
    currentValue,
    currentInsuranceProvider,
    policyNumber,
    policyType,
    policyStartDate,
    policyEndDate,
    policyPremium,
    lastFitnessRenewalDate,
    currentFitnessValidUpto,
    firstRegValidUpto,
    renewalDate,
    renewalValidUpto,
    addcomment,
  } = req.body;

  if (!vehicleModel || !ownedBy || !registrationNumber || !currentLocation) {
    throw new ApiError(
      400,
      "vehicleModel, ownedBy, registrationNumber, and currentLocation are required"
    );
  }

  const vehicle = await Vehicle.create({
    registrationDate,
    regExpiryDate,
    vehicleModel,
    registrationNumber,
    manufactureYear,
    ownedBy,
    currentLocation,
    dateofPurchase,
    purchasedFrom,
    PurchasedUnder,
    purchasePrice,
    depreciation,
    currentValue,
    currentInsuranceProvider,
    policyNumber,
    policyType,
    policyStartDate,
    policyEndDate,
    policyPremium,
    lastFitnessRenewalDate,
    currentFitnessValidUpto,
    firstRegValidUpto,
    renewalDate,
    renewalValidUpto,
    addcomment,
    
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Vehicle created successfully", vehicle));
});

// GET All Vehicles
export const getAllVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find();

  const vehicleList = formatVehicleDetails(vehicles);  // Using the helper function

  return res
    .status(200)
    .json(new ApiResponse(200, "Vehicles fetched successfully", vehicleList));
});

// GET Vehicle by ID (Full Details)
export const getVehicleById = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params; // Getting vehicleId from request parameters

  const vehicle = await Vehicle.findOne({ vehicleId }); // Find the vehicle by vehicleId
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Vehicle fetched successfully", vehicle));
});

// UPDATE Vehicle (Full Details)
export const updateVehicle = asyncHandler(async (req, res) => {
  const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new ApiError(404, "Vehicle not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Vehicle updated successfully", updated));
});

// DELETE Vehicle
export const deleteVehicle = asyncHandler(async (req, res) => {
  const deleted = await Vehicle.findByIdAndDelete(req.params.id);

  if (!deleted) throw new ApiError(404, "Vehicle not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Vehicle deleted successfully"));
});

// GET Total Vehicle Count
export const getTotalVehiclesCount = asyncHandler(async (req, res) => {
  const totalVehicles = await Vehicle.countDocuments();

  return res
    .status(200)
    .json(new ApiResponse(200, "Total vehicles count fetched successfully", { totalVehicles }));
});

// GET Available Vehicle Count
export const getAvailableVehiclesCount = asyncHandler(async (req, res) => {
  const availableVehicles = await Vehicle.countDocuments({
    isActive: true,
    isBlacklisted: false
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Available vehicles count fetched successfully", { availableVehicles }));
});

// GET Deactivated Vehicle Count
export const getDeactivatedVehiclesCount = asyncHandler(async (req, res) => {
  const deactivatedVehicles = await Vehicle.countDocuments({
    isActive: false
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Deactivated vehicles count fetched successfully", { deactivatedVehicles }));
});

// GET Blacklisted Vehicle Count
export const getBlacklistedVehiclesCount = asyncHandler(async (req, res) => {
  const blacklistedVehicles = await Vehicle.countDocuments({
    isBlacklisted: true
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Blacklisted vehicles count fetched successfully", { blacklistedVehicles }));
});

// GET Blacklisted Vehicles (List 
export const getBlacklistedVehicles = asyncHandler(async (req, res) => {
  const blacklistedVehicles = await Vehicle.find({
    isBlacklisted: true
  })
    .select('vehicleId currentLocation ownedBy vehicleModel')  // Selecting only the fields needed
    .lean();  // Using .lean() for better performance when we don't need full Mongoose document features

  const result = formatVehicleDetails(blacklistedVehicles);  // Using the helper function

  return res
    .status(200)
    .json(new ApiResponse(200, "Blacklisted vehicles fetched successfully", { blacklistedVehicles: result }));
});

// GET Deactivated Vehicles (List )
export const getDeactivatedVehicles = asyncHandler(async (req, res) => {
  const deactivatedVehicles = await Vehicle.find({
    isActive: false
  })
    .select('vehicleId currentLocation ownedBy vehicleModel')
    .lean();

  const result = formatVehicleDetails(deactivatedVehicles);  // Using the helper function

  return res
    .status(200)
    .json(new ApiResponse(200, "Deactivated vehicles fetched successfully", { deactivatedVehicles: result }));
});

// GET Available Vehicles (List )
export const getAvailableVehicles = asyncHandler(async (req, res) => {
  const availableVehicles = await Vehicle.find({
    isActive: true,
    isBlacklisted: false
  })
    .select('vehicleId currentLocation ownedBy vehicleModel')
    .lean();

  const result = formatVehicleDetails(availableVehicles);  // Using the helper function

  return res
    .status(200)
    .json(new ApiResponse(200, "Available vehicles fetched successfully", { availableVehicles: result }));
});


// UPDATE Vehicle Status (available / blacklisted / deactivated)
export const updateVehicleStatus = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;
  const { action } = req.query;

  if (!action) {
    throw new ApiError(400, "Action is required (available, blacklisted, deactivated).");
  }

  const allowedActions = ["available", "blacklisted", "deactivated"];
  if (!allowedActions.includes(action)) {
    throw new ApiError(400, `Invalid action. Allowed actions: ${allowedActions.join(", ")}`);
  }

  const vehicle = await Vehicle.findOne({ vehicleId });
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found with the given vehicleId.");
  }

  switch (action) {
    case "available":
      vehicle.isActive = true;
      vehicle.isBlacklisted = false;
      break;
    case "blacklisted":
      vehicle.isBlacklisted = true;
      break;
    case "deactivated":
      vehicle.isActive = false;
      break;
  }

  await vehicle.save();

  return res.status(200).json(
    new ApiResponse(200, `Vehicle status updated to '${action}' successfully`, {
      vehicleId: vehicle.vehicleId,
      isActive: vehicle.isActive,
      isBlacklisted: vehicle.isBlacklisted,
    })
  );
});

