import express from 'express';
import { 
  getUserContracts, 
  getContractDetail, 
  createNewContract, 
  updateContractInfo, 
  deleteContractInfo 
} from './contract.controller.js';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import { validateId, validateFields } from '../../middleware/validation.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUserContracts);

router.get('/:contractId', validateId('contractId'), getContractDetail);

router.post('/', 
  requireRole('landlord'),
  validateFields({
    roomId: 'required|number',
    tenantId: 'required|number',
    startDate: 'required|date',
    endDate: 'required|date',
    monthlyRent: 'required|number|min:0'
  }),
  createNewContract
);

router.put('/:contractId', 
  requireRole('landlord'),
  validateId('contractId'),
  updateContractInfo
);

router.delete('/:contractId', 
  requireRole('landlord'),
  validateId('contractId'),
  deleteContractInfo
);

export default router;
