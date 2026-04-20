import pool from '../src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function listTables() {
  try {
    const connection = await pool.getConnection();
    const [tables] = await connection.execute('SHOW TABLES');
    connection.release();
    
    console.log('Database tables:');
    if (tables.length === 0) {
      console.log('  No tables found!');
    } else {
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`  - ${tableName}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

listTables();
