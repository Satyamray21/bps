import express from "express";
import {
  getAllLedgerHistory,
  getLedgerEntries,
  createLedgerEntry,
  updateLedgerEntry
} from "../controller/customerLedgerHistory.controller.js";

import {parseFormData} from "../middleware/multerParser.middleware.js"
const router = express.Router();

router.get("/", getAllLedgerHistory);
router.get("/search", getLedgerEntries);
router.post("/",parseFormData, createLedgerEntry);
router.put("/:id", updateLedgerEntry);

export default router;
