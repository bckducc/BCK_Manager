import pool from '../src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function describeTable() {
  try {
    const connection = await pool.getConnection();
    const [columns] = await connection.execute('DESCRIBE users');
    connection.release();
    
    console.log('Table structure:');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

describeTable();
