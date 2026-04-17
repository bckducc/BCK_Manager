# Phân Quyền Hệ Thống BCK Manager

> **Dự án:** BCK Manager — Hệ thống Quản lý Chung Cư Mini

---

## Tổng Quan Vai Trò (Roles)

### 1. Chủ Nhà (LANDLORD)
- Quản lý toàn bộ hệ thống
- Quản lý người thuê, phòng, hợp đồng, dịch vụ, hóa đơn
- Xem tất cả báo cáo và thống kê

### 2. Người Thuê (TENANT)
- Xem thông tin của riêng mình
- Xem phòng đang thuê
- Xem hợp đồng và hóa đơn của mình
- Xem dashboard cá nhân

---

## Phân Quyền Chi Tiết Theo Endpoint

### Authentication (UC-01, UC-02)

| Endpoint | Phương Thức | Quyền Yêu Cầu | Tác Nhân |
|----------|-------------|------|---------|
| `/api/v1/auth/login` | POST | PUBLIC | Chủ nhà, Người thuê |
| `/api/v1/auth/logout` | POST | AUTHENTICATED | Chủ nhà, Người thuê |

---

### Quản Lý Tài Khoản (UC-03, UC-04)

| Endpoint | Phương Thức | Quyền Yêu Cầu | Mô Tả |
|----------|-------------|------|---------|
| `/api/v1/auth/profile` | GET | AUTHENTICATED | Xem thông tin cá nhân |
| `/api/v1/auth/profile` | PUT | AUTHENTICATED | Cập nhật thông tin cá nhân |
| `/api/v1/auth/profile/:id` | GET | LANDLORD \| OWNER | Xem thông tin người thuê (chủ nhà xem, hoặc chính người đó) |

---

### Quản Lý Người Thuê (UC-05, UC-06, UC-07)

| Endpoint | Phương Thức | Quyền Yêu Cầu | Mô Tả |
|----------|-------------|------|---------|
| `/api/v1/tenants` | GET | LANDLORD | Danh sách người thuê |
| `/api/v1/tenants` | POST | LANDLORD | Tạo tài khoản người thuê |
| `/api/v1/tenants/:id` | GET | LANDLORD | Chi tiết người thuê |
| `/api/v1/tenants/:id` | PUT | LANDLORD | Cập nhật thông tin người thuê |
| `/api/v1/tenants/:id/toggle-status` | PATCH | LANDLORD | Kích hoạt / vô hiệu hóa tài khoản |
| `/api/v1/tenants/search` | GET | LANDLORD | Tìm kiếm người thuê |

---

### Quản Lý Phòng (UC-08, UC-09, UC-10, UC-11, UC-12, UC-32)

| Endpoint | Phương Thức | Quyền Yêu Cầu | Mô Tả |
|----------|-------------|------|---------|
| `/api/v1/rooms` | GET | LANDLORD | Danh sách phòng |
| `/api/v1/rooms` | POST | LANDLORD | Tạo phòng |
| `/api/v1/rooms/:id` | GET | LANDLORD \| TENANT (nếu là người thuê phòng) | Chi tiết phòng |
| `/api/v1/rooms/:id` | PUT | LANDLORD | Cập nhật thông tin phòng |
| `/api/v1/rooms/:id` | DELETE | LANDLORD | Xóa phòng (chỉ phòng trống) |
| `/api/v1/rooms/my-room` | GET | TENANT | Xem phòng đang thuê |
| `/api/v1/rooms/search` | GET | LANDLORD | Tìm kiếm phòng |

---

### Quản Lý Hợp Đồng (UC-13, UC-14, UC-15, UC-16)

| Endpoint | Phương Thức | Quyền Yêu Cầu | Mô Tả |
|----------|-------------|------|---------|
| `/api/v1/contracts` | GET | LANDLORD | Danh sách hợp đồng |
| `/api/v1/contracts` | POST | LANDLORD | Tạo hợp đồng |
| `/api/v1/contracts/:id` | GET | LANDLORD \| TENANT (nếu là người thuê) | Chi tiết hợp đồng |
| `/api/v1/contracts/:id` | PUT | LANDLORD | Cập nhật hợp đồng |
| `/api/v1/contracts/:id/terminate` | PATCH | LANDLORD | Kết thúc hợp đồng |
| `/api/v1/contracts/search` | GET | LANDLORD \| TENANT | Tìm kiếm hợp đồng |

---

### Quản Lý Dịch Vụ (UC-17, UC-18, UC-19, UC-20, UC-21)

| Endpoint | Phương Thức | Quyền Yêu Cầu | Mô Tả |
|----------|-------------|------|---------|
| `/api/v1/services` | GET | LANDLORD | Danh sách dịch vụ |
| `/api/v1/services` | POST | LANDLORD | Tạo dịch vụ |
| `/api/v1/services/:id` | GET | LANDLORD | Chi tiết dịch vụ |
| `/api/v1/services/:id` | PUT | LANDLORD | Cập nhật dịch vụ |
| `/api/v1/services/:id` | DELETE | LANDLORD | Xóa dịch vụ |
| `/api/v1/rooms/:roomId/services` | POST | LANDLORD | Gán dịch vụ vào phòng |
| `/api/v1/rooms/:roomId/services/:serviceId` | DELETE | LANDLORD | Xóa dịch vụ khỏi phòng |

---

### Quản Lý Chỉ Số Điện Nước (UC-22, UC-23)

| Endpoint | Phương Thức | Quyền Yêu Cầu | Mô Tả |
|----------|-------------|------|---------|
| `/api/v1/utilities/meter-readings` | GET | LANDLORD | Danh sách chỉ số điện nước |
| `/api/v1/utilities/meter-readings` | POST | LANDLORD | Nhập chỉ số điện nước |
| `/api/v1/utilities/meter-readings/:id` | GET | LANDLORD \| TENANT (xem của phòng mình) | Chi tiết chỉ số |
| `/api/v1/utilities/meter-readings/:id` | PUT | LANDLORD | Cập nhật chỉ số |
| `/api/v1/utilities/rates` | GET | LANDLORD | Xem cấu hình giá điện nước |
| `/api/v1/utilities/rates` | PUT | LANDLORD | Cập nhật cấu hình giá |

---

### Quản Lý Hóa Đơn (UC-24, UC-25, UC-26, UC-27, UC-28)

| Endpoint | Phương Thức | Quyền Yêu Cầu | Mô Tả |
|----------|-------------|------|---------|
| `/api/v1/invoices` | GET | LANDLORD | Danh sách hóa đơn |
| `/api/v1/invoices` | POST | LANDLORD | Tạo hóa đơn |
| `/api/v1/invoices/:id` | GET | LANDLORD \| TENANT (xem hóa đơn của mình) | Chi tiết hóa đơn |
| `/api/v1/invoices/:id` | PUT | LANDLORD | Cập nhật hóa đơn |
| `/api/v1/invoices/:id/payment-confirm` | PATCH | LANDLORD | Xác nhận thanh toán |
| `/api/v1/invoices/:id/export` | GET | LANDLORD \| TENANT (xuất của mình) | Xuất hóa đơn |
| `/api/v1/invoices/search` | GET | LANDLORD \| TENANT | Tìm kiếm hóa đơn |

---

### Dashboard (UC-29, UC-30, UC-31)

| Endpoint | Phương Thức | Quyền Yêu Cầu | Mô Tả |
|----------|-------------|------|---------|
| `/api/v1/dashboard/landlord` | GET | LANDLORD | Dashboard cho chủ nhà |
| `/api/v1/dashboard/tenant` | GET | TENANT | Dashboard cho người thuê |
| `/api/v1/notifications` | GET | TENANT | Danh sách thông báo |

---

## Quy Tắc Phân Quyền

### Quy Tắc Chung

1. **AUTHENTICATED**: Người dùng phải đăng nhập (có token JWT hợp lệ)
2. **LANDLORD**: Chỉ chủ nhà (role = 'landlord')
3. **TENANT**: Chỉ người thuê (role = 'tenant')
4. **OWNER**: Người dùng đó hoặc admin (kiểm tra `userId` so sánh với resource ID)
5. **PUBLIC**: Không cần xác thực (chỉ login endpoint)

### Các Trường Hợp Đặc Biệt

1. **Xem Dữ Liệu Của Người Khác**:
   - Chủ nhà: Xem được hết
   - Người thuê: Chỉ xem được dữ liệu của mình (hợp đồng, hóa đơn, phòng)

2. **Cập Nhật / Xóa**:
   - Chỉ có quyền sửa dữ liệu của người khác nếu có role LANDLORD
   - Người dùng có thể sửa dữ liệu của chính mình

3. **Hợp Đồng & Hóa Đơn**:
   - Chủ nhà: Toàn quyền
   - Người thuê: Chỉ xem của mình (dựa vào `tenantId` trong hợp đồng/hóa đơn)

---

## Cách Thực Hiện

### Middleware Kiểm Tra Quyền

```javascript
// Kiểm tra role
const authorize = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
};
```

### Cách Sử Dụng

```javascript
router.post('/tenants', authorize(['landlord']), createTenant);
router.get('/invoices/:id', authorize(['landlord', 'tenant']), checkInvoiceOwnership, getInvoiceDetail);
```

---

## Bảng Tóm Tắt Quyền

| Chức Năng | Chủ Nhà | Người Thuê |
|-----------|--------|-----------|
| **Quản lý tài khoản** | ✓ (tất cả) | ✓ (của mình) |
| **Quản lý người thuê** | ✓ | ✗ |
| **Quản lý phòng** | ✓ | ✓ (xem của mình) |
| **Quản lý hợp đồng** | ✓ | ✓ (của mình) |
| **Quản lý dịch vụ** | ✓ | ✗ |
| **Quản lý điện nước** | ✓ | ✓ (xem của mình) |
| **Quản lý hóa đơn** | ✓ | ✓ (của mình) |
| **Dashboard** | ✓ | ✓ (cái của mình) |
