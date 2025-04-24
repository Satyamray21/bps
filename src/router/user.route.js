import express from "express";
import {
  registerUser,
  getAllUsersForAdmin,
  getUserById,
  updateUser,
  deleteUser,
  countTotalAdmins,
  countTotalSupervisors,
  countBlacklistedSupervisors,
  countDeactivatedSupervisors,
} from "../controller/user.controller.js";
import { parseFormData } from "../middleware/multerParser.middleware.js"; 

const router = express.Router();


router.post("/register", parseFormData, registerUser);


router.get("/admin/users", getAllUsersForAdmin);
router.get("/admin/user/:id", getUserById);
router.put("/admin/user/:id", updateUser);
router.delete("/admin/user/:id", deleteUser);

router.get("/admin/count/admins", countTotalAdmins);
router.get("/admin/count/supervisors", countTotalSupervisors);
router.get("/admin/count/blacklisted-supervisors", countBlacklistedSupervisors);
router.get("/admin/count/deactivated-supervisors", countDeactivatedSupervisors);

export default router;
