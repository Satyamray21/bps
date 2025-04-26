import express from "express";
import {
    createDriver,
    getAllDrivers,
    getDriverById,
    getDriverByDriverId,
    updateDriver,
    deleteDriver,
    getTotalDriversCount,
    getAvailableDrivers,
    getBlacklistedDrivers,
    getAvailableDriversCount,
    getBlacklistedDriversCount,
    updateDriverStatus
} from "../controller/driver.controller.js";
import { parseFormData } from "../middleware/multerParser.middleware.js";

const router = express.Router();

// ➡️ Create Driver
router.post("/create", parseFormData, createDriver);

// ➡️ Get All Drivers
router.get("/all", getAllDrivers);

// ➡️ Get Available Drivers List
router.get("/available-list", getAvailableDrivers);

// ➡️ Get Blacklisted Drivers List
router.get("/blacklisted-list", getBlacklistedDrivers);

// ➡️ Get Total Driver Count
router.get("/total-count", getTotalDriversCount);

// ➡️ Get Available Drivers Count
router.get("/available-count", getAvailableDriversCount);

// ➡️ Get Blacklisted Drivers Count
router.get("/blacklisted-count", getBlacklistedDriversCount);

// ➡️ Get Driver by Mongo _id
router.get("/:id", getDriverById);

// ➡️ Get Driver by custom driverId
router.get("/driver-id/:driverId", getDriverByDriverId);

// ➡️ Update Driver details
router.put("/update/:id", parseFormData, updateDriver);

// ➡️ Update only Driver Status (isAvailable, isBlacklisted)
router.patch("/update-status/:id", updateDriverStatus);

// ➡️ Delete Driver
router.delete("/delete/:id", deleteDriver);

export default router;
