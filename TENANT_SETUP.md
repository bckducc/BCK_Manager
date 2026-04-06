# Tenant Authorization Setup Guide

## 📋 Overview

This guide explains how to set up and test tenant authentication and authorization in the BCK Manager system.

## 🔄 Authentication Flow

```
1. Tenant enters credentials on /login page
   ↓
2. POST /api/auth/login (username, password)
   ↓
3. Backend validates and returns:
   - JWT token
   - User object with role='tenant'
   ↓
4. Frontend AuthContext:
   - Maps backend 'tenant' role
   - Saves user + token to state & localStorage
   - login() function returns User object
   ↓
5. Login.tsx receives user object
   - Checks user.role === 'tenant'
   - Redirects to /tenant (Tenant Dashboard)
   ↓
6. ProtectedRoute component:
   - Checks user.role === 'tenant' ✓
   - Allows access to tenant pages
```

## 🗄️ Database Setup

### Step 1: Create Tenant User Account

Run this SQL to create a test tenant account:

```sql
-- Create tenant user in users table
INSERT INTO users (username, password, role, is_active) 
VALUES ('tenant01', '123456', 'tenant', TRUE);

-- Get the user ID (should be 2 or higher if there's already a landlord user)
-- Let's assume it's inserted with id=2

-- Create tenant profile in tenant table
INSERT INTO tenant (
    user_id,
    full_name,
    phone,
    identity_card,
    birthday,
    gender,
    address
) VALUES (
    2,
    'Trần Anh Đạt',
    '0121020041',
    '035204009999',
    '2004-10-11',
    'male',
    'Hà Nam'
);
```

### Step 2: Verify in Database

```sql
-- Check users table
SELECT * FROM users WHERE role = 'tenant';

-- Check tenant table
SELECT * FROM tenant;
```

## 🧪 Testing Tenant Login

### Option 1: Using Frontend UI

1. Start backend: `npm run dev` (port 5000)
2. Start frontend: `npm run dev` (port 5173)
3. Navigate to http://localhost:5173/login
4. Enter credentials:
   - Username: `tenant01`
   - Password: `123456`
5. Expected result: Redirected to `/tenant` (Tenant Dashboard)

### Option 2: Using cURL

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"tenant01","password":"123456"}'

# Response should include:
# "role": "tenant"
# "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Copy the token and test tenant dashboard endpoint
curl -X GET http://localhost:5000/api/tenant/dashboard \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>"

# Should return tenant profile and dashboard info
```

### Option 3: Using Postman

1. Import `BCK_Manager_API.postman_collection.json`
2. Set environment variables:
   - base_url: http://localhost:5000
3. Run request: `Auth > Login` with:
   ```json
   {
     "username": "tenant01",
     "password": "123456"
   }
   ```
4. Copy `token` from response
5. Set Postman variable: `{{token}}` = copied token
6. Run request: `Tenant > Get Dashboard`

## ✅ Verification Checklist

### Backend (Node.js)

- [ ] PostgreSQL/MySQL has tenant user with role='tenant'
- [ ] POST /api/auth/login returns role='tenant' in response
- [ ] JWT token includes role claim
- [ ] GET /api/auth/me returns role='tenant'
- [ ] GET /api/tenant/dashboard returns tenant profile

### Frontend (React)

- [ ] AuthContext maps role 'tenant' correctly
- [ ] Login.tsx redirects to /tenant after tenant login
- [ ] ProtectedRoute allows access to /tenant/* routes
- [ ] Owner routes (/owner/*) are blocked for tenant users

## 📦 Key Files Modified

### Backend
- `src/controllers/authController.js` - Returns user role in login response
- `src/middleware/auth.js` - JWT includes role
- `src/services/authService.js` - User fetching logic

### Frontend
- `src/stores/AuthContext.tsx` - Maps backend role, returns User from login()
- `src/pages/Login.tsx` - Redirects based on role
- `src/types/user.ts` - AuthContextType.login returns Promise<User>
- `src/utils/ProtectedRoute.tsx` - Role-based access control (already implemented)
- `src/App.tsx` - Tenant routes with requiredRole="tenant"

## 🔐 Security Notes

1. **Password Storage**: Currently stored as plain text. For production:
   - Implement bcryptjs password hashing
   - Set bcrypt salt rounds to 10+

2. **JWT Token**: 
   - Currently 7-day expiry (see NFR-005)
   - Token stored in localStorage (vulnerable to XSS)
   - Consider using httpOnly cookies for better security

3. **Role-Based Access**:
   - Frontend checks role in ProtectedRoute
   - Backend should also validate role in protected endpoints
   - Never trust frontend-only role checks

## 🚀 Next Steps

1. ✅ Create tenant test account
2. ✅ Test login flow
3. [ ] Create API endpoint to programmatically create tenant accounts (admin role)
4. [ ] Add password hashing (bcryptjs)
5. [ ] Add role-based middleware to all endpoints
6. [ ] Add audit logging for access attempts
7. [ ] Implement refresh token rotation

## 📞 Troubleshooting

### Issue: "Thông tin người thuê không tìm thấy" (Tenant info not found)

**Cause**: User with role='tenant' exists but no tenant profile in tenant table

**Solution**: 
```sql
-- Check if tenant profile exists
SELECT * FROM tenant WHERE user_id = <USER_ID>;

-- If not, insert one
INSERT INTO tenant (user_id, full_name, phone) 
VALUES (<USER_ID>, 'Tenant Name', '0123456789');
```

### Issue: Redirects to / instead of /tenant after login

**Cause**: ProtectedRoute role check failing

**Debug**:
1. Open browser DevTools Console
2. Check localStorage: `JSON.parse(localStorage.getItem('user')).role`
3. Verify role is 'tenant' (not 'landlord' or 'owner')
4. Check API response from /login endpoint

### Issue: Tenant dashboard shows owner data

**Cause**: Frontend still using mock data

**Solution**:
1. Ensure TenantDashboard.tsx uses real API data (not hardcoded)
2. Update useEffect to call tenant API endpoints
3. See `/api/tenant/dashboard` endpoint documentation

## 📚 Related Documentation

- Backend README: `README.md`
- API Testing: `TESTING.md`
- Authorization: `ACL_SETUP.md`
