import express from "express";
import { getInvoices,  getAllInvoices } from "../controller/customerLedgerHistory.controller.js"

const router = express.Router();

// Route to get invoice preview
router.post('/invoices', getInvoices);

// Route to submit an invoice and generate ledger history
router.get('/',  getAllInvoices);

export default router;
