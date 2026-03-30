# CSS Structure Optimization Guide

## 📁 New CSS Organization

Các file CSS đã được tổ chức lại thành một hệ thống tập trung và có thể tái sử dụng:

```
src/
├── styles/                 # CSS tập trung
│   ├── variables.css       # Biến CSS + Utilities chung
│   ├── common.module.css   # Button, Badge, Alert, Card, Modal, Loading
│   ├── layouts.module.css  # Navbar, Sidebar, MainLayout, AuthLayout
│   ├── forms.module.css    # Form styles
│   ├── tables.module.css   # Table styles
│   └── pages.module.css    # Page layouts, stats, sections
├── components/
├── pages/
└── index.css               # Import variables.css
```

## 🎨 CSS Variables (variables.css)

Tất cả biến CSS được định nghĩa ở `:root` scope:

### Colors
```css
--primary: #3498db
--success: #27ae60
--danger: #e74c3c
--warning: #f39c12
--info: #16a085
--dark: #2c3e50
--light: #ecf0f1
--white: #ffffff
```

### Spacing
```css
--space-xs: 0.25rem
--space-sm: 0.5rem
--space-md: 1rem
--space-lg: 1.5rem
--space-xl: 2rem
--space-2xl: 3rem
```

### Border Radius
```css
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 16px
--radius-full: 9999px
```

### Typography, Shadows, Transitions, Z-index
- Font sizes từ `--font-size-sm` đến `--font-size-2xl`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- Transitions: `--transition-fast`, `--transition-base`, `--transition-slow`
- Z-index levels: `--z-dropdown`, `--z-modal`, etc.

## 🔄 Cách Migrate Components

### ❌ Trước (nhiều file riêng lẻ):
```
src/components/Common/Button.module.css
src/components/Common/Badge.module.css
src/components/Common/Card.module.css
```

### ✅ Sau (file chung):
```
src/styles/common.module.css
```

### Ví dụ Migration

**Button.tsx** (trước):
```tsx
import styles from './Button.module.css';

export const Button = ({ variant = 'primary' }) => (
  <button className={styles[variant]}>Click</button>
);
```

**Button.tsx** (sau):
```tsx
import styles from '../styles/common.module.css';

export const Button = ({ variant = 'primary' }) => (
  <button className={styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]}>
    Click
  </button>
);
```

Hoặc tốt hơn:
```tsx
import styles from '../styles/common.module.css';

export const Button = ({ variant = 'primary', ...props }) => (
  <button 
    className={`${styles.button} ${styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]}`}
    {...props}
  />
);
```

## 📝 File Mapping

| Cấu trúc cũ | Chuyển sang | File mới |
|------------|-----------|---------|
| Button.module.css | common.module.css | buttonPrimary, buttonSecondary, etc. |
| Badge.module.css | common.module.css | badgePrimary, badgeSuccess, etc. |
| Alert.module.css | common.module.css | alertSuccess, alertError, etc. |
| Card.module.css | common.module.css | card, cardTitle, cardContent |
| Modal.module.css | common.module.css | modal, modalContent, etc. |
| Loading.module.css | common.module.css | spinner, loading |
| Navbar.module.css | layouts.module.css | navbar*, navbarUser*, etc. |
| Sidebar.module.css | layouts.module.css | sidebar*, sidebarNav* |
| MainLayout.module.css | layouts.module.css | mainLayout*, authLayout* |
| Form.module.css | forms.module.css | form, formGroup, input, etc. |
| Table.module.css | tables.module.css | table*, tableActions, etc. |

## 🎯 Lợi ích

1. **Giảm số lượng file**: Từ 27+ file CSS Module xuống còn 5 file
2. **Dễ bảo trì**: Tất cả biến + utilities ở một chỗ
3. **Nhất quán (Consistency)**: Cùng một bộ màu, spacing, borderRadius
4. **Dễ update theme**: Chỉ cần thay đổi variables.css
5. **Tái sử dụng code**: Các utility classes có thể dùng lại
6. **Performance**: Ít CSS file cần load

## 📋 Checklist Migration

- [ ] Cập nhật Button.tsx để dùng styles từ common.module.css
- [ ] Cập nhật Badge.tsx
- [ ] Cập nhật Alert.tsx
- [ ] Cập nhật Card.tsx
- [ ] Cập nhật Modal.tsx
- [ ] Cập nhật Loading.tsx
- [ ] Cập nhật Navbar.tsx
- [ ] Cập nhật Sidebar.tsx
- [ ] Cập nhật MainLayout.tsx
- [ ] Cập nhật AuthLayout.tsx
- [ ] Cập nhật Form.tsx
- [ ] Cập nhật Table.tsx
- [ ] Xóa tất cả file CSS Module cũ từ components/
- [ ] Cập nhật Page styles để dùng pages.module.css
- [ ] Run `npm run build` để verify

## 🚀 Next Steps

1. Cập nhật component imports từ từng file CSS riêng lẻ
2. Merge các style classes tương tự
3. Kiểm tra hiệu ứng hover, focus, active states
4. Test responsive design
5. Xóa các file CSS cũ khi không còn sử dụng
