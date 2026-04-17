# 📮 Hướng Dẫn Kiểm Tra API Trong Postman

> **Dự án**: BCK Manager — Hệ thống Quản lý Chung Cư Mini

---

## 1️⃣ Chuẩn Bị Postman

### Bước 1: Tải Postman
- Tải từ: https://www.postman.com/downloads/
- Cài đặt và mở ứng dụng
- Tạo tài khoản miễn phí hoặc đăng nhập

### Bước 2: Tạo Workspace Mới
1. Nhấp **Workspaces** (menu trái)
2. Chọn **Create Workspace**
3. Đặt tên: `BCK Manager API Testing`
4. Chọn **Create**

### Bước 3: Tạo Collection
1. Nhấp **Collections** (menu trái)
2. Chọn **+ Create Collection**
3. Đặt tên: `BCK Manager API v1`
4. Chọn **Create**

---

## 2️⃣ Setup Environment Variables

### Tại Sao Cần?
- Lưu base URL, token, user credentials
- Dễ dàng chuyển đổi giữa dev, staging, production
- Giảm việc nhập lại dữ liệu

### Tạo Environment

#### Bước 1: Tạo Environment
1. Nhấp **Environments** (menu trái) → **+** hoặc **Create Environment**
2. Đặt tên: `Development`
3. Thêm các biến:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:5000/api/v1` | (để trống hoặc same) |
| `landlord_token` | `` | (sẽ được điền từ login response) |
| `tenant_token` | `` | (sẽ được điền từ login response) |
| `landlord_username` | `landlord` | (hoặc username thực tế) |
| `landlord_password` | `password123` | (hoặc password thực tế) |
| `tenant_username` | `tenant1` | (hoặc username thực tế) |
| `tenant_password` | `password123` | (hoặc password thực tế) |

#### Bước 2: Lưu Environment
- Nhấp **Save**
- Chọn environment này từ dropdown góc trên bên phải

---

## 3️⃣ Kiểm Tra Endpoint Đầu Tiên: Login

### Tạo Request Login

#### Step 1: Tạo Request Mới
1. Nhấp **+** (tab mới)
2. Hoặc: Collections → right-click → Add Request

#### Step 2: Cấu Hình Request

**URL:**
```
{{base_url}}/auth/login
```

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body** (chọn `raw` → `JSON`):
```json
{
  "username": "{{landlord_username}}",
  "password": "{{landlord_password}}"
}
```

#### Step 3: Nhấp Send
- Bạn sẽ nhận response như:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123",
      "username": "landlord",
      "role": "landlord"
    }
  },
  "message": "Đăng nhập thành công"
}
```

#### Step 4: Lưu Token Vào Environment

**Cách Tự Động (Sử Dụng Tests Tab):**

1. Nhấp **Tests** tab (bên cạnh Body)
2. Paste code này:

```javascript
// Kiểm tra response status
pm.test("Login successful - Status 200", function() {
    pm.response.to.have.status(200);
});

// Kiểm tra token tồn tại
pm.test("Response contains token", function() {
    let jsonData = pm.response.json();
    pm.expect(jsonData.data.token).to.exist;
});

// Lưu token vào environment variable
if (pm.response.code === 200) {
    let jsonData = pm.response.json();
    pm.environment.set("landlord_token", jsonData.data.token);
    console.log("Landlord token saved: " + jsonData.data.token.substring(0, 20) + "...");
}
```

3. Nhấp **Send** lại
4. Xem tab **Tests Results** để kiểm tra

**Cách Thủ Công:**
1. Copy token từ response
2. Vào **Environments** → chọn environment
3. Paste vào `landlord_token` value

---

## 4️⃣ Kiểm Tra Phân Quyền (Authorization)

### Cấu Trúc Header Authorization

Tất cả endpoint (ngoài login) cần header:
```
Authorization: Bearer {{landlord_token}}
```

### Tạo Request Ví Dụ: Danh Sách Người Thuê

**URL:** `{{base_url}}/tenants`  
**Method:** `GET`  

**Headers:**
```
Authorization: Bearer {{landlord_token}}
Content-Type: application/json
```

**Response (nếu LANDLORD có quyền):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "123",
      "fullName": "Nguyễn Văn A",
      "username": "tenant1",
      "role": "tenant",
      "status": "active"
    },
    // ... danh sách khác
  ],
  "message": "Lấy danh sách người thuê thành công"
}
```

---

## 5️⃣ Kiểm Tra Xác Nhận Phân Quyền

### Tình Huống 1: TENANT Cố Truy Cập Endpoint Chỉ LANDLORD

**Request:**
- URL: `{{base_url}}/tenants`
- Method: `GET`
- Header: `Authorization: Bearer {{tenant_token}}`

**Expected Response (403 Forbidden):**
```json
{
  "success": false,
  "statusCode": 403,
  "data": null,
  "message": "Không có quyền truy cập tài nguyên này"
}
```

### Tình Huống 2: Không Có Token

**Request:**
- URL: `{{base_url}}/tenants`
- Method: `GET`
- Header: (Không có Authorization)

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "statusCode": 401,
  "data": null,
  "message": "Chưa được xác thực"
}
```

### Tình Huống 3: Token Hết Hạn / Sai

**Request:**
- URL: `{{base_url}}/tenants`
- Method: `GET`
- Header: `Authorization: Bearer invalid_token_here`

**Expected Response (401):**
```json
{
  "success": false,
  "statusCode": 401,
  "data": null,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

---

## 6️⃣ Collection Requests Mẫu

### Folder: Auth
```
├─ POST Login (LANDLORD)
├─ POST Login (TENANT)
└─ POST Logout
```

### Folder: Tenants
```
├─ GET All Tenants (LANDLORD)
├─ POST Create Tenant (LANDLORD)
├─ GET Tenant Detail (LANDLORD/OWNER)
├─ PUT Update Tenant (LANDLORD/OWNER)
├─ PATCH Toggle Tenant Status (LANDLORD)
└─ GET Search Tenants (LANDLORD)
```

### Folder: Rooms
```
├─ GET All Rooms (LANDLORD)
├─ POST Create Room (LANDLORD)
├─ GET Room Detail (LANDLORD/TENANT)
├─ PUT Update Room (LANDLORD)
├─ DELETE Room (LANDLORD)
├─ GET My Room (TENANT)
└─ GET Search Rooms (LANDLORD)
```

### Folder: Contracts
```
├─ GET All Contracts (LANDLORD)
├─ POST Create Contract (LANDLORD)
├─ GET Contract Detail (LANDLORD/TENANT_OWNER)
├─ PUT Update Contract (LANDLORD)
├─ PATCH Terminate Contract (LANDLORD)
└─ GET Search Contracts (BOTH)
```

### Folder: Invoices
```
├─ GET All Invoices (LANDLORD)
├─ POST Create Invoice (LANDLORD)
├─ GET Invoice Detail (LANDLORD/TENANT_OWNER)
├─ PUT Update Invoice (LANDLORD)
├─ PATCH Payment Confirm (LANDLORD)
├─ GET Export Invoice (LANDLORD/TENANT_OWNER)
└─ GET Search Invoices (BOTH)
```

### Folder: Services
```
├─ GET All Services (LANDLORD)
├─ POST Create Service (LANDLORD)
├─ GET Service Detail (LANDLORD)
├─ PUT Update Service (LANDLORD)
├─ DELETE Service (LANDLORD)
├─ POST Assign Service to Room (LANDLORD)
└─ DELETE Remove Service from Room (LANDLORD)
```

### Folder: Utilities
```
├─ GET Meter Readings (LANDLORD)
├─ POST Create Meter Reading (LANDLORD)
├─ GET Meter Reading Detail (LANDLORD/TENANT_OWNER)
├─ PUT Update Meter Reading (LANDLORD)
├─ GET Search Meter Readings (LANDLORD)
├─ GET Utility Rates (LANDLORD)
└─ PUT Update Utility Rates (LANDLORD)
```

### Folder: Dashboard
```
├─ GET Landlord Dashboard (LANDLORD)
├─ GET Tenant Dashboard (TENANT)
└─ GET Notifications (TENANT)
```

---

## 7️⃣ Ví Dụ Chi Tiết

### Ví Dụ 1: Tạo Hợp Đồng (LANDLORD)

**Request Setup:**

```
URL: {{base_url}}/contracts
Method: POST

Headers:
Authorization: Bearer {{landlord_token}}
Content-Type: application/json

Body (raw JSON):
{
  "tenantId": "tenant123",
  "roomId": "room456",
  "startDate": "2024-01-15",
  "endDate": "2024-12-15",
  "monthlyRent": 5000000,
  "deposit": 15000000,
  "paymentCycle": "monthly"
}
```

**Tests Tab (Kiểm Tra):**

```javascript
// Test 1: Status code
pm.test("Create contract - Status 201", function() {
    pm.response.to.have.status(201);
});

// Test 2: Response structure
pm.test("Response has contract ID", function() {
    let jsonData = pm.response.json();
    pm.expect(jsonData.data.id).to.exist;
    pm.expect(jsonData.data.status).to.equal("active");
});

// Test 3: Lưu contract ID cho request tiếp theo
if (pm.response.code === 201) {
    let jsonData = pm.response.json();
    pm.environment.set("contract_id", jsonData.data.id);
}
```

---

### Ví Dụ 2: TENANT Xem Hợp Đồng Của Mình

**Request Setup:**

```
URL: {{base_url}}/contracts/{{contract_id}}
Method: GET

Headers:
Authorization: Bearer {{tenant_token}}
Content-Type: application/json
```

**Expected:** ✅ 200 OK (nếu hợp đồng là của tenant này)

**Tests Tab:**

```javascript
pm.test("Tenant can view own contract", function() {
    pm.response.to.have.status(200);
});

pm.test("Contract data matches", function() {
    let jsonData = pm.response.json();
    pm.expect(jsonData.data.tenantId).to.equal("tenant123");
});
```

---

### Ví Dụ 3: TENANT Cố Xem Hợp Đồng Của Tenant Khác

**Request Setup:**

```
URL: {{base_url}}/contracts/other_contract_id
Method: GET

Headers:
Authorization: Bearer {{tenant_token}}
Content-Type: application/json
```

**Expected:** ❌ 403 Forbidden

**Tests Tab:**

```javascript
pm.test("Tenant cannot view other tenant's contract", function() {
    pm.response.to.have.status(403);
});

pm.test("Error message is correct", function() {
    let jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("Không có quyền");
});
```

---

## 8️⃣ Script Tự Động Lưu Token

### Pre-Request Script (Chạy Trước Request)

**Sử Dụng Khi:** Bạn muốn kiểm tra/refresh token trước mỗi request

```javascript
// Kiểm tra nếu token sắp hết hạn (tuỳ chọn)
let token = pm.environment.get("landlord_token");

if (!token) {
    console.warn("No token found. Please login first.");
}
```

### Tests Tab (Chạy Sau Response)

**Ví Dụ: Tự Động Lưu Response Data**

```javascript
// Save user ID
if (pm.response.code === 200 && pm.response.json().data.id) {
    pm.environment.set("user_id", pm.response.json().data.id);
}

// Save any list item ID
if (pm.response.code === 200 && Array.isArray(pm.response.json().data)) {
    let firstItem = pm.response.json().data[0];
    if (firstItem.id) {
        pm.environment.set("first_item_id", firstItem.id);
    }
}
```

---

## 9️⃣ Thực Hiện Test Automation

### Tạo Test Runner

1. Chọn Collection → **Run** (nút chạy ở góc dưới trái)
2. Hoặc: Collection menu → **Run collection**

**Test Settings:**

- **Iterations:** 1 (chạy bao nhiêu lần)
- **Delay:** 100ms (chờ giữa requests)
- **Environment:** Chọn Development
- **Data file:** (tuỳ chọn, cho loop requests)

**Nhấp Run:**

```
✅ Request 1: POST Login - PASS
✅ Request 2: GET Tenants - PASS  
✅ Request 3: GET Tenant Detail - PASS
✅ Request 4: PUT Update Tenant - PASS
...
```

### Export Test Results

- Nhấp **Export Results** 
- Chọn format (JSON/HTML)
- Lưu file để sharing với team

---

## 🔟 Kiểm Tra (Assertions) Thông Dụng

### Status Code

```javascript
pm.test("Status is 200", function() {
    pm.response.to.have.status(200);
});

// Multiple status codes
pm.test("Status is 200 or 201", function() {
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});
```

### Response Body

```javascript
// Check property exists
pm.test("Response has data", function() {
    pm.expect(pm.response.json().data).to.exist;
});

// Check value equals
pm.test("Role is landlord", function() {
    pm.expect(pm.response.json().data.role).to.equal("landlord");
});

// Check value includes
pm.test("Message contains success", function() {
    pm.expect(pm.response.json().message).to.include("thành công");
});

// Check array length
pm.test("At least one item in response", function() {
    pm.expect(pm.response.json().data).to.have.lengthOf.above(0);
});
```

### Response Time

```javascript
pm.test("Response time is less than 500ms", function() {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

### Response Headers

```javascript
pm.test("Has Content-Type header", function() {
    pm.response.to.have.header("Content-Type");
});

pm.test("Content-Type is JSON", function() {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});
```

---

## 1️⃣1️⃣ Workflow Kiểm Tra Thực Tế

### Workflow 1: Test Phân Quyền

```
1. GET {{base_url}}/health
   ✅ Verify server running

2. POST {{base_url}}/auth/login (LANDLORD)
   ✅ Verify token received
   💾 Save landlord_token

3. POST {{base_url}}/auth/login (TENANT)
   ✅ Verify token received
   💾 Save tenant_token

4. GET {{base_url}}/tenants (with landlord_token)
   ✅ Expect: 200 OK + full list

5. GET {{base_url}}/tenants (with tenant_token)
   ❌ Expect: 403 Forbidden

6. GET {{base_url}}/tenants (without token)
   ❌ Expect: 401 Unauthorized

7. GET {{base_url}}/tenants (with invalid token)
   ❌ Expect: 401 Unauthorized
```

### Workflow 2: Test CRUD Operations

```
1. POST /tenants (LANDLORD - Create)
   ✅ Verify: 201 + tenant ID
   💾 Save tenant_id

2. GET /tenants/{{tenant_id}} (LANDLORD - Read)
   ✅ Verify: 200 + correct data

3. PUT /tenants/{{tenant_id}} (LANDLORD - Update)
   ✅ Verify: 200 + updated data

4. GET /tenants/{{tenant_id}} (TENANT_OWNER - Read Own)
   ✅ Verify: 200 (if owner)

5. DELETE /tenants/{{tenant_id}} (LANDLORD - Delete)
   ✅ Verify: 200 + deleted
```

### Workflow 3: Test Access Control

```
1. Create Resource (as LANDLORD)
2. Try Read (as LANDLORD)
   ✅ 200 OK
3. Try Read (as TENANT - owner)
   ✅ 200 OK
4. Try Read (as TENANT - not owner)
   ❌ 403 Forbidden
5. Try Update (as TENANT)
   ❌ 403 Forbidden
6. Try Update (as LANDLORD)
   ✅ 200 OK
```

---

## 1️⃣2️⃣ Tips & Tricks

###💡 Tip 1: Sử Dụng Biến Để Tái Sử Dụng

**Thay vì:**
```
POST http://localhost:5000/api/v1/auth/login
```

**Dùng:**
```
POST {{base_url}}/auth/login
```

### 💡 Tip 2: Mock Data Sẵn Sàng

Tạo một tab có sẵn body JSON thường dùng:

```json
// CREATE TENANT
{
  "username": "tenant_{{$randomInt}}",
  "password": "password123",
  "fullName": "Nguyễn {{$randomFirstName}}",
  "phone": "{{$randomInt(900000000,999999999)}}",
  "email": "{{$randomEmail}}"
}

// CREATE ROOM
{
  "roomNumber": "{{$randomInt(100,999)}}",
  "floor": "{{$randomInt(1,10)}}",
  "area": "{{$randomInt(20,50)}}",
  "price": "{{$randomInt(3000000,10000000)}}"
}
```

### 💡 Tip 3: Organize Requests Theo Folder

```
BCK Manager API v1
├─ [SETUP]
│  └─ Health Check
│  └─ Login Tests
├─ [AUTH]
│  └─ Login LANDLORD
│  └─ Login TENANT
│  └─ Logout
├─ [TENANTS]
│  ├─ LANDLORD Endpoints
│  ├─ TENANT Endpoints
│  └─ Permission Tests
├─ [ROOMS]
├─ [CONTRACTS]
├─ [INVOICES]
└─ [ERROR CASES]
   └─ 401 Tests
   └─ 403 Tests
   └─ 404 Tests
```

### 💡 Tip 4: Batch Testing

**Chạy 10 requests cùng lúc:**

1. Chọn Collection
2. **Run** 
3. Set **Iterations** = 10
4. Xem report

### 💡 Tip 5: Export/Import Collection

**Export:**
1. Collection → **...** → Export
2. Chọn format (v2.1)
3. Lưu file

**Import:**
1. **Import** (top left)
2. Chọn file
3. Done!

---

## 1️⃣3️⃣ Common Issues & Solutions

| Issue | Nguyên Nhân | Giải Pháp |
|-------|-----------|----------|
| 404 Not Found | URL sai | Kiểm tra base_url, endpoint path |
| 401 Unauthorized | Token sai/hết hạn | Login lại, copy token mới |
| 403 Forbidden | Không có quyền | Kiểm tra role, dùng đúng token |
| Connection refused | Server chưa start | Chạy `npm start` trong server |
| CORS error | (Frontend only) | N/A (Postman không bị CORS) |
| Timeout | Server chậy | Kiểm tra điều kiện mạng, database |

---

## 1️⃣4️⃣ Checklist Trước Khi Deploy

- [ ] Test tất cả 38+ endpoints
- [ ] Test authorization (403 cases)
- [ ] Test authentication (401 cases)
- [ ] Test invalid input (validation)
- [ ] Test response time < 500ms
- [ ] Test LANDLORD role → pass all
- [ ] Test TENANT role → pass your data only
- [ ] Test without token → 401
- [ ] Test invalid token → 401
- [ ] Test database operations (create, update, delete)
- [ ] Test searching/filtering
- [ ] Export test results

---

## 📞 Ví Dụ File Postman Collection

**File:** `BCK_Manager_API_Tests.postman_collection.json`

```json
{
  "info": {
    "name": "BCK Manager API v1",
    "version": "1.0.0"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{landlord_token}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"username\":\"landlord\",\"password\":\"password123\"}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🚀 Tóm Tắt

1. ✅ Tạo Environment (base_url, tokens, credentials)
2. ✅ Login để lấy token
3. ✅ Sử dụng token trong Authorization header
4. ✅ Thêm Tests tab để verify responses
5. ✅ Test authorization (LANDLORD vs TENANT)
6. ✅ Run collection để automation test
7. ✅ Export results để sharing

**Bây giờ bạn đã sẵn sàng test BBK Manager API! 🎉**
