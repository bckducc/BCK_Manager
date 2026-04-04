import {
  getRoomsByLandlord,
  getAvailableRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomCountByStatus
} from '../services/roomService.js';

export const getLandlordRooms = async (req, res) => {
  try {
    const landlordUserId = req.user.id;
    
    const rooms = await getRoomsByLandlord(landlordUserId);
    const stats = await getRoomCountByStatus(landlordUserId);

    return res.status(200).json({
      success: true,
      data: {
        rooms,
        stats
      }
    });
  } catch (error) {
    console.error('Get landlord rooms error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lấy danh sách phòng thất bại',
      error: error.message,
    });
  }
};

export const getAvailableRoomsList = async (req, res) => {
  try {
    const rooms = await getAvailableRooms();

    return res.status(200).json({
      success: true,
      data: {
        rooms,
        count: rooms.length
      }
    });
  } catch (error) {
    console.error('Get available rooms error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lấy danh sách phòng thất bại',
      error: error.message,
    });
  }
};

export const getRoomDetail = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'Room ID là bắt buộc',
      });
    }

    const room = await getRoomById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng',
      });
    }

    return res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Get room detail error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lấy chi tiết phòng thất bại',
      error: error.message,
    });
  }
};

export const createNewRoom = async (req, res) => {
  try {
    const landlordUserId = req.user.id;
    const { room_number, floor, area, price, status, description } = req.body;

    if (!room_number || !price) {
      return res.status(400).json({
        success: false,
        message: 'Số phòng và giá là bắt buộc',
      });
    }

    const roomData = {
      owner_id: landlordUserId,
      room_number,
      floor: floor || null,
      area: area || null,
      price,
      status: status || 'available',
      description: description || null
    };

    const newRoom = await createRoom(roomData);

    return res.status(201).json({
      success: true,
      message: 'Tạo phòng thành công',
      data: newRoom
    });
  } catch (error) {
    console.error('Create room error:', error);
    return res.status(500).json({
      success: false,
      message: 'Tạo phòng thất bại',
      error: error.message,
    });
  }
};

export const updateRoomInfo = async (req, res) => {
  try {
    const landlordUserId = req.user.id;
    const { roomId } = req.params;
    const { room_number, floor, area, price, status, description } = req.body;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'Room ID là bắt buộc',
      });
    }

    const room = await getRoomById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng',
      });
    }

    if (room.owner_id !== landlordUserId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật phòng này',
      });
    }

    const updateData = {};
    if (room_number !== undefined) updateData.room_number = room_number;
    if (floor !== undefined) updateData.floor = floor;
    if (area !== undefined) updateData.area = area;
    if (price !== undefined) updateData.price = price;
    if (status !== undefined) updateData.status = status;
    if (description !== undefined) updateData.description = description;

    const updatedRoom = await updateRoom(roomId, updateData);

    return res.status(200).json({
      success: true,
      message: 'Cập nhật phòng thành công',
      data: updatedRoom
    });
  } catch (error) {
    console.error('Update room error:', error);
    return res.status(500).json({
      success: false,
      message: 'Cập nhật phòng thất bại',
      error: error.message,
    });
  }
};

export const deleteRoomInfo = async (req, res) => {
  try {
    const landlordUserId = req.user.id;
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'Room ID là bắt buộc',
      });
    }

    const room = await getRoomById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng',
      });
    }

    if (room.owner_id !== landlordUserId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa phòng này',
      });
    }

    await deleteRoom(roomId);

    return res.status(200).json({
      success: true,
      message: 'Xóa phòng thành công'
    });
  } catch (error) {
    console.error('Delete room error:', error);
    return res.status(500).json({
      success: false,
      message: 'Xóa phòng thất bại',
      error: error.message,
    });
  }
};