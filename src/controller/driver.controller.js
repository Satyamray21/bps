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
    });

    return res
    .status(201)
    .json(new ApiResponse
        (201, 
        "Driver created successfully", 
        driver));
});


export const getAllDrivers = asyncHandler(async (req, res) => {
    const drivers = await Driver.find();
    return res
    .status(200)
    .json(new ApiResponse(
        200, 
        "Drivers fetched successfully", 
        drivers));
});


export const getTotalDriversCount = asyncHandler(async (req, res) => {
    const totalDrivers = await Driver.countDocuments();
    return res.status(200).json(new ApiResponse(200, "Total drivers count fetched", totalDrivers));
});


export const getDriverById = asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id);
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
    return res
    .status(200)
    .json(
        new ApiResponse(200, 
            "Driver deleted successfully")
        );
});
