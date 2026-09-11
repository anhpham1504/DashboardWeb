# Báo cáo nghiệm thu phiên bản 1

Ngày xác minh: 10/09/2026

Repository chuẩn: `C:\Code\Dashboard\DashboardWeb`

Nhánh làm việc: `dev`

## 1. Chức năng đã hoàn thành

- Trang công khai đọc dữ liệu MySQL: trang chủ, thư mục hệ thống, danh mục và trang giới thiệu riêng theo slug.
- Năm sản phẩm nổi bật: Anh Em Motor, My Interview, V-Shield, Victionary English và SHB Agents.
- Tìm kiếm, lọc danh mục, lọc nổi bật, sắp xếp, grid/list và light/dark mode.
- Đăng nhập bằng username, đăng xuất, đổi mật khẩu bắt buộc và phân quyền `USER`/`ADMIN`.
- Nút đăng nhập quản trị hiển thị trực tiếp trên header desktop/tablet và trong menu mobile.
- Dashboard quản trị dùng dữ liệu thật; CRUD website, danh mục, tài khoản và xem AuditLog.
- Quản lý URL, logo, poster, thứ tự, trạng thái hiển thị và cờ nổi bật.
- Upload PNG/JPEG/WebP có kiểm tra nội dung khi `STORAGE_DRIVER=local`; chế độ mặc định dùng URL phù hợp máy chủ stateless.

## 2. Kiến trúc và dữ liệu

- Giữ Next.js 16 App Router, React 19, TypeScript strict và Prisma 6/MySQL 8.
- `Website` là thực thể sản phẩm duy nhất; không tạo bảng `Product`.
- Session opaque lưu hash trong MySQL; cookie chỉ chứa token thô ở trình duyệt.
- Thời gian database và test được chuẩn hóa UTC; chuỗi Unicode dùng `utf8mb4`.

## 3. Migration và import

- Migration baseline: `20260910090000_mysql_auth`.
- Migration nâng cấp additive: `20260910140000_username_and_security_indexes`.
- Đã xác minh migration trên database kiểm thử sạch và nâng cấp từ baseline cũ có user tồn tại. Database MySQL cục bộ `fpt_dashboard` cũng đã được áp dụng migration additive còn thiếu; số user trước và sau migration đều bằng 0.
- Import chạy lặp không ghi đè chỉnh sửa đích và không nhân bản: kết quả 4 danh mục, 10 website, 5 nổi bật, 2 bản Victionary; đúng một bản Victionary nổi bật.
- Không reset, drop hoặc sửa thủ công database thật.

## 4. Bảo mật

- Argon2id; mật khẩu admin đầu tiên chỉ nhận qua environment/CLI, không có mật khẩu mặc định.
- Session rotation, revoke, hết hạn, cookie `HttpOnly`/`SameSite=Lax`/`Secure` ở production.
- Lockout và rate limit dùng MySQL theo IP/tài khoản; transaction và khóa ghi bảo vệ cạnh tranh.
- Mọi trang/API admin kiểm tra session và role ở server; khách nhận `401`, `USER` nhận `403`.
- Zod strict chống mass assignment; chỉ cho URL HTTP(S) không credential; origin protection chống CSRF.
- AuditLog cho thao tác nhạy cảm; response không trả `passwordHash`, token session hoặc secret.
- Bảo vệ admin hoạt động cuối cùng và thu hồi session khi khóa/đổi quyền/reset mật khẩu.
- Upload giới hạn dung lượng, MIME thực, loại file, kích thước ảnh và dọn file dở khi transaction lỗi.

## 5. Các khu vực file chính

- Schema/migration: `prisma/mysql/`.
- Script vận hành: `scripts/import-sqlite.ts`, `scripts/create-admin.ts`, `scripts/cleanup.ts`.
- Auth/bảo mật: `src/lib/auth.ts`, `src/lib/password.ts`, `src/lib/login-security.ts`, `src/app/api/auth/[action]/route.ts`.
- Admin: `src/app/admin/`, `src/app/api/admin/`, `src/components/admin/`, `src/services/admin.service.ts`.
- Công khai: `src/app/systems/[slug]/page.tsx`, các component website/marketing và public API/service.
- Test: `tests/unit/security.test.ts`, `tests/integration/api.test.ts`, `tests/e2e/`.
- Vận hành: `.env.example`, `README.md`, `run.bat`.

## 6. Kiểm thử và kết quả

- `npm run db:generate`: pass, Prisma Client 6.19.3.
- `npm run db:migrate`: pass, 2 migration, không còn migration chờ.
- `npx prisma migrate status --schema prisma/mysql/schema.prisma`: database up to date.
- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm test`: pass.
  - Unit: 9/9 pass.
  - Integration/API: 10/10 pass.
  - Playwright: 70 pass, 40 skip có chủ đích theo project, 0 fail; tổng 110 trường hợp trên 5 viewport.
- Import chạy liên tiếp hai lần: vẫn 10 website, 5 nổi bật, 2 Victionary.
- `npm run admin:create` trên database nâng cấp thử nghiệm: pass; role ADMIN, bắt buộc đổi mật khẩu, hash Argon2id.
- `npm run admin:create` trên database MySQL cục bộ: pass; tài khoản `admin` hoạt động, đăng nhập chuyển tới `/change-password` và đăng xuất thành công.
- `npm run sessions:cleanup`: pass.
- `npm run build`: pass, 16 trang tĩnh được tạo và các route động được biên dịch.
- `npm audit --audit-level=low`: 0 vulnerability.
- `git diff --check`: pass; chỉ có cảnh báo chuyển LF/CRLF của Git trên Windows.

## 7. Chạy dự án

1. `npm install`
2. Sao chép `.env.example` thành `.env` và điền biến môi trường cục bộ.
3. `npm run db:generate`
4. `npm run db:migrate`
5. Nếu chuyển dữ liệu cũ: `npm run db:import`
6. Tạo admin đầu tiên theo hướng dẫn environment/CLI trong README: `npm run admin:create`
7. Development: `npm run dev` hoặc `run.bat`; production: `npm run build` rồi `npm start`.

## 8. Biến môi trường

- Bắt buộc: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `APP_ORIGINS`.
- Vận hành/bảo mật: `SESSION_HOURS`, `LOGIN_WINDOW_MINUTES`, `LOGIN_IP_LIMIT`, `LOGIN_ACCOUNT_LIMIT`, `LOGIN_LOCK_THRESHOLD`, `LOGIN_LOCK_MINUTES`, `TRUST_PROXY`, `STORAGE_DRIVER`, `MAX_UPLOAD_MB`.
- Import/bootstrap: `SQLITE_SOURCE`, `ADMIN_USERNAME`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
- Không ghi secret thật trong tài liệu hoặc Git.

## 9. Hạng mục còn lại

- Không còn blocker trong phạm vi phiên bản 1.
- Admin đầu tiên đã được tạo trên database MySQL cục bộ và phải đổi mật khẩu sau lần đăng nhập đầu tiên.
- Mã nguồn phiên bản 1 được quản lý trên nhánh `dev`; việc triển khai production thực hiện sau khi hợp nhất vào nhánh phát hành.
- Cần cấu hình credential production, backup thật, persistent/object storage và trusted reverse proxy tại môi trường triển khai.
- Đăng ký công khai, hồ sơ USER, yêu thích và lịch sử truy cập được hoãn sang phiên bản 2.

## 10. Kết luận

Đủ điều kiện nghiệm thu kỹ thuật phiên bản 1 ở môi trường local/test. Việc nghiệm thu production chỉ thực hiện sau khi cấu hình hạ tầng, backup và credential riêng của môi trường triển khai.
