import bcrypt from 'bcryptjs';
import pool from '../src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function createTestUser() {
  try {
    const connection = await pool.getConnection();
    
    // Check if user already exists
    const [existing] = await connection.execute('SELECT id FROM users WHERE username = ?', ['admin']);
    
    if (existing.length > 0) {
      console.log('⚠ User "admin" already exists!');
      connection.release();
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('landlord123', 10);
    
    // Insert test user with correct columns
    const query = `
      INSERT INTO users (username, password, role, is_active)
      VALUES (?, ?, ?, ?)
    `;
    
    const values = [
      'admin',
      hashedPassword,
      'landlord',
      1
    ];
    
    await connection.execute(query, values);
    connection.release();
    
    console.log('✓ Test user created successfully!');
    console.log('  Username: admin');
    console.log('  Password: landlord123');
    console.log('  Role: landlord');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating user:', error.message);
    process.exit(1);
  }
}

createTestUser();
