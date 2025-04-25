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
  getSupervisorsList,
  getAdminsList,
  getDeactivatedSupervisorsList,
  getBlacklistedSupervisorsList,
} from "../controller/user.controller.js";

import { parseFormData } from "../middleware/multerParser.middleware.js";

const router = express.Router();

// Register user
router.post("/register", parseFormData, registerUser);

// Admin user CRUD
router.get("/admin/users", getAllUsersForAdmin);
router.get("/admin/user/:id", getUserById);
router.put("/admin/user/:id", updateUser);
router.delete("/admin/user/:id", deleteUser);

// Admin user counts
router.get("/admin/count/admins", countTotalAdmins);
router.get("/admin/count/supervisors", countTotalSupervisors);
router.get("/admin/count/blacklisted-supervisors", countBlacklistedSupervisors);
router.get("/admin/count/deactivated-supervisors", countDeactivatedSupervisors);

// Admin role-based user lists
router.get("/admin/supervisors", getSupervisorsList);
router.get("/admin/admins", getAdminsList);
router.get("/admin/supervisors/deactivated", getDeactivatedSupervisorsList);
router.get("/admin/supervisors/blacklisted", getBlacklistedSupervisorsList);

export default router;
