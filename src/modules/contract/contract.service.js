/**
 * Contract Module - Service Layer
 * Handles all rental contract-related database operations
 */

import pool from '../../config/database.js';

export const getContractsByUser = async (userId, role) => {
  try {
    const connection = await pool.getConnection();
    let query, params;

    if (role === 'landlord') {
      query = `SELECT c.* FROM rental_contract c
               INNER JOIN rooms r ON c.room_id = r.id
               WHERE r.owner_id = ?
               ORDER BY c.created_at DESC`;
      params = [userId];
    } else if (role === 'tenant') {
      query = `SELECT c.* FROM rental_contract c
               INNER JOIN tenant t ON c.tenant_id = t.id
               WHERE t.user_id = ?
               ORDER BY c.created_at DESC`;
      params = [userId];
    }

    const [rows] = await connection.query(query, params);
    connection.release();
    return rows;
  } catch (error) {
    console.error('Database error in getContractsByUser:', error);
    throw error;
  }
};

export const getContractById = async (contractId) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM rental_contract WHERE id = ?',
      [contractId]
    );
    connection.release();
    return rows[0] || null;
  } catch (error) {
    console.error('Database error in getContractById:', error);
    throw error;
  }
};

export const createContract = async (contractData) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO rental_contract (room_id, tenant_id, start_date, end_date, monthly_rent, status, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        contractData.room_id,
        contractData.tenant_id,
        contractData.start_date,
        contractData.end_date,
        contractData.monthly_rent,
        contractData.status || 'active',
        contractData.description || null
      ]
    );
    connection.release();

    return {
      id: result.insertId,
      ...contractData,
      status: contractData.status || 'active'
    };
  } catch (error) {
    console.error('Database error in createContract:', error);
    throw error;
  }
};

export const updateContract = async (contractId, contractData) => {
  try {
    const connection = await pool.getConnection();
    
    const allowedFields = ['end_date', 'monthly_rent', 'status', 'description'];
    const updateFields = [];
    const updateValues = [];
    
    for (const field of allowedFields) {
      if (contractData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(contractData[field]);
      }
    }
    
    if (updateFields.length === 0) {
      connection.release();
      throw new Error('Không có trường nào để cập nhật');
    }
    
    updateValues.push(contractId);
    const query = `UPDATE rental_contract SET ${updateFields.join(', ')} WHERE id = ?`;
    const [result] = await connection.query(query, updateValues);
    connection.release();
    
    if (result.affectedRows === 0) {
      throw new Error('Cập nhật không thành công');
    }
    
    return { id: contractId, ...contractData };
  } catch (error) {
    console.error('Database error in updateContract:', error);
    throw error;
  }
};

export const deleteContract = async (contractId) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'DELETE FROM rental_contract WHERE id = ?',
      [contractId]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      throw new Error('Xóa không thành công');
    }
    
    return { success: true, deletedContractId: contractId };
  } catch (error) {
    console.error('Database error in deleteContract:', error);
    throw error;
  }
};
