import { Router } from 'express';
import {
  createCustomer,
  getAllCustomers,
  getTotalCustomerCount,
  getCustomerByCustomerId,
  updateCustomer,
  deleteCustomer,
  getActiveCustomerCount,
  getBlacklistedCustomerCount,
  getBlockedCustomers,
  getActiveCustomers
} from '../controller/customer.controller.js';
import { parseFormData } from "../middleware/multerParser.middleware.js";

const router = Router();

// Create a new customer
router.post('/create', parseFormData, createCustomer);

// Get all customers
router.get('/all', getAllCustomers);

// Get total customer count
router.get('/total-count', getTotalCustomerCount);

// Get active customer count
router.get('/active-count', getActiveCustomerCount);

// Get blacklisted customer count
router.get('/blacklisted-count', getBlacklistedCustomerCount);

// Get active customers list
router.get('/active-list', getActiveCustomers);

// Get blacklisted (blocked) customers list
router.get('/blacklisted-list', getBlockedCustomers);

// Get customer by customerId
router.get('/:customerId', getCustomerByCustomerId);

// Update customer
router.put('/update/:id', parseFormData, updateCustomer);

// Delete customer
router.delete('/delete/:id', deleteCustomer);

export default router;
