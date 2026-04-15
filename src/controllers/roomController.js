import {
  getRoomsByLandlord,
  getAvailableRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomCountByStatus
} from '../services/roomService.js';
import { ApiResponse, sendResponse } from '../utils/responseHandler.js';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/customError.js';

export const getLandlordRooms = async (req, res, next) => {
  try {
    const landlordUserId = req.user.id;
    
    const rooms = await getRoomsByLandlord(landlordUserId);
    const stats = await getRoomCountByStatus(landlordUserId);

    const response = ApiResponse.success(200, {
      rooms,
      stats,
      total: rooms.length
    }, 'Lấy danh sách phòng thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[GET_LANDLORD_ROOMS] Error:', error.message);
    next(error);
  }
};

export const getAvailableRoomsList = async (req, res, next) => {
  try {
    const rooms = await getAvailableRooms();

    const response = ApiResponse.success(200, {
      rooms,
      count: rooms.length
    }, 'Lấy danh sách phòng khả dụng thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[GET_AVAILABLE_ROOMS] Error:', error.message);
    next(error);
  }
};

export const getRoomDetail = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await getRoomById(roomId);

    if (!room) {
      throw new NotFoundError('Không tìm thấy phòng');
    }

    const response = ApiResponse.success(200, room, 'Lấy chi tiết phòng thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[GET_ROOM_DETAIL] Error:', error.message);
    next(error);
  }
};

export const createNewRoom = async (req, res, next) => {
  try {
    const landlordUserId = req.user.id;
    const { roomNumber, floor, area, price, status, description } = req.body;

    const roomData = {
      owner_id: landlordUserId,
      room_number: roomNumber,
      floor: floor || null,
      area: area || null,
      price,
      status: status || 'available',
      description: description || null
    };

    const newRoom = await createRoom(roomData);

    const response = ApiResponse.success(201, newRoom, 'Tạo phòng thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[CREATE_ROOM] Error:', error.message);
    next(error);
  }
};

export const updateRoomInfo = async (req, res, next) => {
  try {
    const landlordUserId = req.user.id;
    const { roomId } = req.params;
    const { roomNumber, floor, area, price, status, description } = req.body;

    const room = await getRoomById(roomId);
    if (!room) {
      throw new NotFoundError('Không tìm thấy phòng');
    }

    if (room.owner_id !== landlordUserId) {
      throw new AuthorizationError('Bạn không có quyền cập nhật phòng này');
    }

    const updateData = {};
    if (roomNumber !== undefined) updateData.room_number = roomNumber;
    if (floor !== undefined) updateData.floor = floor;
    if (area !== undefined) updateData.area = area;
    if (price !== undefined) updateData.price = price;
    if (status !== undefined) updateData.status = status;
    if (description !== undefined) updateData.description = description;

    const updatedRoom = await updateRoom(roomId, updateData);

    const response = ApiResponse.success(200, updatedRoom, 'Cập nhật phòng thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[UPDATE_ROOM] Error:', error.message);
    next(error);
  }
};

export const deleteRoomInfo = async (req, res, next) => {
  try {
    const landlordUserId = req.user.id;
    const { roomId } = req.params;

    const room = await getRoomById(roomId);
    if (!room) {
      throw new NotFoundError('Không tìm thấy phòng');
    }

    if (room.owner_id !== landlordUserId) {
      throw new AuthorizationError('Bạn không có quyền xóa phòng này');
    }

    await deleteRoom(roomId);

    const response = ApiResponse.success(204, null, 'Xóa phòng thành công');

    return sendResponse(res, response);
  } catch (error) {
    console.error('[DELETE_ROOM] Error:', error.message);
    next(error);
  }
};