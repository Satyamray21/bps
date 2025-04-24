import Router from 'express';
import { 
    createCustomer,
    getAllCustomer,
    getTotalCustomerCount,
    getCustomerByCustomerId,
    updateCustomer,
    deleteCustomer 
} from '../controller/customer.controller.js';
import { parseFormData } from "../middleware/multerParser.middleware.js";
const router = Router();

router.post('/create',parseFormData, createCustomer);


router.get('/all', getAllCustomer);


router.get('/total-count', getTotalCustomerCount);


router.get('/:customerId', getCustomerByCustomerId);


router.put('/update/:id', parseFormData,updateCustomer);


router.delete('/delete/:id', deleteCustomer);

export default router;
