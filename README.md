# FPT Digital Showcase

Website marketing tĩnh giới thiệu các sản phẩm số của sinh viên bộ môn Công nghệ thông tin, FPT Polytechnic Đồng Nai.

## Nội dung

- Trang chủ triển lãm 5 sản phẩm: Anh Em Motor, My Interview, V-Shield, Victionary English và SHB Agents.
- Danh mục sản phẩm, trang chi tiết tĩnh và liên kết truy cập website thật.
- Tìm kiếm, lọc, sắp xếp và chuyển chế độ lưới/danh sách hoàn toàn trong trình duyệt.
- Trang giới thiệu bộ môn, dark mode và giao diện responsive.

## Công nghệ

- Next.js 16 App Router, React 19, TypeScript và Tailwind CSS 4.
- Dữ liệu tĩnh tại `src/data/products.ts`; không dùng API, database hoặc xác thực.
- Next.js static export (`output: "export"`) tạo thư mục `out/`.
- Playwright kiểm tra chức năng, responsive, light/dark mode và accessibility.

## Phát triển cục bộ

Yêu cầu Node.js 22 trở lên và npm.

```bash
npm ci
npm run dev
```

Mở `http://localhost:3000/`. Không cần tạo `.env`; `.env.example` chỉ mô tả các biến public tùy chọn.

## Kiểm tra và build

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Build mặc định sinh `out/index.html`. Để mô phỏng chính xác GitHub Pages dưới `/DashboardWeb`, đặt ba biến sau trước khi build:

```powershell
$env:PAGES_BASE_PATH = "/DashboardWeb"
$env:NEXT_PUBLIC_BASE_PATH = "/DashboardWeb"
$env:NEXT_PUBLIC_SITE_URL = "https://anhpham1504.github.io/DashboardWeb/"
npm run build
npm run preview
```

Preview chạy tại `http://127.0.0.1:4173/DashboardWeb/`.

## GitHub Pages

Workflow `.github/workflows/deploy-pages.yml` chạy khi push lên `main` hoặc được kích hoạt thủ công. Workflow cài dependencies, lint, test, build static export, tải artifact `out/` và triển khai bằng GitHub Pages Actions.

Website production: <https://anhpham1504.github.io/DashboardWeb/>

Phiên bản full-stack cũ được lưu tại nhánh `archive/fullstack-mysql`.
