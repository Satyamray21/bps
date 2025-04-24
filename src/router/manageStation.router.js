import {Router} from "express";
import { createManageStation } from "../controller/manageStation.controller.js";
import { parseFormData } from "../middleware/multerParser.middleware.js";
const router = Router();

router.route("/create").post(parseFormData,createManageStation);

export default router;