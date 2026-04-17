import express from 'express';
import {
  getMeterReadings,
  getMeterReadingById,
  createMeterReading,
  updateMeterReading,
  searchMeterReadings,
  getUtilityRates,
  updateUtilityRates
} from '../controllers/utilityController.js';
import {
  authMiddleware,
  requireLandlord,
  checkRoomAccess
} from '../middleware/auth.js';
import { validateFields, validateId } from '../middleware/validation.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/meter-readings',
  requireLandlord,
  getMeterReadings
);

router.post('/meter-readings',
  requireLandlord,
  validateFields({
    roomId: 'required|string',
    month: 'required|number',
    year: 'required|number',
    electricityReading: 'required|number',
    waterReading: 'required|number'
  }),
  createMeterReading
);

router.get('/meter-readings/search',
  requireLandlord,
  searchMeterReadings
);

router.get('/meter-readings/:id',
  validateId('id'),
  getMeterReadingById
);

router.put('/meter-readings/:id',
  requireLandlord,
  validateId('id'),
  validateFields({
    electricityReading: 'number',
    waterReading: 'number'
  }),
  updateMeterReading
);

router.get('/rates',
  requireLandlord,
  getUtilityRates
);

router.put('/rates',
  requireLandlord,
  validateFields({
    electricityPrice: 'number',
    waterPrice: 'number',
    effectiveDate: 'string'
  }),
  updateUtilityRates
);

export default router;
