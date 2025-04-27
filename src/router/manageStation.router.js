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


router.route("/create").post(parseFormData, createManageStation);


router.route("/getAllStations").get(getAllStations);


router.route("/getTotalStations").get(getTotalStations);


router.route("/searchById/:stationId").get(searchStationById);


router.route("/update/:id").put(parseFormData, updateStation);


router.route("/delete/:id").delete(deleteStation);

export default router;
