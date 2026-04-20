/**
 * Contract Module Models
 */

export const RentalContract = {
  table: 'rental_contract',
  columns: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    room_id: 'INT NOT NULL',
    tenant_id: 'INT NOT NULL',
    start_date: 'DATE NOT NULL',
    end_date: 'DATE',
    monthly_rent: 'DECIMAL(15, 2) NOT NULL',
    status: "ENUM('active', 'terminated', 'expired') DEFAULT 'active'",
    description: 'TEXT',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  }
};
