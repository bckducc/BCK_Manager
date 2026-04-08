import express from 'express';
import { getTenantDashboard, updateTenantProfile } from '../controllers/tenantController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { validateFields } from '../middleware/validation.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('tenant'));

router.get('/dashboard', getTenantDashboard);

router.put('/profile', 
  validateFields({
    fullName: 'required|string|max:100',
    phone: 'required|string|min:10'
  }),
  updateTenantProfile
);

export default router;
