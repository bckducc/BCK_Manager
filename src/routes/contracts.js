import express from 'express';
import {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  terminateContract,
  searchContracts
} from '../controllers/contractController.js';
import {
  authMiddleware,
  requireLandlord,
  checkContractAccess
} from '../middleware/auth.js';
import { validateFields, validateId } from '../middleware/validation.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/',
  requireLandlord,
  getAllContracts
);

router.post('/',
  requireLandlord,
  validateFields({
    tenantId: 'required|string',
    roomId: 'required|string',
    startDate: 'required|date',
    endDate: 'required|date',
    monthlyRent: 'required|number',
    deposit: 'required|number',
    paymentCycle: 'required|string'
  }),
  createContract
);

router.get('/search',
  searchContracts
);

router.get('/:id',
  validateId('id'),
  checkContractAccess(require('../models/Contract.js').default || null),
  getContractById
);

router.put('/:id',
  requireLandlord,
  validateId('id'),
  validateFields({
    monthlyRent: 'number',
    deposit: 'number',
    paymentCycle: 'string'
  }),
  updateContract
);

router.patch('/:id/terminate',
  requireLandlord,
  validateId('id'),
  terminateContract
);

export default router;
