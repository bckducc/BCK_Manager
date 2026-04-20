/**
 * Room Module Models
 */

export const Room = {
  table: 'rooms',
  columns: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    owner_id: 'INT NOT NULL',
    room_number: 'VARCHAR(20) NOT NULL',
    floor: 'INT',
    area: 'DECIMAL(10, 2)',
    price: 'DECIMAL(15, 2) NOT NULL',
    status: "ENUM('available', 'rented', 'maintenance') DEFAULT 'available'",
    description: 'TEXT',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  }
};
