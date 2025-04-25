
import express from "express";
import { createExpense, getAllExpenses, getExpenseByNo, updateExpenseByNo, deleteExpenseByNo } from "../controller/expense.controller.js";
import { parseFormData } from "../middleware/multerParser.middleware.js"
const router = express.Router();


router.post("/createexpenses", parseFormData,createExpense);


router.get("/getexpenses", getAllExpenses);


router.get("/expense/:invoiceNo", getExpenseByNo);


router.put("/expense/:invoiceNo", parseFormData,updateExpenseByNo);


router.delete("/expense/:invoiceNo", deleteExpenseByNo);

export default router;
