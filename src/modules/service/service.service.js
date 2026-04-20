/**
 * Service Module - Service Layer
 * Handles all service-related database operations (e.g., maintenance services, utilities)
 */

import pool from '../../config/database.js';

export const getServices = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM services');
    connection.release();
    return rows;
  } catch (error) {
    console.error('Database error in getServices:', error);
    throw error;
  }
};

export const getServiceById = async (serviceId) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM services WHERE id = ?',
      [serviceId]
    );
    connection.release();
    return rows[0] || null;
  } catch (error) {
    console.error('Database error in getServiceById:', error);
    throw error;
  }
};

export const createService = async (serviceData) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO services (service_name, description, price)
       VALUES (?, ?, ?)`,
      [
        serviceData.service_name,
        serviceData.description || null,
        serviceData.price
      ]
    );
    connection.release();

    return {
      id: result.insertId,
      ...serviceData
    };
  } catch (error) {
    console.error('Database error in createService:', error);
    throw error;
  }
};

export const updateService = async (serviceId, serviceData) => {
  try {
    const connection = await pool.getConnection();
    
    const allowedFields = ['service_name', 'description', 'price'];
    const updateFields = [];
    const updateValues = [];
    
    for (const field of allowedFields) {
      if (serviceData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(serviceData[field]);
      }
    }
    
    if (updateFields.length === 0) {
      connection.release();
      throw new Error('Không có trường nào để cập nhật');
    }
    
    updateValues.push(serviceId);
    const query = `UPDATE services SET ${updateFields.join(', ')} WHERE id = ?`;
    const [result] = await connection.query(query, updateValues);
    connection.release();
    
    if (result.affectedRows === 0) {
      throw new Error('Cập nhật không thành công');
    }
    
    return { id: serviceId, ...serviceData };
  } catch (error) {
    console.error('Database error in updateService:', error);
    throw error;
  }
};

export const deleteService = async (serviceId) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'DELETE FROM services WHERE id = ?',
      [serviceId]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      throw new Error('Xóa không thành công');
    }
    
    return { success: true, deletedServiceId: serviceId };
  } catch (error) {
    console.error('Database error in deleteService:', error);
    throw error;
  }
};
