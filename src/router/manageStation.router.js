import { Router } from "express";
import {
    createManageStation,
    getAllStations,
    updateStation,
    deleteStation
} from "../controller/manageStation.controller.js";
import { parseFormData } from "../middleware/multerParser.middleware.js";

const router = Router();


router.route("/create").post(parseFormData, createManageStation);


router.route("/getAllStations").get(getAllStations);


router.route("/update/:id").put(parseFormData, updateStation);


router.route("/delete/:id").delete(deleteStation);

export default router;
