import express from 'express';
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  confirmPayment,
  exportInvoice,
  searchInvoices
} from '../controllers/invoiceController.js';
import {
  authMiddleware,
  requireLandlord,
  checkInvoiceAccess
} from '../middleware/auth.js';
import { validateFields, validateId } from '../middleware/validation.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/',
  requireLandlord,
  getAllInvoices
);

router.post('/',
  requireLandlord,
  validateFields({
    tenantId: 'required|string',
    roomId: 'required|string',
    month: 'required|number',
    year: 'required|number',
    rentAmount: 'required|number'
  }),
  createInvoice
);

router.get('/search',
  searchInvoices
);

router.get('/:id',
  validateId('id'),
  checkInvoiceAccess(require('../models/Invoice.js').default || null),
  getInvoiceById
);

router.put('/:id',
  requireLandlord,
  validateId('id'),
  validateFields({
    rentAmount: 'number',
    utilities: 'object',
    services: 'object'
  }),
  updateInvoice
);

router.patch('/:id/payment-confirm',
  requireLandlord,
  validateId('id'),
  confirmPayment
);

router.get('/:id/export',
  validateId('id'),
  checkInvoiceAccess(require('../models/Invoice.js').default || null),
  exportInvoice
);

export default router;
