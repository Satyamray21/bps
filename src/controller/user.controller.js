import { User } from "../model/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs/promises";
import jwt from "jsonwebtoken";  // Ensure this line is present

import bcrypt from "bcrypt"
// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
  try {
    console.log("Req body",req.body);
    console.log("Req file",req.files);
    if (req.body.role === 'admin' && req.body.isBlacklisted === true) {
      throw new ApiError(400, "Admin users cannot be blacklisted");
    }
    let userData = { ...req.body };

    
    if (req.files) {
      if (req.files['idProofPhoto']) {
        userData.idProofPhoto = req.files['idProofPhoto'][0].path; // File path
      }
      if (req.files['adminProfilePhoto']) {
        userData.adminProfilePhoto = req.files['adminProfilePhoto'][0].path; // File path
      }
    }

   
    if (!userData.idProofPhoto || !userData.adminProfilePhoto) {
      throw new ApiError(400, "Both idProofPhoto and adminProfilePhoto are required.");
    }

    const user = new User(userData);
    await user.save();
    try {
              if (userData.idProofPhoto) {
                await fs.unlink(userData.idProofPhoto);
              }
              if(userData.adminProfilePhoto)
              {
                await fs.unlink(userData.adminProfilePhoto);
              }
              
            } catch (error) {
              console.error("Error deleting temp files:", error);
            }
    res.status(201).json(new ApiResponse(201, "User registered successfully", user));
  } catch (error) {
    console.log("error message",error.message);
    throw new ApiError(400, "Registration failed", error.message);
  }
});
export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Check if email is provided
    if (!emailId || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // Find the user by email
    const user = await User.findOne({ emailId }).select("+password");
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Generate a JWT token
    const token = jwt.sign(
      { adminId: user.adminId, userId: user._id }, // payload
      process.env.ACCESS_TOKEN_SECRET, // secret key from env
      { expiresIn: "1h" } // token expiration
    );

    // Set the token in the cookies (optional, if you want to use cookies for storing the token)
    res.cookie("accessToken", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 3600000 }); // 1 hour

    // Respond with success and token
    res.status(200).json(new ApiResponse(200, "Login successful", { token }));

  } catch (error) {
    console.log("Login error:", error.message);
    throw new ApiError(400, "Login failed", error.message);
  }
});
// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
  try {
    // Clear the access token from cookies
    res.clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    // Send response
    res.status(200).json(new ApiResponse(200, "User logged out successfully"));
  } catch (error) {
    console.error("Logout error:", error.message);
    throw new ApiError(500, "Logout failed", error.message);
  }
});

// Get all users for admin 
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
    let updatedData = { ...req.body };

    // Fetch current user data (to delete old photos if needed)
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    // If new files are uploaded
    if (req.files) {
      if (req.files['idProofPhoto']) {
        // Delete old idProofPhoto if exists
        if (existingUser.idProofPhoto) {
          try {
            await fs.unlink(existingUser.idProofPhoto);
          } catch (unlinkError) {
            console.error("Error deleting old idProofPhoto:", unlinkError);
          }
        }
        // Save new file path
        updatedData.idProofPhoto = req.files['idProofPhoto'][0].path;
      }

      if (req.files['adminProfilePhoto']) {
        // Delete old adminProfilePhoto if exists
        if (existingUser.adminProfilePhoto) {
          try {
            await fs.unlink(existingUser.adminProfilePhoto);
          } catch (unlinkError) {
            console.error("Error deleting old adminProfilePhoto:", unlinkError);
          }
        }
        // Save new file path
        updatedData.adminProfilePhoto = req.files['adminProfilePhoto'][0].path;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(new ApiResponse(200, "User updated successfully", updatedUser));
  } catch (error) {
    console.error("Update user error:", error.message);
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
    const supervisors = await User.find({ role: 'supervisor' }).select("adminId firstName lastName contactNumber");

    const formattedSupervisors = supervisors.map((supervisor, index) => ({
      sNo: index + 1,
      supervisorId: supervisor.adminId,
      name: `${supervisor.firstName} ${supervisor.lastName}`,
      contact: supervisor.contactNumber,
    }));

    res.status(200).json(new ApiResponse(200, "Supervisors fetched successfully", formattedSupervisors));
  } catch (error) {
    throw new ApiError(500, "Error fetching supervisors", error.message);
  }
});

// Get list of all admins
export const getAdminsList = asyncHandler(async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select("adminId firstName lastName contactNumber");

    const formattedAdmins = admins.map((admin, index) => {
      console.log("Fetched Admin:", {
        index: index + 1,
        adminId: admin.adminId,
        name: `${admin.firstName} ${admin.lastName}`,
        contact: admin.contactNumber,
      });

      return {
        "S.No": index + 1,
        "Super admin Id": admin.adminId,
        name: `${admin.firstName} ${admin.lastName}`,
        contact: admin.contactNumber,
      };
    });

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
