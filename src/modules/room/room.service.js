import pool from '../../config/database.js';

export const getRoomsByLandlord = async (landlordUserId) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM rooms WHERE owner_id = ? ORDER BY room_number ASC',
      [landlordUserId]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Database error in getRoomsByLandlord:', error);
    throw error;
  }
};

export const getAvailableRooms = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT 
        r.id,
        r.owner_id,
        r.room_number,
        r.floor,
        r.area,
        r.price,
        r.status,
        r.description,
        r.created_at,
        l.full_name as owner_name,
        l.phone as owner_phone
      FROM rooms r
      LEFT JOIN landlord l ON r.owner_id = l.user_id
      WHERE r.status = 'available'
      ORDER BY r.floor ASC, r.room_number ASC`
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Database error in getAvailableRooms:', error);
    throw error;
  }
};

export const getRoomById = async (roomId) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT 
        r.id,
        r.owner_id,
        r.room_number,
        r.floor,
        r.area,
        r.price,
        r.status,
        r.description,
        r.created_at,
        l.full_name as owner_name,
        l.phone as owner_phone,
        l.bank_account_number,
        l.bank_account_name
      FROM rooms r
      LEFT JOIN landlord l ON r.owner_id = l.user_id
      WHERE r.id = ?`,
      [roomId]
    );
    connection.release();
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    console.error('Database error in getRoomById:', error);
    throw error;
  }
};

export const createRoom = async (roomData) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO rooms (owner_id, room_number, floor, area, price, status, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        roomData.owner_id,
        roomData.room_number,
        roomData.floor,
        roomData.area,
        roomData.price,
        roomData.status || 'available',
        roomData.description || null
      ]
    );
    connection.release();
    
    return {
      id: result.insertId,
      ...roomData,
      status: roomData.status || 'available'
    };
  } catch (error) {
    console.error('Database error in createRoom:', error);
    throw error;
  }
};

export const updateRoom = async (roomId, roomData) => {
  try {
    const connection = await pool.getConnection();
    
    const allowedFields = ['room_number', 'floor', 'area', 'price', 'status', 'description'];
    const updateFields = [];
    const updateValues = [];
    
    for (const field of allowedFields) {
      if (roomData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(roomData[field]);
      }
    }
    
    if (updateFields.length === 0) {
      connection.release();
      throw new Error('Không có trường nào để cập nhật');
    }
    
    updateValues.push(roomId);
    
    const query = `UPDATE rooms SET ${updateFields.join(', ')} WHERE id = ?`;
    const [result] = await connection.query(query, updateValues);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      throw new Error('Cập nhật không thành công - phòng không tồn tại');
    }
    
    return { id: roomId, ...roomData };
  } catch (error) {
    console.error('Database error in updateRoom:', error);
    throw error;
  }
};

export const deleteRoom = async (roomId) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'DELETE FROM rooms WHERE id = ?',
      [roomId]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      throw new Error('Xóa không thành công - phòng không tồn tại');
    }
    
    return { success: true, deletedRoomId: roomId };
  } catch (error) {
    console.error('Database error in deleteRoom:', error);
    throw error;
  }
};

export const getRoomCountByStatus = async (landlordUserId) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT status, COUNT(*) as count FROM rooms 
       WHERE owner_id = ? GROUP BY status`,
      [landlordUserId]
    );
    connection.release();
    
    const result = {
      total: 0,
      available: 0,
      rented: 0,
      maintenance: 0
    };
    
    for (const row of rows) {
      result[row.status] = row.count;
      result.total += row.count;
    }
    
    return result;
  } catch (error) {
    console.error('Database error in getRoomCountByStatus:', error);
    throw error;
  }
};
