import { User } from "../model/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const user = new User(req.body);
    await user.save();
    res.status(201).json(new ApiResponse(201, "User registered successfully", user));
  } catch (error) {
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

  return res.status(200).json(new ApiResponse(200, "Total number of admins fetched", totalAdmins));
});

// Count total supervisors
export const countTotalSupervisors = asyncHandler(async (req, res) => {
  const totalSupervisors = await User.countDocuments({ role: 'supervisor' });

  return res.status(200).json(new ApiResponse(200, "Total number of supervisors fetched", totalSupervisors));
});

// Count blacklisted supervisors
export const countBlacklistedSupervisors = asyncHandler(async (req, res) => {
  const blacklistedSupervisors = await User.countDocuments({ role: 'supervisor', isBlacklisted: true });

  return res.status(200).json(new ApiResponse(200, "Total blacklisted supervisors fetched", blacklistedSupervisors));
});

// Count deactivated supervisors
export const countDeactivatedSupervisors = asyncHandler(async (req, res) => {
  const deactivatedSupervisors = await User.countDocuments({ role: 'supervisor', isActive: false });

  return res.status(200).json(new ApiResponse(200, "Total deactivated supervisors fetched", deactivatedSupervisors));
});
