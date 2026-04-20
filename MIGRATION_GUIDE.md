# 🔄 Migration Guide - Cấu trúc cũ sang Modular

## 📊 So sánh Cấu trúc

### Cấu trúc CŨ
```
src/
├── controllers/
│   ├── authController.js
│   ├── roomController.js
│   ├── tenantController.js
│   └── tenant.js
├── routes/
│   ├── auth.js
│   ├── tenant.js
│   ├── rooms.js
│   ├── contracts.js
│   ├── dashboard.js
│   ├── invoices.js
│   ├── services.js
│   └── utilities.js
├── services/
│   ├── authService.js
│   ├── auth.js
│   └── roomService.js
├── models/
│   └── index.js
├── middleware/
├── config/
├── utils/
├── constants/
└── server.js
```

### Cấu trúc MỚI (Modular)
```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.route.js
│   │   ├── auth.model.js
│   │   └── auth.validation.js
│   ├── tenant/
│   │   ├── tenant.controller.js
│   │   ├── tenant.service.js
│   │   ├── tenant.route.js
│   │   ├── tenant.model.js
│   │   └── tenant.validation.js
│   ├── room/
│   │   └── ...
│   ├── bill/
│   │   └── ...
│   ├── service/
│   │   └── ...
│   └── contract/
│       └── ...
├── middleware/
├── config/
├── utils/
├── constants/
└── server.js
```

## 🔄 File Mapping

### Auth Module
| Tệp cũ | Tệp mới | Ghi chú |
|--------|---------|--------|
| `controllers/authController.js` | `modules/auth/auth.controller.js` | Chuyển toàn bộ nội dung |
| `services/authService.js` | `modules/auth/auth.service.js` | Chuyển toàn bộ nội dung |
| `routes/auth.js` | `modules/auth/auth.route.js` | Cập nhật import path |
| - | `modules/auth/auth.model.js` | Tạo mới - định nghĩa schema |
| - | `modules/auth/auth.validation.js` | Tạo mới - quy tắc validate |

### Room Module
| Tệp cũ | Tệp mới | Ghi chú |
|--------|---------|--------|
| `controllers/roomController.js` | `modules/room/room.controller.js` | Chuyển toàn bộ nội dung |
| `services/roomService.js` | `modules/room/room.service.js` | Chuyển toàn bộ nội dung |
| `routes/rooms.js` | `modules/room/room.route.js` | Cập nhật import path |
| - | `modules/room/room.model.js` | Tạo mới |
| - | `modules/room/room.validation.js` | Tạo mới |

### Tenant Module
| Tệp cũ | Tệp mới | Ghi chú |
|--------|---------|--------|
| `controllers/tenantController.js` | `modules/tenant/tenant.controller.js` | Chuyển toàn bộ nội dung |
| `routes/tenant.js` | `modules/tenant/tenant.route.js` | Cập nhật import path |
| - | `modules/tenant/tenant.service.js` | Tạo mới - thêm business logic |
| - | `modules/tenant/tenant.model.js` | Tạo mới |
| - | `modules/tenant/tenant.validation.js` | Tạo mới |

### Các Module Mới
| Module | Mô tả |
|--------|-------|
| `modules/bill/` | Quản lý hóa đơn/tính phí (được tạo mới) |
| `modules/service/` | Quản lý dịch vụ (được tạo mới) |
| `modules/contract/` | Quản lý hợp đồng thuê (được tạo mới) |

## 🚀 Các bước Migration

### 1. ✅ Tạo cấu trúc thư mục
Đã tạo tất cả các thư mục module:
```bash
src/modules/auth/
src/modules/tenant/
src/modules/room/
src/modules/bill/
src/modules/service/
src/modules/contract/
```

### 2. ✅ Chuyển các file
Tất cả các file đã được chuyển/tạo mới với cập nhật import path đúng.

### 3. ✅ Cập nhật server.js
Import đã được cập nhật từ:
```javascript
import authRoutes from './routes/auth.js';
```
Thành:
```javascript
import authRoutes from './modules/auth/auth.route.js';
```

### 4. ⚠️ Xóa các file cũ (tuỳ chọn)
Sau khi xác minh ứng dụng hoạt động đúng, có thể xóa:
```bash
rm -rf src/controllers/
rm -rf src/routes/
rm -rf src/services/
```

## 📝 Update Import Paths

### Ví dụ 1: Auth Module
**Cũ:**
```javascript
import { login } from '../controllers/authController.js';
import { findUserByUsername } from '../services/authService.js';
```

**Mới:**
```javascript
import { login } from './auth.controller.js';
import { findUserByUsername } from './auth.service.js';
```

### Ví dụ 2: Room Module
**Cũ:**
```javascript
import { getRoomsByLandlord } from '../services/roomService.js';
```

**Mới:**
```javascript
import { getRoomsByLandlord } from './room.service.js';
```

## ✅ Checklist Migration

- [x] Tạo cấu trúc thư mục modules
- [x] Tạo auth module (controller, service, route, model, validation)
- [x] Tạo tenant module
- [x] Tạo room module
- [x] Tạo bill module (mới)
- [x] Tạo service module (mới)
- [x] Tạo contract module (mới)
- [x] Cập nhật server.js với import mới
- [x] Tạo document hướng dẫn
- [ ] Test ứng dụng
- [ ] Cập nhật Postman collection (nếu cần)
- [ ] Xóa các file cũ nếu đã xác minh hoạt động

## 🧪 Kiểm tra sau Migration

### 1. Kiểm tra server khởi động
```bash
npm run dev
```
Kiểm tra xem có lỗi import hoặc syntax không.

### 2. Kiểm tra API endpoints
Dùng Postman hoặc curl để test:
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/auth/login -X POST
curl http://localhost:5000/api/rooms/available
```

### 3. Kiểm tra middleware
- Xác thực (auth)
- Phân quyền (authorization)
- Validate dữ liệu

### 4. Kiểm tra database connection
```bash
GET http://localhost:5000/health
```

## 🆘 Troubleshooting

### Lỗi: `Cannot find module`
- Kiểm tra import path có đúng không
- Đảm bảo file tồn tại
- Kiểm tra tên file (phân biệt chữ hoa/thường trên Linux)

### Lỗi: `function is not defined`
- Kiểm tra function có được export đúng không
- Kiểm tra import statement

### Lỗi: Database không kết nối
- Kiểm tra config/database.js
- Kiểm tra biến môi trường (.env)
- Kiểm tra kết nối database

## 📚 Tài liệu liên quan
- [Modular Structure Guide](./MODULAR_STRUCTURE.md)
- [README.md](./README.md)

---

**Ngày Migration:** 2024
**Phiên bản:** 2.0 (Modular)
