import Link from "next/link";
export default function Forbidden(){return <main className="mx-auto max-w-lg px-6 py-24"><h1 className="text-3xl font-bold">403 · Không đủ quyền</h1><p className="my-5">Tài khoản của bạn không có quyền truy cập trang quản trị.</p><Link href="/systems">Trở về danh sách hệ thống</Link></main>;}
