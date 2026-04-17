import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  assignServiceToRoom,
  removeServiceFromRoom
} from '../controllers/serviceController.js';
import {
  authMiddleware,
  requireLandlord
} from '../middleware/auth.js';
import { validateFields, validateId } from '../middleware/validation.js';

const router = express.Router();

// Middleware authentication (bắt buộc cho tất cả)
router.use(authMiddleware);

// Middleware authorization (chỉ cho chủ nhà)
router.use(requireLandlord);

/**
 * GET /api/v1/services
 * Danh sách tất cả dịch vụ
 * Quyền: LANDLORD
 */
router.get('/',
  getAllServices
);

/**
 * POST /api/v1/services
 * Tạo dịch vụ mới
 * Quyền: LANDLORD
 */
router.post('/',
  validateFields({
    name: 'required|string|max:100',
    description: 'string',
    price: 'required|number',
    unit: 'required|string'
  }),
  createService
);

/**
 * GET /api/v1/services/:id
 * Chi tiết dịch vụ
 * Quyền: LANDLORD
 */
router.get('/:id',
  validateId('id'),
  getServiceById
);

/**
 * PUT /api/v1/services/:id
 * Cập nhật dịch vụ
 * Quyền: LANDLORD
 */
router.put('/:id',
  validateId('id'),
  validateFields({
    name: 'string|max:100',
    description: 'string',
    price: 'number',
    unit: 'string'
  }),
  updateService
);

/**
 * DELETE /api/v1/services/:id
 * Xóa dịch vụ
 * Quyền: LANDLORD
 */
router.delete('/:id',
  validateId('id'),
  deleteService
);

/**
 * POST /api/v1/rooms/:roomId/services
 * Gán dịch vụ vào phòng
 * Quyền: LANDLORD
 */
router.post('/rooms/:roomId/services',
  validateId('roomId'),
  validateFields({
    serviceId: 'required|string',
    customPrice: 'number'
  }),
  assignServiceToRoom
);

/**
 * DELETE /api/v1/rooms/:roomId/services/:serviceId
 * Xóa dịch vụ khỏi phòng
 * Quyền: LANDLORD
 */
router.delete('/rooms/:roomId/services/:serviceId',
  validateId('roomId'),
  validateId('serviceId'),
  removeServiceFromRoom
);

export default router;
