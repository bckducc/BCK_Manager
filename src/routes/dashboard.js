import express from 'express';
import {
  getLandlordDashboard,
  getTenantDashboard,
  getNotifications
} from '../controllers/dashboardController.js';
import {
  authMiddleware,
  requireLandlord,
  requireTenant
} from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/landlord',
  requireLandlord,
  getLandlordDashboard
);

router.get('/tenant',
  requireTenant,
  getTenantDashboard
);

router.get('/notifications',
  requireTenant,
  getNotifications
);

export default router;
