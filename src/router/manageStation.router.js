import { Router } from "express";
import {
  createManageStation,
  getAllStations,
  updateStation,
  deleteStation,
  getTotalStations,
  searchStationById
} from "../controller/manageStation.controller.js";
import { parseFormData } from "../middleware/multerParser.middleware.js";

const router = Router();

// Create Station
router.route("/create").post(parseFormData, createManageStation);

// Get All Stations
router.route("/getAllStations").get(getAllStations);

// Get Total Stations
router.route("/getTotalStations").get(getTotalStations);

// Search Station by ID
router.route("/searchById/:stationId").get(searchStationById);

// Update Station
router.route("/update/:id").put(parseFormData, updateStation);

// Delete Station
router.route("/delete/:id").delete(deleteStation);

export default router;
