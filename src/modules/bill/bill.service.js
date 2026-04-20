import pool from '../../config/database.js';

export const getBillsByUser = async (userId, role) => {
  try {
    const connection = await pool.getConnection();
    let query, params;

    if (role === 'landlord') {
      query = `SELECT b.* FROM bills b
               INNER JOIN rooms r ON b.room_id = r.id
               WHERE r.owner_id = ?
               ORDER BY b.created_at DESC`;
      params = [userId];
    } else if (role === 'tenant') {
      query = `SELECT b.* FROM bills b
               INNER JOIN rental_contract rc ON b.room_id = rc.room_id
               WHERE rc.tenant_id = ?
               ORDER BY b.created_at DESC`;
      params = [userId];
    }

    const [rows] = await connection.query(query, params);
    connection.release();
    return rows;
  } catch (error) {
    console.error('Database error in getBillsByUser:', error);
    throw error;
  }
};

export const getBillById = async (billId) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM bills WHERE id = ?',
      [billId]
    );
    connection.release();
    return rows[0] || null;
  } catch (error) {
    console.error('Database error in getBillById:', error);
    throw error;
  }
};

export const createBill = async (billData) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO bills (room_id, amount, bill_type, due_date, status, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        billData.room_id,
        billData.amount,
        billData.bill_type,
        billData.due_date,
        billData.status || 'pending',
        billData.description || null
      ]
    );
    connection.release();

    return {
      id: result.insertId,
      ...billData,
      status: billData.status || 'pending'
    };
  } catch (error) {
    console.error('Database error in createBill:', error);
    throw error;
  }
};

export const updateBill = async (billId, billData) => {
  try {
    const connection = await pool.getConnection();
    
    const allowedFields = ['amount', 'status', 'due_date', 'description'];
    const updateFields = [];
    const updateValues = [];
    
    for (const field of allowedFields) {
      if (billData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(billData[field]);
      }
    }
    
    if (updateFields.length === 0) {
      connection.release();
      throw new Error('Không có trường nào để cập nhật');
    }
    
    updateValues.push(billId);
    const query = `UPDATE bills SET ${updateFields.join(', ')} WHERE id = ?`;
    const [result] = await connection.query(query, updateValues);
    connection.release();
    
    if (result.affectedRows === 0) {
      throw new Error('Cập nhật không thành công');
    }
    
    return { id: billId, ...billData };
  } catch (error) {
    console.error('Database error in updateBill:', error);
    throw error;
  }
};

export const deleteBill = async (billId) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'DELETE FROM bills WHERE id = ?',
      [billId]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      throw new Error('Xóa không thành công');
    }
    
    return { success: true, deletedBillId: billId };
  } catch (error) {
    console.error('Database error in deleteBill:', error);
    throw error;
  }
};
