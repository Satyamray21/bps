import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controller/vehicle.controller.js";

const router = express.Router();

// Create a vehicle
router.post("/vehicle", createVehicle);

// Get all vehicles (with s.no, vehicleId, location, owner name, model)
router.get("/getAllvehicle", getAllVehicles);

router.get("/vehicle/:vehicleId", getVehicleById);

// Get a single vehicle by MongoDB _id
router.get("/vehicle/:id", getVehicleById);

// Update vehicle by MongoDB _id
router.put("/vehicle/:id", updateVehicle);

// Delete vehicle by MongoDB _id
router.delete("/vehicle/:id", deleteVehicle);

export default router;
