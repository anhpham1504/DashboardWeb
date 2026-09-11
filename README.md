# Cổng sản phẩm CNTT – FPT Polytechnic

Cổng trưng bày và truy cập nhanh các website do sinh viên bộ môn Công nghệ thông tin thực hiện. Khách có thể xem sản phẩm mà không đăng nhập; tài khoản `ADMIN` quản lý website, danh mục, người dùng và lịch sử thao tác tại `/admin`.

## Công nghệ

- Next.js 16 App Router, React 19 và TypeScript strict
- Tailwind CSS 4, CSS Modules, Radix UI và `next-themes`
- Prisma 6 với MySQL 8 (`utf8mb4`, thời gian lưu theo UTC)
- Zod tại server boundary, Argon2id và opaque session lưu trong MySQL
- Playwright E2E và Node test runner qua `tsx`

`Website` là thực thể sản phẩm duy nhất. Không có bảng `Product` trùng dữ liệu.

## Yêu cầu

- Node.js 22.5+; khuyến nghị Node.js 24 LTS vì script import dùng `node:sqlite`
- npm
- MySQL 8.0+
- Một database và user ứng dụng có quyền tối thiểu trên đúng database đó

## Cài đặt

```bash
npm install
```

Sao chép `.env.example` thành `.env`, sau đó thay `DATABASE_URL` và các giá trị phù hợp. `.env` bị Git bỏ qua và không được gửi qua GitHub.

Các biến bắt buộc khi chạy ứng dụng:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `APP_ORIGINS`

Các biến bảo mật/vận hành có giá trị mặc định an toàn cho một instance:

- `SESSION_HOURS`
- `LOGIN_WINDOW_MINUTES`
- `LOGIN_IP_LIMIT`
- `LOGIN_ACCOUNT_LIMIT`
- `LOGIN_LOCK_THRESHOLD`
- `LOGIN_LOCK_MINUTES`
- `TRUST_PROXY`
- `STORAGE_DRIVER`
- `MAX_UPLOAD_MB`

Chỉ đặt `TRUST_PROXY=true` khi ứng dụng thực sự đứng sau reverse proxy tin cậy đã ghi đè `X-Forwarded-For`.

## Tạo database và user quyền tối thiểu

Chạy bằng tài khoản quản trị MySQL. Không đặt mật khẩu trực tiếp trong lịch sử lệnh; dùng prompt `-p` hoặc login path của `mysql_config_editor`.

```sql
CREATE DATABASE fpt_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'fpt_dashboard_app'@'localhost' IDENTIFIED BY 'mat-khau-ngau-nhien-dai';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES
ON fpt_dashboard.* TO 'fpt_dashboard_app'@'localhost';
FLUSH PRIVILEGES;
```

Ứng dụng không cần quyền quản trị toàn MySQL và không cần quyền `DROP` trong vận hành thông thường.

## Migration và import SQLite

Tạo Prisma Client và triển khai migration chính thức:

```bash
npm run db:generate
npm run db:migrate
```

Lệnh migration dùng `prisma migrate deploy`; không reset hoặc xóa database.

Để chuyển dữ liệu SQLite cũ, đặt `SQLITE_SOURCE` tới file nguồn rồi chạy:

```bash
npm run db:import
```

Import có thể chạy lặp: bản ghi được nhận diện bằng ID nguồn, dữ liệu đã tồn tại không bị ghi đè. Hai bản ghi Victionary English được giữ nguyên; chỉ bản ổn định đầu tiên theo `createdAt`/ID được đánh dấu nổi bật khi import mới. Script dừng và báo lỗi nếu URL, danh mục hoặc dữ liệu nguồn không hợp lệ.

## Tạo admin đầu tiên

Không có mật khẩu mặc định trong source. Cung cấp credential qua biến môi trường cục bộ:

```powershell
$env:ADMIN_USERNAME = "admin"
$env:ADMIN_NAME = "Quản trị viên"
$env:ADMIN_EMAIL = ""
$securePassword = Read-Host "Mật khẩu tạm" -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
  $env:ADMIN_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
  npm run admin:create
} finally {
  Remove-Item Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
}
```

Mật khẩu phải dài 8–128 ký tự và được hash bằng Argon2id. CLI chỉ tạo admin khi chưa có admin đang hoạt động. Tài khoản phải đổi mật khẩu tạm ở lần đăng nhập đầu tiên.

## Chạy dự án

```bash
npm run dev
```

Mở `http://localhost:3000`. Trên Windows có thể chạy `run.bat`; script không tự import dữ liệu và không tự tạo admin.

Production:

```bash
npm run build
npm start
```

## Ảnh logo và poster

Hai cách được hỗ trợ:

1. `STORAGE_DRIVER=url` (mặc định): admin nhập URL HTTPS hoặc đường dẫn tài nguyên nội bộ.
2. `STORAGE_DRIVER=local`: upload PNG/JPEG/WebP, kiểm tra MIME thực, phần mở rộng, dung lượng và kích thước, sau đó chuyển thành WebP trong `public/uploads`.

Chỉ dùng storage local khi máy chủ có ổ đĩa bền vững và quy trình sao lưu thư mục `public/uploads`. Với server stateless hoặc nhiều instance, dùng URL từ object storage/CDN; không dùng ổ đĩa local.

## Backup và rollback

Trước migration/import, sao lưu bằng `mysqldump` với prompt mật khẩu hoặc login path:

```powershell
New-Item -ItemType Directory -Force -Path backups | Out-Null
mysqldump --login-path=fpt-dashboard-backup --single-transaction --routines --triggers --set-gtid-purged=OFF fpt_dashboard --result-file=backups/fpt_dashboard-before-migration.sql
```

Kiểm tra file backup khác rỗng và thử restore vào một database kiểm thử trước khi thay đổi production.

Prisma không tự tạo down migration. Nếu cần rollback:

1. Dừng ghi dữ liệu vào ứng dụng.
2. Tạo database phục hồi mới; không ghi đè database đang lỗi.
3. Restore bản dump vào database mới bằng `mysql --login-path=... restored_database < backup.sql`.
4. Kiểm tra số lượng/dữ liệu và migration history.
5. Trỏ `DATABASE_URL` về database đã phục hồi rồi khởi động lại.

Không chạy `prisma migrate reset`, `DROP DATABASE` hoặc sửa bảng production bằng tay.

## Dọn session và rate limit

Có thể chạy định kỳ:

```bash
npm run sessions:cleanup
```

Rate limit dùng MySQL nên dùng được với nhiều instance. Storage ảnh local thì không hỗ trợ nhiều instance nếu không có shared persistent volume.

## Kiểm thử

Tạo database kiểm thử riêng trên MySQL cục bộ với tên bắt đầu bằng `fpt_dashboard_test_`, cấp quyền cho user ứng dụng, đặt `DATABASE_URL` tới database này rồi chạy:

```bash
npm run db:migrate
npm run db:import
npm run lint
npm run typecheck
npm run test:unit
npm run test:integration
npm run db:import
npm run test:e2e
npm run build
npm audit
```

Các script integration/E2E chỉ chấp nhận MySQL trên `localhost`/`127.0.0.1` và database có tên bắt đầu bằng `fpt_dashboard_test_`. Test integration dọn dữ liệu trong database kiểm thử; tuyệt đối không trỏ nó vào production.

Playwright kiểm tra các viewport 320, 375, 768, 1024 và 1280 px, light/dark mode, public directory, role guard và luồng CRUD admin.

## Route chính

- `/`: triển lãm năm sản phẩm nổi bật
- `/systems`: tìm kiếm, lọc, sắp xếp và grid/list
- `/systems/[slug]`: poster, nội dung giới thiệu và nút truy cập từng sản phẩm
- `/categories`: danh mục công khai
- `/about`: giới thiệu bộ môn
- `/admin/login`: đăng nhập bằng username
- `/admin`: dashboard quản trị
- `/admin/websites`, `/admin/categories`, `/admin/users`, `/admin/audit`: quản lý dữ liệu

## Bảo mật vận hành

- Không commit `.env`, database, backup, credential hoặc nội dung `public/uploads`.
- Rotate credential nếu secret thật từng xuất hiện trong commit/log/chia sẻ ngoài phạm vi tin cậy.
- Session cookie là `HttpOnly`, `SameSite=Lax`, `Secure` ở production; database chỉ lưu token hash.
- Mọi API admin kiểm tra session và role ở server; ẩn nút trên UI không được xem là phân quyền.
- Request thay đổi dữ liệu yêu cầu origin nằm trong `APP_ORIGINS`.
- CSP hiện cho phép inline script/style theo mô hình tương thích static rendering của Next.js; rà soát nonce CSP riêng nếu chính sách triển khai yêu cầu mức chặt hơn.

Repository trước đây từng theo dõi `.env`, nhưng lịch sử đã kiểm tra chỉ chứa URL SQLite cục bộ, không phát hiện credential MySQL hoặc secret. Từ phiên bản này `.env` và database được bỏ khỏi chỉ mục Git; lịch sử Git không bị rewrite.

## Hoãn sang phiên bản 2

- Đăng ký công khai
- Hồ sơ người dùng thông thường
- Website yêu thích
- Lịch sử truy cập
