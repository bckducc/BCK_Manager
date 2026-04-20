export const Bill = {
  table: 'bills',
  columns: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    room_id: 'INT NOT NULL',
    amount: 'DECIMAL(15, 2) NOT NULL',
    bill_type: "ENUM('rent', 'utilities', 'service', 'other') NOT NULL",
    due_date: 'DATE',
    status: "ENUM('pending', 'paid', 'overdue') DEFAULT 'pending'",
    description: 'TEXT',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  }
};
