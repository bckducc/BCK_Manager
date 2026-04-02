# 🚀 Quick Start Guide

## Phase 1: Setup Backend

### Step 1.1: Install Dependencies

```bash
cd bck_manager_backend
npm install
```

Expected output:
```
added XX packages in Xs
```

### Step 1.2: Verify Environment Configuration

Check `.env` file contains:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ccbck
DB_PORT=3306
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### Step 1.3: Verify Database Exists

Make sure your MySQL database is set up:
```sql
CREATE DATABASE IF NOT EXISTS ccbck;

USE ccbck;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('landlord', 'tenant', 'admin') DEFAULT 'landlord',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Landlord info table
CREATE TABLE IF NOT EXISTS landlord (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  bank_name VARCHAR(255),
  bank_account_number VARCHAR(50),
  bank_account_name VARCHAR(255),
  tax_code VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert test data
INSERT INTO users (username, password, role, is_active) VALUES
('bckduc', '123456', 'landlord', TRUE),
('tenantuser', 'password123', 'tenant', TRUE);

INSERT INTO landlord (user_id, full_name, phone, bank_name, bank_account_number, bank_account_name, tax_code) 
VALUES (1, 'Trần Anh Đức', '0121020040', 'Vietcombank', '1234567890', 'TRAN ANH DUC', '12345678');
```

### Step 1.4: Start Backend Server

```bash
npm run dev
```

Expected output:
```
✓ Database connected successfully
✓ Server running on http://localhost:5000
```

---

## Phase 2: Test Backend API

### Option A: Using Node.js Test Script (Recommended)

```bash
node test-api.js
```

This will run 6 comprehensive tests and show results.

### Option B: Using Bash/PowerShell Scripts

**Linux/macOS:**
```bash
chmod +x test-api.sh
./test-api.sh
```

**Windows (CMD):**
```cmd
test-api.bat
```

### Option C: Using Postman

1. Open Postman
2. File → Import
3. Select `BCK_Manager_API.postman_collection.json`
4. Run requests in sequence:
   - Login (saves token automatically)
   - Get User Info
   - Logout

### Option D: Manual Testing with cURL

```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"bckduc","password":"123456"}'

# Copy token from response, then test get user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Phase 3: Integrate Frontend with Backend

### Step 3.1: Update Login.tsx

Update [src/pages/Login.tsx](../src/pages/Login.tsx) to remove mock and call backend:

```tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Save token and redirect
      localStorage.setItem('authToken', data.token);
      login(data.user); // or: navigate to dashboard
    } else {
      setError(data.message || 'Đăng nhập thất bại');
    }
  } catch (error) {
    setError('Lỗi kết nối server');
  }
};
```

### Step 3.2: Update AuthContext.tsx

Update [src/stores/AuthContext.tsx](../src/stores/AuthContext.tsx) to use backend:

```tsx
const login = async (username: string, password: string) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    const data = await response.json();
    if (data.success) {
      setUser(data.user);
      return data.user;
    }
    
    // Token invalid, clear it
    logout();
  } catch (error) {
    console.error('Get user error:', error);
  }
};
```

### Step 3.3: Add API Configuration File (Optional)

Create [src/services/api.ts](../src/services/api.ts):

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  return response.json();
};

// Auth endpoints
export const authApi = {
  login: (username: string, password: string) =>
    apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  getMe: () => apiCall('/api/auth/me'),
  
  logout: () => apiCall('/api/auth/logout', { method: 'POST' }),
};
```

### Step 3.4: Update .env.local (Optional)

Create `bck_manager/.env.local`:
```env
VITE_API_URL=http://localhost:5000
```

---

## Phase 4: Test Frontend-Backend Integration

### Step 4.1: Start Both Servers

**Terminal 1 (Backend):**
```bash
cd bck_manager_backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd bck_manager
npm run dev
```

### Step 4.2: Test Login

1. Open http://localhost:5173
2. Navigate to login page
3. Enter: username: `bckduc`, password: `123456`
4. Should login and redirect to dashboard
5. Check Browser DevTools → Storage → localStorage for token

### Step 4.3: Verify API Calls

In Browser Console:
```javascript
// Test that token is stored
console.log(localStorage.getItem('token'));

// Test API call with token
fetch('http://localhost:5000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
}).then(r => r.json()).then(console.log);
```

---

## 📋 Checklist

### Backend Setup ✓
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Database created with tables
- [ ] Server starts without errors (`npm run dev`)
- [ ] Health check works (`http://localhost:5000/health`)

### API Testing ✓
- [ ] Login endpoint works (returns token)
- [ ] Get user endpoint works with token
- [ ] Invalid credentials rejected
- [ ] Invalid token rejected
- [ ] All tests pass (`node test-api.js`)

### Frontend Integration ✓
- [ ] Login.tsx updated to call backend
- [ ] AuthContext.tsx uses real API
- [ ] Frontend builds successfully
- [ ] Login redirects to dashboard
- [ ] Token stored in localStorage
- [ ] Dashboard loads user info from backend

---

## 🐛 Troubleshooting

### "Cannot connect to server"
```
Error: ECONNREFUSED at localhost:5000
```
**Solution:** Make sure backend is running:
```bash
npm run dev
```

### "Database connection failed"
```
Error: getaddrinfo ENOTFOUND localhost
Error: Access denied for user 'root'@'localhost'
```
**Solution:** Check `.env` file and verify MySQL is running:
```bash
# On Windows
net start MySQL80

# On macOS
brew services start mysql
```

### "Invalid or expired token"
**Solution:** Token is invalid or expired. Login again to get a new token.

### CORS errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Check that frontend URL matches CORS_ORIGIN in `.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

### "Wrong password" even with correct credentials
**Solution:** Check database password field. If using plain text (not hashed password), ensure exact match in database:
```sql
SELECT username, password FROM users WHERE username = 'bckduc';
```

---

## 📚 Documentation Files

- **[README.md](./README.md)** - Comprehensive API documentation
- **[TESTING.md](./TESTING.md)** - Detailed test cases and examples
- **[.env](./.env)** - Environment variables
- **[Package.json](./package.json)** - Dependencies

---

## 🎯 Next Steps After Integration

1. ✅ Backend login/auth working
2. ✅ Frontend using real API
3. ⏳ Add more endpoints:
   - Rooms API (GET, POST, PUT, DELETE)
   - Tenants API (use backend instead of context)
   - Bills/Payments API
   - Landlord profile API

---

**Last Updated:** April 2, 2024
**Status:** ✅ Backend Complete, 🔄 Frontend Integration Ready
