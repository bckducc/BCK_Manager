# API Testing Guide

## 🧪 Test Login Endpoint

### Test Data
```
Username: bckduc
Password: 123456
```

### Test 1: Login Success

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bckduc",
    "password": "123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJiY2tkdWMiLCJyb2xlIjoibGFuZGxvcmQiLCJpYXQiOjE3MTIwODk2MzIsImV4cCI6MTcxMjY5NDQzMn0.abcdefg...",
  "user": {
    "id": 1,
    "username": "bckduc",
    "role": "landlord",
    "name": "Trần Anh Đức",
    "email": "bckduc@landlord.local",
    "phone": "0121020040",
    "address": null,
    "idNumber": null,
    "gender": null,
    "createdAt": "2024-04-02T10:00:00.000Z"
  }
}
```

---

### Test 2: Login with Invalid Password

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bckduc",
    "password": "wrongpassword"
  }'
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

---

### Test 3: Login with Non-existent User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nonexistent",
    "password": "123456"
  }'
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

---

### Test 4: Get User Info with Valid Token

```bash
# First, login to get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"bckduc","password":"123456"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Then use token to get user info
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "bckduc",
    "role": "landlord",
    "name": "Trần Anh Đức",
    "email": "bckduc@landlord.local",
    "phone": "0121020040",
    "address": null,
    "idNumber": null,
    "gender": null,
    "createdAt": "2024-04-02T10:00:00.000Z"
  }
}
```

---

### Test 5: Get User Info with Invalid Token

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## 📊 Quick Reference

| Test | Method | Endpoint | Status |
|------|--------|----------|--------|
| Login (valid) | POST | /api/auth/login | 200 ✓ |
| Login (invalid) | POST | /api/auth/login | 401 ✗ |
| Get user info | GET | /api/auth/me | 200 ✓ |
| No token | GET | /api/auth/me | 401 ✗ |
| Invalid token | GET | /api/auth/me | 401 ✗ |

---

## 🛠️ Postman Setup (Optional)

1. Create new Environment:
   - base_url: http://localhost:5000

2. Create requests:
   - **Login**: POST {{base_url}}/api/auth/login
   - **Me**: GET {{base_url}}/api/auth/me

3. In Login response, add script to save token:
```javascript
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("token", jsonData.token);
}
```

4. In Me request, use Authorization:
   - Type: Bearer Token
   - Token: {{token}}

---

## 🔍 Debugging

### Check Server Health
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-04-02T10:00:00.000Z"
}
```

### View Server Logs
```bash
npm run dev
# or
npm start
```

Look for:
```
✓ Database connected successfully
✓ Server running on http://localhost:5000
```

---

**Last Updated:** April 2, 2026
