# Services Documentation

Các services được tổ chức theo tài nguyên (resource-based) để dễ quản lý và mở rộng khi dự án phát triển.

## Cấu Trúc

```
services/
├── apiClient.ts       # Base API client với apiCall function
├── authService.ts     # Authentication endpoints
├── roomService.ts     # Room management endpoints
├── tenantService.ts   # Tenant management endpoints
├── billService.ts     # Bill management endpoints
├── contractService.ts # Contract management endpoints
├── index.ts           # Re-export all services
└── README.md          # Documentation
```

## Cách Sử Dụng

### 1. Import từ services

```tsx
import { roomService, authService, tenantService } from '@/services';
```

### 2. Sử dụng trong Components

```tsx
import { useEffect, useState } from 'react';
import { roomService } from '@/services';

export const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    roomService.getAll()
      .then(res => {
        if (res.success) {
          setRooms(res.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {rooms.map(room => (
        <div key={room.id}>{room.roomNumber}</div>
      ))}
    </div>
  );
};
```

### 3. Sử dụng Custom Hook `useFetch`

```tsx
import { useFetch, roomService } from '@/hooks';

export const RoomList = () => {
  const { data: rooms, loading, error } = useFetch(() => roomService.getAll());

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {rooms && rooms.map(room => (
        <div key={room.id}>{room.roomNumber}</div>
      ))}
    </div>
  );
};
```

## Services Disponibles

### authService
- `login(username, password)` - Đăng nhập
- `getMe()` - Lấy thông tin người dùng hiện tại
- `logout()` - Đăng xuất

### roomService
- `getAll()` - Lấy tất cả phòng
- `getById(id)` - Lấy chi tiết phòng
- `create(data)` - Tạo phòng mới
- `update(id, data)` - Cập nhật phòng
- `delete(id)` - Xóa phòng

### tenantService
- `getAll()` - Lấy tất cả người thuê
- `getById(id)` - Lấy chi tiết người thuê
- `create(data)` - Tạo người thuê mới
- `update(id, data)` - Cập nhật người thuê
- `delete(id)` - Xóa người thuê

### billService
- `getAll()` - Lấy tất cả hóa đơn
- `getById(id)` - Lấy chi tiết hóa đơn
- `create(data)` - Tạo hóa đơn mới
- `update(id, data)` - Cập nhật hóa đơn
- `delete(id)` - Xóa hóa đơn

### contractService
- `getAll()` - Lấy tất cả hợp đồng
- `getById(id)` - Lấy chi tiết hợp đồng
- `create(data)` - Tạo hợp đồng mới
- `update(id, data)` - Cập nhật hợp đồng
- `delete(id)` - Xóa hợp đồng

## API Response Format

Tất cả services trả về Response trong format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: T;
  [key: string]: any;
}
```

## Xử Lý Lỗi

- Token hết hạn hoặc không hợp lệ → Tự động redirect về `/login`
- Các lỗi khác → Throw error để xử lý trong component

## Mở Rộng

Để thêm service mới:

1. Tạo file `src/services/newService.ts`
2. Export từ `src/services/index.ts`
3. Import để sử dụng trong components

```tsx
// src/services/newService.ts
import { apiCall } from './apiClient';

export const newService = {
  getAll: () => apiCall('/api/new', { method: 'GET' }),
  // ... thêm các methods khác
};

// src/services/index.ts
export { newService } from './newService';
```
