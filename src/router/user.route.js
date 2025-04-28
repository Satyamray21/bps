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
  loginUser,
  getDeactivatedSupervisorsList,
  getBlacklistedSupervisorsList,
  logoutUser
} from "../controller/user.controller.js";

import { verifyJwt } from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js"
import { multerErrorHandler } from "../utils/multerErrorHandler.js";
const router = express.Router();

// Register user
router.route("/register").post(upload.fields([
      {
          name:"idProofPhoto",
          maxCount :1
      },
      {
        name:"adminProfilePhoto",
        maxCount :1 
      }
    ]),multerErrorHandler,registerUser);
    router.post("/login", loginUser);
    router.get("/protected", verifyJwt, (req, res) => {
      res.status(200).json({ message: "This is a protected route" });
    });
    router.route("/logout").post(verifyJwt,logoutUser)
// Admin user CRUD
router.get("/admin/users", getAllUsersForAdmin);
router.get("/admin/user/:id", getUserById);
router.route("/admin/user/:id").put(upload.fields([
  {
      name:"idProofPhoto",
      maxCount :1
  },
  {
    name:"adminProfilePhoto",
    maxCount :1 
  }
]),multerErrorHandler,updateUser);
router.delete("/admin/user/:adminId", deleteUser);

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
