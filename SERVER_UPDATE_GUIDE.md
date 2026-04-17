# Hướng Dẫn Cập Nhật server.js với Các Routes Mới

## Hiện Tại trong `src/server.js`

```javascript
const apiV1 = express.Router();

apiV1.use('/auth', authRoutes);
apiV1.use('/tenant', tenantRoutes);
apiV1.use('/rooms', roomRoutes);

app.use('/api', apiV1);
```

### Problem
- Sử dụng `/api` thay vì `/api/v1`
- Endpoints là: `/api/auth`, `/api/tenant`, `/api/rooms`
- Không có các routes khác: contracts, invoices, services, utilities, dashboard

---

## Cần Thay Đổi

### Bước 1: Import Các Routes Mới

Thêm các dòng này vào đầu `src/server.js`:

```javascript
import contractRoutes from './routes/contracts.js';
import invoiceRoutes from './routes/invoices.js';
import serviceRoutes from './routes/services.js';
import utilityRoutes from './routes/utilities.js';
import dashboardRoutes from './routes/dashboard.js';
```

**Vị trí:** Sau dòng `import roomRoutes from './routes/rooms.js';`

---

### Bước 2: Cập Nhật Path Của API Routes

**Thay đổi từ:**
```javascript
const apiV1 = express.Router();

apiV1.use('/auth', authRoutes);
apiV1.use('/tenant', tenantRoutes);
apiV1.use('/rooms', roomRoutes);

app.use('/api', apiV1);
```

**Thành:**
```javascript
const apiV1 = express.Router();

// Authentication
apiV1.use('/auth', authRoutes);

// Tenant Management (Person Routes)
apiV1.use('/tenants', tenantRoutes); // Đổi từ '/tenant' thành '/tenants'

// Room Management
apiV1.use('/rooms', roomRoutes);

// Contract Management
apiV1.use('/contracts', contractRoutes);

// Service Management
apiV1.use('/services', serviceRoutes);

// Invoice Management
apiV1.use('/invoices', invoiceRoutes);

// Utility Management (Điện nước)
apiV1.use('/utilities', utilityRoutes);

// Dashboard & Notifications
apiV1.use('/dashboard', dashboardRoutes);

app.use('/api/v1', apiV1); // Cập nhật từ '/api' thành '/api/v1'
```

---

## Endpoints Sau Khi Cập Nhật

### Auth
```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
GET    /api/v1/auth/profile
PUT    /api/v1/auth/profile
```

### Tenants (Chủ nhà quản lý người thuê)
```
GET    /api/v1/tenants              - Danh sách
POST   /api/v1/tenants              - Tạo
GET    /api/v1/tenants/:id          - Chi tiết
PUT    /api/v1/tenants/:id          - Cập nhật
PATCH  /api/v1/tenants/:id/toggle-status - Khóa/mở khóa
GET    /api/v1/tenants/search       - Tìm kiếm
```

### Rooms
```
GET    /api/v1/rooms                - Danh sách (LANDLORD)
POST   /api/v1/rooms                - Tạo (LANDLORD)
GET    /api/v1/rooms/:id            - Chi tiết
PUT    /api/v1/rooms/:id            - Cập nhật (LANDLORD)
DELETE /api/v1/rooms/:id            - Xóa (LANDLORD)
GET    /api/v1/rooms/my-room        - Xem phòng của tôi (TENANT)
GET    /api/v1/rooms/search         - Tìm kiếm (LANDLORD)
```

### Contracts
```
GET    /api/v1/contracts            - Danh sách (LANDLORD)
POST   /api/v1/contracts            - Tạo (LANDLORD)
GET    /api/v1/contracts/:id        - Chi tiết
GET    /api/v1/contracts/search     - Tìm kiếm
PUT    /api/v1/contracts/:id        - Cập nhật (LANDLORD)
PATCH  /api/v1/contracts/:id/terminate - Kết thúc (LANDLORD)
```

### Services
```
GET    /api/v1/services             - Danh sách (LANDLORD)
POST   /api/v1/services             - Tạo (LANDLORD)
GET    /api/v1/services/:id         - Chi tiết (LANDLORD)
PUT    /api/v1/services/:id         - Cập nhật (LANDLORD)
DELETE /api/v1/services/:id         - Xóa (LANDLORD)
POST   /api/v1/rooms/:roomId/services - Gán dịch vụ (LANDLORD)
DELETE /api/v1/rooms/:roomId/services/:serviceId - Xóa khỏi phòng (LANDLORD)
```

### Invoices
```
GET    /api/v1/invoices             - Danh sách (LANDLORD)
POST   /api/v1/invoices             - Tạo (LANDLORD)
GET    /api/v1/invoices/:id         - Chi tiết
GET    /api/v1/invoices/search      - Tìm kiếm
PUT    /api/v1/invoices/:id         - Cập nhật (LANDLORD)
PATCH  /api/v1/invoices/:id/payment-confirm - Xác nhận TT (LANDLORD)
GET    /api/v1/invoices/:id/export  - Xuất (LANDLORD hoặc TENANT_OWNER)
```

### Utilities (Điện nước)
```
GET    /api/v1/utilities/meter-readings        - Danh sách (LANDLORD)
POST   /api/v1/utilities/meter-readings        - Nhập (LANDLORD)
GET    /api/v1/utilities/meter-readings/:id    - Chi tiết
PUT    /api/v1/utilities/meter-readings/:id    - Cập nhật (LANDLORD)
GET    /api/v1/utilities/meter-readings/search - Tìm kiếm (LANDLORD)
GET    /api/v1/utilities/rates                 - Xem cấu hình (LANDLORD)
PUT    /api/v1/utilities/rates                 - Cập nhật (LANDLORD)
```

### Dashboard
```
GET    /api/v1/dashboard/landlord   - Dashboard chủ nhà (LANDLORD)
GET    /api/v1/dashboard/tenant     - Dashboard người thuê (TENANT)
GET    /api/v1/notifications        - Thông báo (TENANT)
```

---

## Full Code Update

Đây là đoạn code hoàn chỉnh để cập nhật vào `src/server.js`:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import tenantRoutes from './routes/tenant.js';
import roomRoutes from './routes/rooms.js';
import contractRoutes from './routes/contracts.js';          // NEW
import invoiceRoutes from './routes/invoices.js';            // NEW
import serviceRoutes from './routes/services.js';            // NEW
import utilityRoutes from './routes/utilities.js';           // NEW
import dashboardRoutes from './routes/dashboard.js';         // NEW
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { ApiResponse } from './utils/responseHandler.js';
import pool from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json(
    ApiResponse.success(200, {
      status: 'OK',
      environment: process.env.NODE_ENV || 'development',
    }, 'Server đang chạy')
  );
});

const apiV1 = express.Router();

// Authentication
apiV1.use('/auth', authRoutes);

// Tenant Management
apiV1.use('/tenants', tenantRoutes);

// Room Management
apiV1.use('/rooms', roomRoutes);

// Contract Management
apiV1.use('/contracts', contractRoutes);

// Service Management
apiV1.use('/services', serviceRoutes);

// Invoice Management
apiV1.use('/invoices', invoiceRoutes);

// Utility Management (Điện nước)
apiV1.use('/utilities', utilityRoutes);

// Dashboard & Notifications
apiV1.use('/dashboard', dashboardRoutes);

// Mount API v1
app.use('/api/v1', apiV1);

app.use(notFoundHandler);

app.use(errorHandler);

const server = app.listen(PORT, async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Database connected successfully');
    connection.release();

    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ API Base URL: http://localhost:${PORT}/api/v1`);
    console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error('✗ Failed to connect to database:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
```

---

## Lưu Ý Quan Trọng

1. **Thứ Tự Sắp Xếp Routes**: Không thay đổi (định lượt không quan trọng với Express Router)
2. **Middleware**: Đã được định nghĩa trong từng route file riêng
3. **Caching**: Có thể thêm caching cho `/dashboard` endpoints nhưng không bắt buộc
4. **Old Routes**: Nếu frontend vẫn dùng `/api/...`, có thể giữ cả cũ lẫn mới tạm thời:
   ```javascript
   app.use('/api/v1', apiV1);
   // Temporary backward compatibility
   app.use('/api', apiV1);
   ```

---

## Testing Sau Cập Nhật

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"landlord","password":"password"}'

# Get token từ login response, sau đó test một endpoint:
curl -X GET http://localhost:5000/api/v1/tenants \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Migration Checklist

- [ ] Update imports ngay sau `import roomRoutes`
- [ ] Update route registrations (tất cả 8 dòng đó dưới `const apiV1`)
- [ ] Change từ `/api` thành `/api/v1`
- [ ] Test health endpoint
- [ ] Test login endpoint
- [ ] Test một endpoint có middleware
- [ ] Update frontend URLs nếu cần
