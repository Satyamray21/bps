import express from "express";
import { createLedgerEntry,  getLedgerEntries, updateLedgerEntry } from "../controller/customerLedger.controller.js";
import {parseFormData} from "../middleware/multerParser.middleware.js"
const router = express.Router();

// Create a ledger entry
router.post("/", parseFormData,createLedgerEntry);

// Get ledger entries with optional query filters
router.get("/", getLedgerEntries);

// Update a ledger entry by its _id
router.put("/:id", updateLedgerEntry);

export default router;
