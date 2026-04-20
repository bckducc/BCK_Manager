export const User = {
  table: 'users',
  columns: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    username: 'VARCHAR(50) UNIQUE NOT NULL',
    password: 'VARCHAR(255) NOT NULL',
    role: "ENUM('landlord', 'tenant') NOT NULL",
    is_active: 'BOOLEAN DEFAULT TRUE',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  }
};

export const Landlord = {
  table: 'landlord',
  columns: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    user_id: 'INT NOT NULL UNIQUE',
    full_name: 'VARCHAR(100) NOT NULL',
    phone: 'VARCHAR(20)',
    bank_name: 'VARCHAR(100)',
    bank_account_number: 'VARCHAR(50)',
    bank_account_name: 'VARCHAR(100)',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  }
};

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
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  }
};
