/**
 * Tenant Module Models
 */

export const Tenant = {
  table: 'tenant',
  columns: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    user_id: 'INT NOT NULL UNIQUE',
    full_name: 'VARCHAR(100)',
    phone: 'VARCHAR(20)',
    identity_card: 'VARCHAR(20)',
    birthday: 'DATE',
    gender: "ENUM('M', 'F', 'Other')",
    address: 'VARCHAR(255)',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  }
};
