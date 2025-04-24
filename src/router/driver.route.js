import express from "express";
import {
    createDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    deleteDriver,
    getTotalDriversCount,
     getAvailableDrivers ,
     getBlacklistedDrivers,
     getAvailableDriversCount,
     getBlacklistedDriversCount,
     getDriverByDriverId
} from "../controller/driver.controller.js";
import { parseFormData } from "../middleware/multerParser.middleware.js";
const router = express.Router();

router.post("/createDriver",parseFormData, createDriver);
router.get("/getAllDriver", getAllDrivers);
router.get("/count",getTotalDriversCount)
router.get("/isAvailable", getAvailableDrivers );
router.get("/isBlacklisted",getBlacklistedDrivers);
router.get("/countAvailable", getAvailableDriversCount);
router.get("/countBlacklisted",getBlacklistedDriversCount);
router.get("/:id", getDriverById);
router.put("/:id", parseFormData,updateDriver);
router.delete("/:id", deleteDriver);
router.get("/driverId/:driverId", getDriverByDriverId);


export default router;
