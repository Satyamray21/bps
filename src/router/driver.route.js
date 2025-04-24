import express from "express";
import {
    createDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    deleteDriver,
    getTotalDriversCount
} from "../controller/driver.controller.js";
import { parseFormData } from "../middleware/multerParser.middleware.js";
const router = express.Router();

router.post("/createDriver",parseFormData, createDriver);
router.get("/getAllDriver", getAllDrivers);
router.get("/count",getTotalDriversCount)
router.get("/:id", getDriverById);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);

export default router;
