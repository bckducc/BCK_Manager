# BCK Manager Backend

Backend API cho hệ thống quản lý chung cư mini. Xây dựng với Node.js + Express + MySQL.

## 📋 Cài Đặt

### 1. Prerequisites
- Node.js v16+
- MySQL 5.7+
- npm hoặc yarn

### 2. Cài Đặt Dependencies

```bash
npm install
```

### 3. Cấu Hình Database

Chạy SQL script để tạo database và tables:

```sql
use ccbck;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('landlord','tenant','admin') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, role)
VALUES ('bckduc', '123456', 'landlord');

CREATE TABLE landlord (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(10),
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(50),
    bank_account_name VARCHAR(100),
    tax_code VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO landlord (
    user_id,
    full_name,
    phone,
    bank_name,
    bank_account_number,
    bank_account_name
)
VALUES (
    1,
    'Trần Anh Đức',
    '0121020040',
    'MB Bank',
    '0121020040',
    'Trần Anh Đức'
);
```

### 4. Cấu Hình Environment

Tạo file `.env` (đã có mẫu):

### 5. Chạy Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

---

## 🔒 API Endpoints

### Authentication (`/api/auth`)

#### 1. Login
**POST** `/api/auth/login`

Đăng nhập với username và password.

**Request:**
```json
{
  "username": "bckduc",
  "password": "123456"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"bckduc","password":"123456"}'
```

---

#### 2. Get Current User Info
**GET** `/api/auth/me`

Lấy thông tin user hiện tại (yêu cầu token).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
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
    "createdAt": "2024-04-02T10:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 3. Logout
**POST** `/api/auth/logout`

Logout user (xóa token ở client side).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Tenant Dashboard (`/api/tenant`)

#### 1. Get Tenant Dashboard
**GET** `/api/tenant/dashboard`

Lấy dữ liệu dashboard riêng cho người thuê (yêu cầu token + role=tenant).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": 2,
      "username": "bck01",
      "full_name": "Trần Anh Đạt",
      "phone": "0121020041",
      "identity_card": "035204009999",
      "birthday": "2004-10-11",
      "gender": "male",
      "address": "Hà Nam",
      "created_at": "2026-04-03T02:28:04.000Z"
    },
    "dashboard": {
      "role": "tenant",
      "status": "active",
      "message": "Chào mừng bạn quay trở lại!"
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/tenant/dashboard \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### 2. Update Tenant Profile
**PUT** `/api/tenant/profile`

Cập nhật thông tin profile của người thuê.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "full_name": "Trần Anh Đạt",
  "phone": "0987654321",
  "identity_card": "035204009999",
  "birthday": "2004-10-12",
  "gender": "male",
  "address": "Hà Nam, Việt Nam"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cập nhật thông tin thành công",
  "data": {
    "id": 2,
    "full_name": "Trần Anh Đạt",
    "phone": "0987654321",
    "identity_card": "035204009999",
    "birthday": "2004-10-12",
    "gender": "male",
    "address": "Hà Nam, Việt Nam"
  }
}
```

---

### Rooms Management (`/api/rooms`)

#### 1. Get All Available Rooms (Public)
**GET** `/api/rooms/available`

Lấy danh sách tất cả các phòng khả dụng (không yêu cầu token).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "rooms": [
      {
        "id": 1,
        "owner_id": 1,
        "room_number": "102",
        "floor": 1,
        "area": 30,
        "price": 2500000,
        "status": "available",
        "description": "Phòng tầng 1, không có ban công",
        "created_at": "2026-04-04T02:30:00.000Z",
        "owner_name": "Trần Anh Đức",
        "owner_phone": "0121020040"
      }
    ],
    "count": 1
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/rooms/available
```

---

#### 2. Get Room Details by ID (Public)
**GET** `/api/rooms/:roomId`

Lấy chi tiết một phòng theo ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "owner_id": 1,
    "room_number": "102",
    "floor": 1,
    "area": 30,
    "price": 2500000,
    "status": "available",
    "description": "Phòng tầng 1, không có ban công",
    "created_at": "2026-04-04T02:30:00.000Z",
    "owner_name": "Trần Anh Đức",
    "owner_phone": "0121020040",
    "bank_account_number": "0121020040",
    "bank_account_name": "Trần Anh Đức"
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/rooms/1
```

---

#### 3. Get Landlord's Rooms
**GET** `/api/rooms/landlord/rooms`

Lấy danh sách tất cả phòng của chủ nhà (yêu cầu token + role=landlord).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "rooms": [
      {
        "id": 1,
        "owner_id": 1,
        "room_number": "102",
        "floor": 1,
        "area": 30,
        "price": 2500000,
        "status": "available",
        "description": "Phòng tầng 1, không có ban công",
        "created_at": "2026-04-04T02:30:00.000Z"
      },
      {
        "id": 2,
        "owner_id": 1,
        "room_number": "201",
        "floor": 2,
        "area": 25.5,
        "price": 2500000,
        "status": "available",
        "description": "Phòng tầng 2, có ban công",
        "created_at": "2026-04-04T02:31:00.000Z"
      }
    ],
    "stats": {
      "total": 2,
      "available": 2,
      "rented": 0,
      "maintenance": 0
    }
  }
}
```

---

#### 4. Create New Room (Landlord only)
**POST** `/api/rooms`

Tạo phòng mới (chỉ chủ nhà).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "room_number": "102",
  "floor": 1,
  "area": 30,
  "price": 2500000,
  "status": "available",
  "description": "Phòng tầng 1, không có ban công"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Tạo phòng thành công",
  "data": {
    "id": 1,
    "owner_id": 1,
    "room_number": "102",
    "floor": 1,
    "area": 30,
    "price": 2500000,
    "status": "available",
    "description": "Phòng tầng 1, không có ban công"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/rooms \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "room_number": "102",
    "floor": 1,
    "area": 30,
    "price": 2500000,
    "description": "Phòng tầng 1"
  }'
```

---

#### 5. Update Room (Landlord only)
**PUT** `/api/rooms/:roomId`

Cập nhật thông tin phòng.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "room_number": "102",
  "floor": 1,
  "area": 30,
  "price": 2500000,
  "status": "rented",
  "description": "Phòng tầng 1, đã cho thuê"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cập nhật phòng thành công",
  "data": {
    "id": 1,
    "room_number": "102",
    "floor": 1,
    "area": 30,
    "price": 2500000,
    "status": "rented",
    "description": "Phòng tầng 1, đã cho thuê"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/rooms/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "rented"}'
```

---

#### 6. Delete Room (Landlord only)
**DELETE** `/api/rooms/:roomId`

Xóa một phòng.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Xóa phòng thành công"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/rooms/1 \
  -H "Authorization: Bearer <token>"
```

---

## 🔐 Authentication Flow

1. **Login**: Client gửi username + password → Server trả về JWT token
2. **Store Token**: Client lưu token vào localStorage
3. **Use Token**: Client gửi token trong header `Authorization: Bearer <token>` cho mỗi request
4. **Verify**: Server verify token - nếu valid, xử lý request; nếu invalid, trả về 401
5. **Logout**: Client xóa token từ localStorage

---

## 📝 Error Codes

| Code | Message | Ý Nghĩa |
|------|---------|---------|
| 200 | OK | Request thành công |
| 400 | Bad Request | Tham số không hợp lệ |
| 401 | Unauthorized | Không xác thực hoặc token không hợp lệ |
| 403 | Forbidden | Quyền hạn không đủ |
| 404 | Not Found | Resource không tìm thấy |
| 500 | Server Error | Lỗi server |

---

## 🔒 Security Notes

⚠️ **TODO - Production Changes:**
1. Hash passwords trong database (sử dụng bcrypt)
2. Đổi JWT_SECRET thành strong secret
3. Thêm rate limiting
4. Thêm input validation/sanitization
5. Thêm HTTPS
6. Thêm database encryption
7. Thêm audit logging

---

## 📁 Project Structure

```
bck_manager_backend/
├── src/
│   ├── config/
│   │   └── database.js          # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── tenantController.js  # Tenant dashboard logic
│   │   └── roomController.js    # Room management logic
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── tenant.js            # Tenant routes
│   │   └── rooms.js             # Room management routes
│   ├── services/
│   │   ├── authService.js       # Auth database queries
│   │   └── roomService.js       # Room database queries
│   └── server.js                # Express app
├── .env                         # Environment variables
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 🧪 Testing with Postman

### **1️⃣ Tải Postman**
- Tải từ: https://www.postman.com/downloads/
- Cài đặt hoặc dùng Web version

### **2️⃣ Tenant Login Test**

**Bước 1**: Tạo request mới
- Bấm **+** → New Request
- Hoặc `Ctrl+N`

**Bước 2**: Cấu hình request
- **Method**: Chọn **POST** (dropdown)
- **URL**: `http://localhost:5000/api/auth/login`

**Bước 3**: Thêm dữ liệu
- Tab **Body** → Chọn **raw** → **JSON** (dropdown phải)
- Nhập:
```json
{
  "username": "bck01",
  "password": "123456"
}
```

**Bước 4**: Gửi request
- Bấm **Send** (nút xanh)

**Kết quả nhận được:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "bck01",
    "role": "tenant",
    "name": "Trần Anh Đạt",
    "phone": "0121020041",
    "gender": "male",
    "address": "Hà Nam"
  }
}
```

**⚠️ Lưu token cho bước tiếp theo** (copy đoạn token dài)

---

### **3️⃣ Get Tenant Dashboard**

**Bước 1**: Tạo request mới
- **Method**: **GET**
- **URL**: `http://localhost:5000/api/tenant/dashboard`

**Bước 2**: Thêm Authorization header
- Tab **Headers** → Thêm:
  - **Key**: `Authorization`
  - **Value**: `Bearer <paste_token_here>`
  
  Ví dụ:
  ```
  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

**Bước 3**: Gửi request
- Bấm **Send**

**Kết quả:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": 2,
      "username": "bck01",
      "full_name": "Trần Anh Đạt",
      "phone": "0121020041",
      "identity_card": "035204009999",
      "birthday": "2004-10-11",
      "gender": "male",
      "address": "Hà Nam",
      "created_at": "2026-04-03T02:28:04.000Z"
    },
    "dashboard": {
      "role": "tenant",
      "status": "active",
      "message": "Chào mừng bạn quay trở lại!"
    }
  }
}
```

---

### **4️⃣ Get Current User Info**

**Bước 1**: Tạo request mới
- **Method**: **GET**
- **URL**: `http://localhost:5000/api/auth/me`

**Bước 2**: Thêm Authorization header
- Tab **Headers**:
  - **Key**: `Authorization`
  - **Value**: `Bearer <token_của_bạn>`

**Bước 3**: Gửi request
- Bấm **Send**

---

### **5️⃣ Landlord Login (Optional)**

**Bước 1**: Tạo request mới
- **Method**: **POST**
- **URL**: `http://localhost:5000/api/auth/login`

**Bước 2**: Body (raw JSON)
```json
{
  "username": "bckduc",
  "password": "123456"
}
```

**Bước 3**: Gửi request

**Kết quả:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "...",
  "user": {
    "id": 1,
    "username": "bckduc",
    "role": "landlord",
    "name": "Trần Anh Đức",
    "phone": "0121020040"
  }
}
```

---

### **6️⃣ Get Available Rooms (Public)**

**Bước 1**: Tạo request mới
- **Method**: **GET**
- **URL**: `http://localhost:5000/api/rooms/available`

**Bước 2**: Gửi request (không cần token)
- Bấm **Send**

**Kết quả:**
```json
{
  "success": true,
  "data": {
    "rooms": [
      {
        "id": 1,
        "room_number": "102",
        "floor": 1,
        "area": 30,
        "price": 2500000,
        "status": "available",
        "owner_name": "Trần Anh Đức",
        "owner_phone": "0121020040"
      }
    ],
    "count": 1
  }
}
```

---

### **7️⃣ Landlord: Get My Rooms**

**Bước 1**: Tạo request mới
- **Method**: **GET**
- **URL**: `http://localhost:5000/api/rooms/landlord/rooms`

**Bước 2**: Thêm Authorization header
- Đăng nhập landlord trước (bckduc) để lấy token
- Tab **Headers**:
  - **Key**: `Authorization`
  - **Value**: `Bearer <landlord_token>`

**Bước 3**: Gửi request
- Bấm **Send**

**Kết quả:**
```json
{
  "success": true,
  "data": {
    "rooms": [
      {
        "id": 1,
        "room_number": "102",
        "floor": 1,
        "area": 30,
        "price": 2500000,
        "status": "available"
      },
      {
        "id": 2,
        "room_number": "201",
        "floor": 2,
        "area": 25.5,
        "price": 2500000,
        "status": "available"
      }
    ],
    "stats": {
      "total": 2,
      "available": 2,
      "rented": 0,
      "maintenance": 0
    }
  }
}
```

---

### **8️⃣ Landlord: Create New Room**

**Bước 1**: Tạo request mới
- **Method**: **POST**
- **URL**: `http://localhost:5000/api/rooms`

**Bước 2**: Thêm Authorization header
- **Key**: `Authorization`
- **Value**: `Bearer <landlord_token>`

**Bước 3**: Thêm dữ liệu
- Tab **Body** → **raw** → **JSON**
- Nhập:
```json
{
  "room_number": "302",
  "floor": 3,
  "area": 35,
  "price": 3000000,
  "status": "available",
  "description": "Phòng tầng 3, diện tích lớn, có ban công"
}
```

**Bước 4**: Gửi request
- Bấm **Send**

**Kết quả:**
```json
{
  "success": true,
  "message": "Tạo phòng thành công",
  "data": {
    "id": 3,
    "owner_id": 1,
    "room_number": "302",
    "floor": 3,
    "area": 35,
    "price": 3000000,
    "status": "available",
    "description": "Phòng tầng 3, diện tích lớn, có ban công"
  }
}
```

---

### **9️⃣ Landlord: Update Room Status**

**Bước 1**: Tạo request mới
- **Method**: **PUT**
- **URL**: `http://localhost:5000/api/rooms/1`

**Bước 2**: Thêm Authorization header
- **Key**: `Authorization`
- **Value**: `Bearer <landlord_token>`

**Bước 3**: Thêm dữ liệu
- Tab **Body** → **raw** → **JSON**
- Nhập (chỉ update những field cần):
```json
{
  "status": "rented",
  "description": "Phòng tầng 1, đã cho thuê"
}
```

**Bước 4**: Gửi request
- Bấm **Send**

---

### **🔟 Get Room Details**

**Bước 1**: Tạo request mới
- **Method**: **GET**
- **URL**: `http://localhost:5000/api/rooms/1`

**Bước 2**: Gửi request (không cần token)
- Bấm **Send**

**Kết quả:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "owner_id": 1,
    "room_number": "102",
    "floor": 1,
    "area": 30,
    "price": 2500000,
    "status": "available",
    "owner_name": "Trần Anh Đức",
    "owner_phone": "0121020040",
    "bank_account_number": "0121020040",
    "bank_account_name": "Trần Anh Đức"
  }
}
```

---

### **📌 Mẹo Sử Dụng Postman**

**Lưu Workspace:**
- File → Save Workspace → Đặt tên (vd: "BCK Manager")
- Mọi request sẽ được lưu

**Tạo Collection:**
- Bấm **Collections** → **Create Collection**
- Tên: "BCK Manager API"
- Kéo các request vào collection

**Dùng Variables (nâng cao):**
- **Pre-request Script**:
```javascript
// Lưu token sau khi login
pm.environment.set("token", pm.response.json().token);
```

- **Sử dụng trong header**:
```
Authorization: Bearer {{token}}
```

---

### **❌ Lỗi Thường Gặp**

| Lỗi | Nguyên Nhân | Cách Khắc Phục |
|-----|-----------|--------------|
| `Cannot GET /api/auth/login` | Dùng GET thay vì POST | Chọn **POST** ở dropdown |
| `401 Unauthorized` | Token sai hoặc hết hạn | Copy lại token từ login response |
| `Cannot connect to localhost:5000` | Server chưa chạy | Chạy `npm run dev` |
| `message: "Không tìm thấy route"` | URL sai | Kiểm tra lại URL, không có typo |

---

## 🚀 Tiếp Theo

- [x] ✅ Authentication System (Login/Logout/Me)
- [x] ✅ Tenant Dashboard API
- [x] ✅ Room Management API
- [ ] Thêm Landlord Dashboard API
- [ ] Thêm Rental Management API
- [ ] Thêm Bill/Payment API
- [ ] Thêm Statistics API
- [ ] Thêm database migration system
- [ ] Thêm unit tests
- [ ] Thêm API documentation (Swagger)