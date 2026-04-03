# Mini Apartment Manager - Frontend

Ứng dụng quản lý chung cư mini xây dựng bằng React + TypeScript + Vite

## 🏗️ Cấu Trúc Project

```
src/
├── components/          # Các component tái sử dụng
│   ├── Common/         # Components chung (Header, Button, Sidebar, etc.)
│   ├── Forms/          # Form components
│   └── Tables/         # Table component
├── pages/              # Các trang chính
│   ├── Owner/          # Dashboard cho Chủ nhà
│   ├── Tenant/         # Dashboard cho Người thuê
│   └── Login.tsx       # Trang đăng nhập
├── layouts/            # Components layout chính
│   ├── MainLayout.tsx  # Layout chính với navbar + sidebar
│   └── AuthLayout.tsx  # Layout cho trang auth
├── stores/             # State management
│   └── AuthContext.tsx # Authentication context
├── services/           # API services
│   └── api.ts          # API call functions
├── types/              # TypeScript type definitions
│   └── index.ts        # Tất cả types
└── utils/              # Utility functions
    └── ProtectedRoute.tsx # Route protection component
```

## 📋 Chức Năng

### 1. Chủ Nhà (Owner)

- **Dashboard**: Xem tổng quan hệ thống
- **Quản lý Phòng**: Thêm, sửa, xóa phòng (số phòng, diện tích, giá thuê, tầng)
- **Quản lý Người Thuê**: Tạo tài khoản, quản lý thông tin người thuê
- **Quản lý Hợp Đồng**: Xem, tạo, quản lý hợp đồng thuê
- **Quản lý Dịch Vụ**: Thiết lập các dịch vụ thêm (wifi, vệ sinh, etc.)
- **Quản lý Điện Nước**: Nhập chỉ số điện, nước
- **Quản lý Hóa Đơn**: Xem, tạo, in hóa đơn
- **Xác nhận Thanh Toán**: Xác nhận các khoản thanh toán từ người thuê

### 2. Người Thuê (Tenant)

- **Dashboard**: Xem thông tin phòng và hóa đơn sắp tới
- **Phòng Của Tôi**: Xem chi tiết phòng đang thuê
- **Hợp Đồng**: Xem hợp đồng hiện tại (có thể tải xuống)
- **Hóa Đơn**: Xem chi tiết hóa đơn theo tháng
- **Thông Báo**: Nhận thông báo về thanh toán, bảo trì, etc.

## 🚀 Bắt Đầu

### Cài Đặt Dependencies

```bash
npm install
```

### Chạy Development Server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Build Production

```bash
npm run build
```

### Lint Code

```bash
npm run lint
```

## 🔐 Authentication

Hệ thống sử dụng Auth Context để quản lý trạng thái đăng nhập. 

### Tệp Chính:
- `src/stores/AuthContext.tsx`: Auth context provider
- `src/utils/ProtectedRoute.tsx`: Route protection HOC

## 🌐 API Integration

### Thiết Lập

1. Tạo file `.env` ở root project:
```env
VITE_API_URL=http://localhost:3000/api
```

2. Sử dụng API functions từ các services riêng:
```tsx
import { roomService } from '@/services';

// Lấy danh sách phòng
const rooms = await roomApi.getAll(1, 10);

// Tạo phòng mới
await roomApi.create({ roomNumber: '101', area: 30, floor: 1, price: 500 });
```

## 🎨 Styling

Dự án sử dụng CSS Modules cho styling. Mỗi component có một file `.module.css` tương ứng.

### Màu Sắc Chính:
- Primary: `#3498db` (Xanh)
- Success: `#27ae60` (Xanh lá)
- Warning: `#f39c12` (Cam)
- Danger: `#e74c3c` (Đỏ)
- Background: `#f5f5f5` (Xám nhạt)

## 📱 Responsive Design

Ứng dụng được thiết kế responsive cho các thiết bị khác nhau:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔄 State Management

Hiện tại sử dụng React Context API cho authentication. Có thể mở rộng với:
- Zustand (đơn giản, nhẹ)
- Redux (nếu state phức tạp)

## 📝 Cấu Trúc Component

### Common Components
```tsx
- Header: Tiêu đề trang với actions
- Button: Button với variants (primary, secondary, danger)
- Navbar: Navigation bar
- Sidebar: Menu bên trái
- Card: Container cơ bản
- Badge: Badge nhỏ
- Alert: Thông báo
- Loading: Loading indicator
- Modal: Dialog modal
```

### Form Components
```tsx
- Form: Form wrapper
- FormGroup: Nhóm form field
- Input: Input field
- Select: Select dropdown
- TextArea: Text area field
```

### Table Component
```tsx
- Table: Hiển thị dữ liệu dạng bảng
```

## 🔗 Routes

### Public Routes
- `/login` - Trang đăng nhập

### Owner Routes
- `/owner` - Dashboard
- `/owner/rooms` - Quản lý phòng
- `/owner/tenants` - Quản lý người thuê
- `/owner/contracts` - Quản lý hợp đồng
- `/owner/services` - Quản lý dịch vụ
- `/owner/utilities` - Quản lý điện nước
- `/owner/bills` - Quản lý hóa đơn
- `/owner/payments` - Xác nhận thanh toán

### Tenant Routes
- `/tenant` - Dashboard
- `/tenant/room` - Phòng của tôi
- `/tenant/contracts` - Hợp đồng
- `/tenant/bills` - Hóa đơn
- `/tenant/notifications` - Thông báo

## 🛠️ Công Cụ & Library

- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **React Router v7**: Routing
- **CSS Modules**: Styling

## 📖 Type Definitions

Tất cả types được định nghĩa trong `src/types/index.ts`:
- `User`, `UserRole`
- `Room`, `Tenant`
- `Contract`
- `Service`, `TenantService`
- `UtilityReading`
- `Bill`, `Payment`
- `Notification`
- API response types

## 🚀 Next Steps

1. **Kết nối API Backend**:
   - Cập nhật `VITE_API_URL`
   - Test các API calls

2. **Xác thực Người Dùng**:
   - Implement signup
   - Password reset
   - Token refresh

3. **Thêm Features**:
   - Export PDF cho hóa đơn
   - Email notifications
   - File upload cho hợp đồng
   - Dashboard charts/graphs

4. **Cải Thiện UX**:
   - Form validation
   - Error handling
   - Toast notifications
   - Pagination

5. **Optimization**:
   - Code splitting
   - Lazy loading pages
   - Caching strategy
   - Performance monitoring

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Vite Documentation](https://vite.dev)
- [React Router Documentation](https://reactrouter.com)

## 📞 Support

Để tạo thêm pages, components, hoặc cải thiện ứng dụng, hãy tham khảo cấu trúc hiện có và tuân theo conventions.

---

**Version**: 1.0.0  
**Last Updated**: 2024-03
