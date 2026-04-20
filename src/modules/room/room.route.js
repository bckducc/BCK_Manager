import express from 'express';
import {
  getLandlordRooms,
  getAvailableRoomsList,
  getRoomDetail,
  createNewRoom,
  updateRoomInfo,
  deleteRoomInfo
} from './room.controller.js';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import { validateId, validateFields } from '../../middleware/validation.js';

const router = express.Router();

router.get('/available', getAvailableRoomsList);

router.use(authMiddleware);

router.get('/landlord/rooms', requireRole('landlord'), getLandlordRooms);

router.post('/', 
  requireRole('landlord'),
  validateFields({
    roomNumber: 'required|string',
    floor: 'required|number',
    area: 'required|number',
    price: 'required|number'
  }),
  createNewRoom
);

router.get('/:roomId', validateId('roomId'), getRoomDetail);

router.put('/:roomId', 
  requireRole('landlord'),
  validateId('roomId'),
  updateRoomInfo
);

router.delete('/:roomId', 
  requireRole('landlord'),
  validateId('roomId'),
  deleteRoomInfo
);

export default router;
