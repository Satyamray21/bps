import { User } from "../model/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
  try {
    if (req.body.role === 'admin' && req.body.isBlacklisted === true) {
      throw new ApiError(400, "Admin users cannot be blacklisted");
    }
    const user = new User(req.body);
    await user.save();
    res.status(201).json(new ApiResponse(201, "User registered successfully", user));
  } catch (error) {
    console.log("error message",error.message);
    throw new ApiError(400, "Registration failed", error.message);
  }
});

// Get all users for admin (with formatted data)
export const getAllUsersForAdmin = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("userId firstName lastName contactNumber");

    const formattedUsers = users.map((user, index) => ({
      sNo: index + 1,
      adminId: user.userId,
      name: `${user.firstName} ${user.lastName}`,
      contact: user.contactNumber,
      userId: user._id,
    }));

    res.status(200).json(new ApiResponse(200, "Users fetched successfully", formattedUsers));
  } catch (error) {
    throw new ApiError(500, "Error fetching users", error.message);
  }
});

// Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// Update user by ID
export const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, "User updated successfully", user));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// Delete user by ID
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, "User deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// Count total admins
export const countTotalAdmins = asyncHandler(async (req, res) => {
  const totalAdmins = await User.countDocuments({ role: 'admin' });
  res.status(200).json(new ApiResponse(200, "Total number of admins fetched", totalAdmins));
});

// Count total supervisors
export const countTotalSupervisors = asyncHandler(async (req, res) => {
  const totalSupervisors = await User.countDocuments({ role: 'supervisor' });
  res.status(200).json(new ApiResponse(200, "Total number of supervisors fetched", totalSupervisors));
});

// Count blacklisted supervisors
export const countBlacklistedSupervisors = asyncHandler(async (req, res) => {
  const blacklistedSupervisors = await User.countDocuments({ role: 'supervisor', isBlacklisted: true });
  res.status(200).json(new ApiResponse(200, "Total blacklisted supervisors fetched", blacklistedSupervisors));
});

// Count deactivated supervisors
export const countDeactivatedSupervisors = asyncHandler(async (req, res) => {
  const deactivatedSupervisors = await User.countDocuments({ role: 'supervisor', isActive: false });
  res.status(200).json(new ApiResponse(200, "Total deactivated supervisors fetched", deactivatedSupervisors));
});

// Get list of all supervisors
export const getSupervisorsList = asyncHandler(async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'supervisor' }).select("userId firstName lastName contactNumber");

    const formattedSupervisors = supervisors.map((supervisor, index) => ({
      sNo: index + 1,
      supervisorId: supervisor.userId,
      name: `${supervisor.firstName} ${supervisor.lastName}`,
      contact: supervisor.contactNumber,
      userId: supervisor._id,
    }));

    res.status(200).json(new ApiResponse(200, "Supervisors fetched successfully", formattedSupervisors));
  } catch (error) {
    throw new ApiError(500, "Error fetching supervisors", error.message);
  }
});

// Get list of all admins
export const getAdminsList = asyncHandler(async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select("userId firstName lastName contactNumber");

    const formattedAdmins = admins.map((admin, index) => ({
      sNo: index + 1,
      adminId: admin.userId,
      name: `${admin.firstName} ${admin.lastName}`,
      contact: admin.contactNumber,
      userId: admin._id,
    }));

    res.status(200).json(new ApiResponse(200, "Admins fetched successfully", formattedAdmins));
  } catch (error) {
    throw new ApiError(500, "Error fetching admins", error.message);
  }
});

// Get list of deactivated supervisors
export const getDeactivatedSupervisorsList = asyncHandler(async (req, res) => {
  try {
    const deactivatedSupervisors = await User.find({ role: 'supervisor', isActive: false })
      .select("userId firstName lastName contactNumber");

    const formattedDeactivatedSupervisors = deactivatedSupervisors.map((supervisor, index) => ({
      sNo: index + 1,
      supervisorId: supervisor.userId,
      name: `${supervisor.firstName} ${supervisor.lastName}`,
      contact: supervisor.contactNumber,
      userId: supervisor._id,
    }));

    res.status(200).json(new ApiResponse(200, "Deactivated supervisors fetched successfully", formattedDeactivatedSupervisors));
  } catch (error) {
    throw new ApiError(500, "Error fetching deactivated supervisors", error.message);
  }
});

// Get list of blacklisted supervisors
export const getBlacklistedSupervisorsList = asyncHandler(async (req, res) => {
  try {
    const blacklistedSupervisors = await User.find({ role: 'supervisor', isBlacklisted: true })
      .select("userId firstName lastName contactNumber");

    const formattedBlacklistedSupervisors = blacklistedSupervisors.map((supervisor, index) => ({
      sNo: index + 1,
      supervisorId: supervisor.userId,
      name: `${supervisor.firstName} ${supervisor.lastName}`,
      contact: supervisor.contactNumber,
      userId: supervisor._id,
    }));

    res.status(200).json(new ApiResponse(200, "Blacklisted supervisors fetched successfully", formattedBlacklistedSupervisors));
  } catch (error) {
    throw new ApiError(500, "Error fetching blacklisted supervisors", error.message);
  }
});
