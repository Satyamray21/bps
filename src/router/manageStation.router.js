import { Router } from "express";
import {
  createManageStation,
  getAllStations,
  updateStation,
  deleteStation,
  getTotalStations,
  searchStationById
} from "../controller/manageStation.controller.js";


const router = Router();


router.route("/create").post(createManageStation);


router.route("/getAllStations").get(getAllStations);


router.route("/getTotalStations").get(getTotalStations);


router.route("/searchById/:stationId").get(searchStationById);


router.route("/update/:id").put(updateStation);


router.route("/delete/:id").delete(deleteStation);

export default router;
