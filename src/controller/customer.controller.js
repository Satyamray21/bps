import { Customer } from "../model/customer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Customer
export const createCustomer = asyncHandler(async (req, res) => {
    const {
        firstName,
        middleName,
        lastName,
        contactNumber,
        emailId,
        address,
        distinct,
        state,
        city,
        idProof,
        status = "active",  // Default status is "active"
        isBlacklisted = false, // Default value for blacklist is false
    } = req.body;

    if ([firstName, lastName, emailId, address, state, city, idProof]
        .some(field => typeof field === "string" && field.trim() === "")) {
        throw new ApiError(400, "All required fields must be provided.");
    }

    const existingCustomer = await Customer.findOne({ emailId });
    if (existingCustomer) {
        throw new ApiError(409, "Email is already registered.");
    }

    const customer = await Customer.create({
        firstName,
        middleName,
        lastName,
        contactNumber,
        emailId,
        address,
        distinct,
        state,
        city,
        idProof,
        status, // Set customer status
        isBlacklisted, // Set blacklist status
    });

    return res.status(201).json(new ApiResponse(201, "Customer created successfully", customer));
});

// Get All Customers
export const getAllCustomer = asyncHandler(async (req, res) => {
    const customers = await Customer.find();

    const customerList = customers.map((customer, index) => ({
        sNo: index + 1,
        customerId: customer.customerId,
        name: `${customer.firstName} ${customer.middleName ? customer.middleName + ' ' : ''}${customer.lastName}`,
        contactNumber: customer.contactNumber,
        status: customer.status, // Include status
        isBlacklisted: customer.isBlacklisted, // Include blacklist status
    }));

    return res.status(200).json(new ApiResponse(200, "Customers fetched successfully", customerList));
});

// Get Total Customer Count
export const getTotalCustomerCount = asyncHandler(async (req, res) => {
    const totalCustomer = await Customer.countDocuments();
    return res.status(200).json(new ApiResponse(200, "Total customer count fetched", totalCustomer));
});

// Get Customer by Customer ID
export const getCustomerByCustomerId = asyncHandler(async (req, res) => {
    const customer = await Customer.findOne({ customerId: req.params.customerId });
    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }
    return res.status(200).json(new ApiResponse(200, "Customer fetched", customer));
});

// Update Customer
export const updateCustomer = asyncHandler(async (req, res) => {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedCustomer) {
        throw new ApiError(404, "Customer not found");
    }
    return res.status(200).json(new ApiResponse(200, "Customer updated successfully", updatedCustomer));
});

// Delete Customer
export const deleteCustomer = asyncHandler(async (req, res) => {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
        throw new ApiError(404, "Customer not found");
    }
    return res.status(200).json(new ApiResponse(200, "Customer deleted successfully"));
});

// Get Active Customer Count
export const getActiveCustomerCount = asyncHandler(async (req, res) => {
    const activeCount = await Customer.countDocuments({ status: "active" });
    return res.status(200).json(new ApiResponse(200, "Active customer count fetched successfully", activeCount));
});

// Get Blacklisted Customer Count
export const getBlacklistedCustomerCount = asyncHandler(async (req, res) => {
    const blacklistedCount = await Customer.countDocuments({ isBlacklisted: true });
    return res.status(200).json(new ApiResponse(200, "Blacklisted customer count fetched successfully", blacklistedCount));
});
