/**
 * Service Module Models
 */

export const Service = {
  table: 'services',
  columns: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    service_name: 'VARCHAR(100) NOT NULL',
    description: 'TEXT',
    price: 'DECIMAL(15, 2) NOT NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  }
};
