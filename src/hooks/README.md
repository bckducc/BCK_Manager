# Custom Hooks Documentation

Custom hooks giúp tái sử dụng logic, giữ code sạch và components dễ đọc hơn.

## Cấu Trúc

```
hooks/
├── useAuth.ts         # Hook để lấy auth context
├── useFetch.ts        # Hook để gọi API với loading/error state
├── useLocalStorage.ts # Hook để quản lý localStorage
└── index.ts           # Re-export all hooks
```

## Cách Sử Dụng

### 1. useAuth

Hook để truy cập Auth Context mà không cần `useContext` trực tiếp.

```tsx
import { useAuth } from '@/hooks';

export const Dashboard = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.name}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

**Trả về:**
```typescript
{
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

### 2. useFetch

Hook để gọi API và tự động quản lý loading, error, và data.

```tsx
import { useFetch, roomService } from '@/hooks';

export const RoomList = () => {
  const { data: rooms, loading, error, execute } = useFetch(
    () => roomService.getAll()
  );

  // Tự động gọi API khi component mount
  useEffect(() => {
    execute();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {rooms && rooms.map(room => (
        <div key={room.id}>{room.roomNumber}</div>
      ))}
      <button onClick={execute}>Refresh</button>
    </div>
  );
};
```

**Trả về:**
```typescript
{
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<T>;
}
```

### 3. useLocalStorage

Hook để quản lý localStorage một cách type-safe.

```tsx
import { useLocalStorage } from '@/hooks';

export const Settings = () => {
  const [theme, setTheme, removeTheme] = useLocalStorage<string>('theme', 'light');

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>
        Change to Dark
      </button>
      <button onClick={removeTheme}>
        Reset
      </button>
    </div>
  );
};
```

**Trả về:**
```typescript
[
  storedValue: T | undefined,           // Giá trị hiện tại
  setValue: (value: T | (val: T | undefined) => T) => void,  // Set giá trị
  removeValue: () => void                // Xóa value
]
```

## Ví Dụ Thực Tế

### Kết Hợp useAuth + useFetch

```tsx
import { useAuth } from '@/hooks';
import { useFetch, roomService } from '@/hooks';
import { useEffect } from 'react';

export const MyRooms = () => {
  const { user, isAuthenticated } = useAuth();
  const { data: rooms, loading, error, execute } = useFetch(
    () => roomService.getAll()
  );

  useEffect(() => {
    if (isAuthenticated) {
      execute();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <p>Please login first</p>;
  }

  return (
    <div>
      <h2>Hello {user?.name}, your rooms:</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Failed to load rooms</p>}
      {rooms && (
        <ul>
          {rooms.map(room => (
            <li key={room.id}>{room.roomNumber} - {room.area}m²</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

## Best Practices

1. **Tách Logic ra Hooks**: Nếu logic phức tạp, tạo custom hook riêng
2. **Dependencies**: Luôn kiểm tra dependency array
3. **Error Handling**: Luôn xử lý error state từ useFetch
4. **Type Safety**: Luôn cung cấp type cho useLocalStorage

## Mở Rộng

Để thêm hook mới:

1. Tạo file `src/hooks/useNewHook.ts`
2. Export từ `src/hooks/index.ts`

```tsx
// src/hooks/useNewHook.ts
import { useState, useCallback } from 'react';

export const useNewHook = () => {
  const [value, setValue] = useState<string>('');

  const reset = useCallback(() => {
    setValue('');
  }, []);

  return { value, setValue, reset };
};

// src/hooks/index.ts
export { useNewHook } from './useNewHook';
```
