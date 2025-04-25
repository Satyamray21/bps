import Router from 'express';
import { 
    createCustomer,
    getAllCustomer,
    getTotalCustomerCount,
    getCustomerByCustomerId,
    updateCustomer,
    deleteCustomer,
    getActiveCustomerCount, // New endpoint for active customers
    getBlacklistedCustomerCount // New endpoint for blacklisted customers
} from '../controller/customer.controller.js';
import { parseFormData } from "../middleware/multerParser.middleware.js";

const router = Router();

// Create a new customer
router.post('/create', parseFormData, createCustomer);

// Get all customers
router.get('/all', getAllCustomer);

// Get total customer count
router.get('/total-count', getTotalCustomerCount);

// Get active customer count (new endpoint)
router.get('/active-count', getActiveCustomerCount);

// Get blacklisted customer count (new endpoint)
router.get('/blacklisted-count', getBlacklistedCustomerCount);

// Get customer by customerId
router.get('/:customerId', getCustomerByCustomerId);

// Update customer
router.put('/update/:id', parseFormData, updateCustomer);

// Delete customer
router.delete('/delete/:id', deleteCustomer);

export default router;
