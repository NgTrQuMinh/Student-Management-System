# Student Management System

RESTful API quản lý sinh viên, lớp học, môn học và đăng ký môn học, xây dựng bằng
Node.js, Express 5 và MongoDB.

## Tính năng

- CRUD lớp học, môn học, sinh viên và đăng ký môn học.
- Đăng ký, đăng nhập bằng JWT; mật khẩu được băm bằng bcrypt.
- Phân quyền: người dùng đã đăng nhập được đọc dữ liệu, chỉ admin được ghi.
- Validate dữ liệu bằng Zod với thông báo lỗi tiếng Việt.
- Phân trang, sắp xếp, tìm kiếm và lọc danh sách.
- Xóa mềm sinh viên, lớp học và môn học bằng mongoose-delete.
- Middleware bảo mật, nén response, rate limit và xử lý lỗi tập trung.
- Test tích hợp bằng Jest, Supertest và MongoDB in-memory.

## Công nghệ

| Thành phần      | Thư viện                                 |
| --------------- | ---------------------------------------- |
| Runtime         | Node.js >= 18                            |
| Web framework   | Express 5                                |
| Database        | MongoDB + Mongoose 9                     |
| Xác thực        | jsonwebtoken + bcryptjs                  |
| Validate        | Zod                                      |
| Bảo mật         | helmet, cors, express-rate-limit         |
| Test            | Jest + Supertest + mongodb-memory-server |
| Chất lượng code | ESLint + Prettier                        |

## Cấu trúc thư mục

```
src/
  app.js                 # Khởi tạo Express app và middleware
  server.js              # Kết nối DB, listen và graceful shutdown
  config/                # Cấu hình môi trường, kết nối MongoDB
  controllers/           # Nhận request, gọi service, trả response
  middlewares/           # Auth, validate, xử lý lỗi, 404
  models/                # Mongoose schema
  routes/                # Khai báo route
  services/              # Nghiệp vụ và truy vấn dữ liệu
  utils/                 # Tiện ích dùng chung
  validators/            # Zod schema
scripts/
  create-admin.js        # Tạo tài khoản admin
tests/                   # Test tích hợp
```

## Cài đặt

```bash
git clone https://github.com/NgTrQuMinh/Student-Management-System.git
cd Student-Management-System
npm install
```

Tạo file môi trường:

```bash
cp .env.example .env
```

Trên Windows PowerShell có thể dùng:

```powershell
Copy-Item .env.example .env
```

Sửa `.env` cho phù hợp, tối thiểu cần:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/student_management
JWT_SECRET=doi-thanh-chuoi-bi-mat-dai-va-ngau-nhien
```

## Chạy ứng dụng

```bash
npm run dev     # chế độ phát triển, tự khởi động lại khi sửa code
npm start       # chạy production
```

Mặc định API chạy tại `http://localhost:3000/api/v1`.

Kiểm tra nhanh:

```bash
curl http://localhost:3000/api/v1/health
```

## Tạo tài khoản admin

Đặt `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` trong `.env`, sau đó chạy:

```bash
npm run create-admin
```

Script sẽ bỏ qua nếu email đã tồn tại.

## Xác thực

Đăng ký tài khoản (mặc định role `user`):

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "a@example.com",
  "password": "password123"
}
```

Đăng nhập:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "a@example.com",
  "password": "password123"
}
```

Cả hai API trả về `token`. Gửi token trong header cho các API được bảo vệ:

```http
Authorization: Bearer <token>
```

- `GET` tài nguyên: cần đăng nhập.
- `POST`, `PATCH`, `DELETE` tài nguyên: cần role `admin`.

## Danh sách API

Tất cả endpoint nằm dưới tiền tố `/api/v1`.

### Health

| Method | Endpoint  | Quyền     |
| ------ | --------- | --------- |
| GET    | `/health` | Công khai |

### Auth

| Method | Endpoint         | Quyền        |
| ------ | ---------------- | ------------ |
| POST   | `/auth/register` | Công khai    |
| POST   | `/auth/login`    | Công khai    |
| GET    | `/auth/me`       | Đã đăng nhập |

### Lớp học

| Method | Endpoint                   | Quyền        |
| ------ | -------------------------- | ------------ |
| GET    | `/classes`                 | Đã đăng nhập |
| POST   | `/classes`                 | Admin        |
| GET    | `/classes/:id`             | Đã đăng nhập |
| PATCH  | `/classes/:id`             | Admin        |
| DELETE | `/classes/:id`             | Admin        |
| GET    | `/classes/:id/enrollments` | Đã đăng nhập |

### Môn học

| Method | Endpoint                   | Quyền        |
| ------ | -------------------------- | ------------ |
| GET    | `/courses`                 | Đã đăng nhập |
| POST   | `/courses`                 | Admin        |
| GET    | `/courses/:id`             | Đã đăng nhập |
| PATCH  | `/courses/:id`             | Admin        |
| DELETE | `/courses/:id`             | Admin        |
| GET    | `/courses/:id/enrollments` | Đã đăng nhập |

### Sinh viên

| Method | Endpoint                    | Quyền        |
| ------ | --------------------------- | ------------ |
| GET    | `/students`                 | Đã đăng nhập |
| POST   | `/students`                 | Admin        |
| GET    | `/students/:id`             | Đã đăng nhập |
| PATCH  | `/students/:id`             | Admin        |
| DELETE | `/students/:id`             | Admin        |
| GET    | `/students/:id/enrollments` | Đã đăng nhập |

### Đăng ký môn học

| Method | Endpoint           | Quyền        |
| ------ | ------------------ | ------------ |
| GET    | `/enrollments`     | Đã đăng nhập |
| POST   | `/enrollments`     | Admin        |
| GET    | `/enrollments/:id` | Đã đăng nhập |
| PATCH  | `/enrollments/:id` | Admin        |
| DELETE | `/enrollments/:id` | Admin        |

## Truy vấn danh sách

Các endpoint `GET` dạng danh sách hỗ trợ:

| Tham số  | Ý nghĩa                                           | Mặc định     |
| -------- | ------------------------------------------------- | ------------ |
| `page`   | Trang hiện tại                                    | `1`          |
| `limit`  | Số bản ghi mỗi trang (tối đa 100)                 | `10`         |
| `sort`   | Sắp xếp, ví dụ `sort=name` hoặc `sort=-createdAt` | `-createdAt` |
| `search` | Tìm kiếm theo các trường text của tài nguyên      |              |
| `status` | Lọc theo trạng thái                               |              |

Một số tài nguyên có bộ lọc riêng:

- Sinh viên: `classId`, `gender`.
- Đăng ký môn học: `studentId`, `courseId`.

Ví dụ:

```http
GET /api/v1/students?page=1&limit=10&classId=...&search=nguyen&sort=fullName
```

## Định dạng response

Thành công:

```json
{
    "success": true,
    "message": "Tạo sinh viên thành công",
    "data": {},
    "pagination": {
        "total": 100,
        "page": 1,
        "limit": 10,
        "totalPages": 10,
        "hasNextPage": true,
        "hasPrevPage": false
    }
}
```

Lỗi:

```json
{
    "success": false,
    "message": "Dữ liệu không hợp lệ",
    "errors": [
        {
            "field": "email",
            "message": "Email không hợp lệ"
        }
    ]
}
```

## Test và lint

```bash
npm test
npm run lint
npm run format:check
```

Test dùng MongoDB in-memory nên không cần cài MongoDB thật. Lần chạy đầu tiên,
`mongodb-memory-server` có thể tải binary MongoDB (khoảng 600MB).

## Ghi chú

- File `.env` không được commit lên git.
- Dự án vẫn đọc được các biến cũ trong `.env` như `URL`, `DB_NAME`, `user`, `pass`
  để tương thích khi nâng cấp.
- Đổi `JWT_SECRET` khi triển khai production.
