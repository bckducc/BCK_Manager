import express from 'express';
import {
  getLandlordRooms,
  getAvailableRoomsList,
  getRoomDetail,
  createNewRoom,
  updateRoomInfo,
  deleteRoomInfo
} from '../controllers/roomController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes - specific before generic
router.get('/available', getAvailableRoomsList);

// Protected routes - must be before generic /:roomId
router.use(authMiddleware);

router.get('/landlord/rooms', requireRole('landlord'), getLandlordRooms);
router.post('/', requireRole('landlord'), createNewRoom);
router.put('/:roomId', requireRole('landlord'), updateRoomInfo);
router.delete('/:roomId', requireRole('landlord'), deleteRoomInfo);

// Generic route - MUST be last
router.get('/:roomId', getRoomDetail);

export default router;