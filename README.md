# BCK Manager – Quản lý nhà trọ / chung cư mini

**BCK Manager** là ứng dụng web hỗ trợ chủ trọ và người thuê quản lý vận hành nhà trọ/chung cư mini: quản lý phòng, người thuê, hợp đồng, hoá đơn, thanh toán và theo dõi điện nước.

## Tính năng chính

- **Xác thực & phân quyền**: đăng nhập và điều hướng theo vai trò (owner/tenant/admin).
- **Owner**: quản lý phòng, người thuê, hợp đồng, dịch vụ, điện nước, hoá đơn, thanh toán.
- **Tenant**: xem thông tin phòng, hợp đồng, hoá đơn, thông báo.

## Công nghệ sử dụng

- **React + TypeScript**
- **Vite**
- **React Router**
- **styled-components**
- **@ant-design/icons**

## Cấu trúc thư mục (theo module)

```txt
src/
├── main.tsx
├── App.tsx
├── index.css
├── assets/
├── components/          # UI dùng lại
│   ├── common/
│   ├── forms/
│   └── Table.tsx
├── modules/             # business chính
│   ├── auth/
│   ├── room/
│   ├── tenant/
│   ├── bill/
│   ├── contract/
│   ├── payment/
│   ├── service/
│   └── utility/
├── layouts/
├── store/               # context global
├── services/            # core services (apiClient.ts)
├── hooks/
├── utils/
└── styles/
```

## Yêu cầu môi trường

- **Node.js** (khuyến nghị bản LTS)
- **npm**

## Cài đặt & chạy dự án

Cài dependencies:

```bash
npm install
```

Chạy dev:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview bản build:

```bash
npm run preview
```

## Ghi chú

- API client cấu hình tại `src/services/apiClient.ts` (mặc định gọi `http://localhost:5000`).
- Routing & phân quyền: `src/App.tsx`, `src/utils/ProtectedRoute.tsx`.

