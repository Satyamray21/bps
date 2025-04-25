import { Vehicle } from "../model/vehicle.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// CREATE Vehicle
export const createVehicle = asyncHandler(async (req, res) => {
  console.log("Reg body:",req.body);
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
    isBlacklisted,   
    isActive         
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
    isBlacklisted,    
    isActive         
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Vehicle created successfully", vehicle));
});


// GET All Vehicles
export const getAllVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find();

  const vehicleList = vehicles.map((vehicle, index) => ({
    sNo: index + 1,
    vehicleId: vehicle.vehicleId,
    location: vehicle.currentLocation,
    ownedBy: vehicle.ownedBy,
    vehicleModel: vehicle.vehicleModel,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, "Vehicles fetched successfully", vehicleList));
});

// GET Vehicle by ID
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


// UPDATE Vehicle
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

  return res.status(200).json(new ApiResponse(200, "Total vehicles count fetched successfully", { totalVehicles }));
});

// GET Available Vehicle Count
export const getAvailableVehiclesCount = asyncHandler(async (req, res) => {
  const availableVehicles = await Vehicle.countDocuments({
    isActive: true,
    isBlacklisted: false
  });

  return res.status(200).json(new ApiResponse(200, "Available vehicles count fetched successfully", { availableVehicles }));
});

// GET Deactivated Vehicle Count
export const getDeactivatedVehiclesCount = asyncHandler(async (req, res) => {
  const deactivatedVehicles = await Vehicle.countDocuments({
    isActive: false
  });

  return res.status(200).json(new ApiResponse(200, "Deactivated vehicles count fetched successfully", { deactivatedVehicles }));
});

// GET Blacklisted Vehicle Count
export const getBlacklistedVehiclesCount = asyncHandler(async (req, res) => {
  const blacklistedVehicles = await Vehicle.countDocuments({
    isBlacklisted: true
  });

  return res.status(200).json(new ApiResponse(200, "Blacklisted vehicles count fetched successfully", { blacklistedVehicles }));
});

