# BCK Manager Backend - Modular Architecture

## 📁 Cấu trúc thư mục mới

```
src/
├── modules/                          # Các module chính của ứng dụng
│   ├── auth/                        # Module xác thực người dùng
│   │   ├── auth.controller.js       # Xử lý các request xác thực
│   │   ├── auth.service.js          # Logic xác thực (database, password hash)
│   │   ├── auth.route.js            # Định nghĩa các route xác thực
│   │   ├── auth.model.js            # Định nghĩa schema database
│   │   └── auth.validation.js       # Quy tắc validate dữ liệu
│   │
│   ├── tenant/                      # Module quản lý người thuê
│   │   ├── tenant.controller.js
│   │   ├── tenant.service.js
│   │   ├── tenant.route.js
│   │   ├── tenant.model.js
│   │   └── tenant.validation.js
│   │
│   ├── room/                        # Module quản lý phòng
│   │   ├── room.controller.js
│   │   ├── room.service.js
│   │   ├── room.route.js
│   │   ├── room.model.js
│   │   └── room.validation.js
│   │
│   ├── bill/                        # Module quản lý hóa đơn (tính phí)
│   │   ├── bill.controller.js
│   │   ├── bill.service.js
│   │   ├── bill.route.js
│   │   ├── bill.model.js
│   │   └── bill.validation.js
│   │
│   ├── service/                     # Module quản lý dịch vụ
│   │   ├── service.controller.js
│   │   ├── service.service.js
│   │   ├── service.route.js
│   │   ├── service.model.js
│   │   └── service.validation.js
│   │
│   └── contract/                    # Module quản lý hợp đồng thuê
│       ├── contract.controller.js
│       ├── contract.service.js
│       ├── contract.route.js
│       ├── contract.model.js
│       └── contract.validation.js
│
├── middleware/                      # Các middleware toàn cục
│   ├── auth.js                     # Middleware xác thực, sinh JWT
│   ├── authenticate.js             # Xác minh token
│   ├── authorize.js                # Kiểm tra quyền truy cập
│   ├── errorHandler.js             # Xử lý lỗi
│   ├── owner.js                    # Kiểm tra chủ sở hữu
│   ├── role.js                     # Kiểm tra vai trò
│   └── validation.js               # Validate request data
│
├── config/                         # Cấu hình ứng dụng
│   └── database.js                 # Kết nối database
│
├── utils/                          # Các tiện ích chung
│   ├── customError.js              # Định nghĩa lỗi tùy chỉnh
│   ├── hash.js                     # Hash mật khẩu
│   ├── jwt.js                      # JWT utilities
│   └── responseHandler.js          # Xử lý response
│
├── constants/                      # Các hằng số
│   └── roles.js                    # Định nghĩa vai trò
│
└── server.js                       # Điểm khởi động chính
```

## 🔄 Cách sử dụng các Module

### 1. **Authentication Module (auth)**
```javascript
// Route
GET  /api/auth/login              - Đăng nhập
GET  /api/auth/me                 - Lấy thông tin người dùng hiện tại
POST /api/auth/logout             - Đăng xuất
GET  /api/auth/check-user         - Kiểm tra người dùng tồn tại
```

### 2. **Tenant Module (tenant)**
```javascript
// Route
GET  /api/tenant/dashboard        - Lấy dashboard người thuê
PUT  /api/tenant/profile          - Cập nhật hồ sơ người thuê
GET  /api/tenant/rooms            - Lấy danh sách phòng của người thuê
```

### 3. **Room Module (room)**
```javascript
// Route
GET  /api/rooms/available         - Lấy danh sách phòng có sẵn
GET  /api/rooms/landlord/rooms    - Lấy phòng của chủ nhà (cần auth)
POST /api/rooms                   - Tạo phòng mới
GET  /api/rooms/:roomId           - Lấy chi tiết phòng
PUT  /api/rooms/:roomId           - Cập nhật thông tin phòng
DEL  /api/rooms/:roomId           - Xóa phòng
```

### 4. **Bill Module (bill)**
```javascript
// Route
GET  /api/bills                   - Lấy danh sách hóa đơn
GET  /api/bills/:billId           - Lấy chi tiết hóa đơn
POST /api/bills                   - Tạo hóa đơn mới
PUT  /api/bills/:billId           - Cập nhật hóa đơn
DEL  /api/bills/:billId           - Xóa hóa đơn
```

### 5. **Service Module (service)**
```javascript
// Route
GET  /api/services                - Lấy danh sách dịch vụ
GET  /api/services/:serviceId     - Lấy chi tiết dịch vụ
POST /api/services                - Tạo dịch vụ mới
PUT  /api/services/:serviceId     - Cập nhật dịch vụ
DEL  /api/services/:serviceId     - Xóa dịch vụ
```

### 6. **Contract Module (contract)**
```javascript
// Route
GET  /api/contracts               - Lấy danh sách hợp đồng
GET  /api/contracts/:contractId   - Lấy chi tiết hợp đồng
POST /api/contracts               - Tạo hợp đồng mới
PUT  /api/contracts/:contractId   - Cập nhật hợp đồng
DEL  /api/contracts/:contractId   - Xóa hợp đồng
```

## 📋 Quy tắc Naming Convention

### File Names
- `[module-name].controller.js` - Xử lý request/response
- `[module-name].service.js` - Business logic & database operations
- `[module-name].route.js` - Định nghĩa routes
- `[module-name].model.js` - Schema và cấu trúc dữ liệu
- `[module-name].validation.js` - Quy tắc validate dữ liệu

### Function Names
- Controllers: `getSomething`, `createSomething`, `updateSomething`, `deleteSomething`
- Services: Tương tự nhưng có thể chi tiết hơn
- Routes: Sử dụng `router.get()`, `router.post()`, `router.put()`, `router.delete()`

## 🔗 Import Path

### Trước (cũ)
```javascript
import { authController } from '../controllers/authController.js';
import { authService } from '../services/authService.js';
```

### Sau (mới)
```javascript
import { login } from './auth.controller.js';
import { findUserByUsername } from './auth.service.js';
```

## 🛠️ Lợi ích của kiến trúc Modular

✅ **Organization** - Các tệp liên quan được nhóm lại với nhau  
✅ **Reusability** - Dễ dàng tái sử dụng module trong các dự án khác  
✅ **Maintainability** - Dễ bảo trì và cập nhật từng module  
✅ **Scalability** - Dễ dàng thêm module mới  
✅ **Clarity** - Cấu trúc rõ ràng, dễ hiểu  
✅ **Testability** - Dễ viết unit test cho từng module  

## 🚀 Khởi động ứng dụng

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production mode
npm start
```