import express from 'express';
import { 
  getUserBills, 
  getBillDetail, 
  createNewBill, 
  updateBillInfo, 
  deleteBillInfo 
} from './bill.controller.js';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import { validateId, validateFields } from '../../middleware/validation.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUserBills);

router.get('/:billId', validateId('billId'), getBillDetail);

router.post('/', 
  requireRole('landlord'),
  validateFields({
    roomId: 'required|number',
    amount: 'required|number|min:0',
    billType: 'required|string'
  }),
  createNewBill
);

router.put('/:billId', 
  requireRole('landlord'),
  validateId('billId'),
  updateBillInfo
);

router.delete('/:billId', 
  requireRole('landlord'),
  validateId('billId'),
  deleteBillInfo
);

export default router;
