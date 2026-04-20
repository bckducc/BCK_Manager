import express from 'express';
import { 
  getAllServices, 
  getServiceDetail, 
  createNewService, 
  updateServiceInfo, 
  deleteServiceInfo 
} from './service.controller.js';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import { validateId, validateFields } from '../../middleware/validation.js';

const router = express.Router();

router.get('/', getAllServices);

router.get('/:serviceId', validateId('serviceId'), getServiceDetail);

router.post('/', 
  authMiddleware,
  requireRole('landlord'),
  validateFields({
    serviceName: 'required|string|max:100',
    price: 'required|number|min:0'
  }),
  createNewService
);

router.put('/:serviceId', 
  authMiddleware,
  requireRole('landlord'),
  validateId('serviceId'),
  updateServiceInfo
);

router.delete('/:serviceId', 
  authMiddleware,
  requireRole('landlord'),
  validateId('serviceId'),
  deleteServiceInfo
);

export default router;
