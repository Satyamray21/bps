import { Driver } from "../model/driver.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createDriver = asyncHandler(async (req, res) => {
    const {
        firstName,
        middleName,
        lastName,
        contactNumber,
        emailId,
        password,
        address,
        distinct,
        state,
        city,
        dlNumber,
        idProof,
        isAvailable,
        isBlacklisted

    } = req.body;

    if ([firstName, lastName, emailId, password, address, state, city, dlNumber, idProof]
        .some(field => typeof field === "string" && field.trim() === "")) {
        throw new ApiError(400, "All required fields must be provided.");
    }

    const existingDriver = await Driver.findOne({ emailId });
    if (existingDriver) {
        throw new ApiError(409, "Email is already registered.");
    }

    const driver = await Driver.create({
        firstName,
        middleName,
        lastName,
        contactNumber,
        emailId,
        password,
        address,
        distinct,
        state,
        city,
        dlNumber,
        idProof,
        isBlacklisted: isBlacklisted === "true" || isBlacklisted === true,
        isAvailable: isAvailable === "true" || isAvailable === true,
    });

    return res.status(201).json(new ApiResponse(201, "Driver created successfully", driver));
});

export const getAllDrivers = asyncHandler(async (req, res) => {
    const drivers = await Driver.find();

    const driverList = drivers.map((driver, index) => ({
        sNo: index + 1,
        driverId: driver.driverId,
        name: `${driver.firstName} ${driver.middleName ? driver.middleName + ' ' : ''}${driver.lastName}`,
        contactNumber: driver.contactNumber,
        isAvailable: driver.isAvailable,
        isBlacklisted: driver.isBlacklisted
    }));

    return res.status(200).json(new ApiResponse(200, "Drivers fetched successfully", driverList));
});

export const getTotalDriversCount = asyncHandler(async (req, res) => {
    const totalDrivers = await Driver.countDocuments();
    return res.status(200).json(new ApiResponse(200, "Total drivers count fetched", totalDrivers));
});

export const getDriverById = asyncHandler(async (req, res) => {
    const driver = await Driver.findById({driverId: req.params.id});
    if (!driver) {
        throw new ApiError(404, "Driver not found");
    }
    return res.status(200).json(new ApiResponse(200, "Driver fetched", driver));
});
export const getDriverByDriverId = asyncHandler(async (req, res) => {
    const driver = await Driver.findOne({ driverId: req.params.driverId }); // Find by custom driverId
    if (!driver) {
        throw new ApiError(404, "Driver not found");
    }
    return res.status(200).json(new ApiResponse(200, "Driver fetched", driver));
});

export const updateDriver = asyncHandler(async (req, res) => {
    const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedDriver) {
        throw new ApiError(404, "Driver not found");
    }
    return res.status(200).json(new ApiResponse(200, "Driver updated successfully", updatedDriver));
});

export const deleteDriver = asyncHandler(async (req, res) => {
    const deletedDriver = await Driver.findByIdAndDelete(req.params.id);
    if (!deletedDriver) {
        throw new ApiError(404, "Driver not found");
    }
    return res.status(200).json(new ApiResponse(200, "Driver deleted successfully"));
});

export const getAvailableDrivers = asyncHandler(async (req, res) => {
    const drivers = await Driver.find({ isAvailable: true, isBlacklisted: false });
    return res.status(200).json(new ApiResponse(200, "Available drivers fetched", drivers));
});

export const getBlacklistedDrivers = asyncHandler(async (req, res) => {
    const drivers = await Driver.find({ isBlacklisted: true });
    return res.status(200).json(new ApiResponse(200, "Blacklisted drivers fetched", drivers));
});

export const updateDriverStatus = asyncHandler(async (req, res) => {
    const { isAvailable, isBlacklisted } = req.body;
    const driver = await Driver.findByIdAndUpdate(
        req.params.id,
        { isAvailable, isBlacklisted },
        { new: true, runValidators: true }
    );
    if (!driver) {
        throw new ApiError(404, "Driver not found");
    }
    return res.status(200).json(new ApiResponse(200, "Driver status updated", driver));
});
export const getAvailableDriversCount = asyncHandler(async (req, res) => {
    const count = await Driver.countDocuments({ isAvailable: true, isBlacklisted: false });
    return res.status(200).json(new ApiResponse(200, "Available drivers count fetched", count));
});
export const getBlacklistedDriversCount = asyncHandler(async (req, res) => {
    const count = await Driver.countDocuments({ isBlacklisted: true });
    return res.status(200).json(new ApiResponse(200, "Blacklisted drivers count fetched", count));
});

