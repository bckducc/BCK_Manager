import pool from '../../config/database.js';

export const getTenantByUserId = async (userId) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM tenant WHERE user_id = ?`,
      [userId]
    );
    connection.release();
    return rows[0] || null;
  } catch (error) {
    console.error('Database error in getTenantByUserId:', error);
    throw error;
  }
};

export const updateTenantProfile = async (userId, profileData) => {
  try {
    const connection = await pool.getConnection();
    
    const allowedFields = ['full_name', 'phone', 'identity_card', 'birthday', 'gender', 'address'];
    const updateFields = [];
    const updateValues = [];
    
    for (const field of allowedFields) {
      const snakeField = field;
      if (profileData[field] !== undefined || profileData[field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, (match, offset) => offset > 0 ? match.toUpperCase() : '')] !== undefined) {
        const value = profileData[field] || profileData[field.charAt(0).toUpperCase() + field.slice(1)];
        if (value !== undefined) {
          updateFields.push(`${snakeField} = ?`);
          updateValues.push(value);
        }
      }
    }
    
    if (updateFields.length === 0) {
      connection.release();
      return null;
    }
    
    updateValues.push(userId);
    
    const query = `UPDATE tenant SET ${updateFields.join(', ')} WHERE user_id = ?`;
    const [result] = await connection.query(query, updateValues);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      throw new Error('Cập nhật không thành công - người thuê không tồn tại');
    }
    
    return { user_id: userId, ...profileData };
  } catch (error) {
    console.error('Database error in updateTenantProfile:', error);
    throw error;
  }
};

export const getTenantRooms = async (tenantId) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT r.* FROM rooms r
       INNER JOIN rental_contract rc ON r.id = rc.room_id
       WHERE rc.tenant_id = ? AND rc.status = 'active'`,
      [tenantId]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Database error in getTenantRooms:', error);
    throw error;
  }
};
