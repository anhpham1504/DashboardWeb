import { guardAdminPage } from "@/lib/auth";
import { AdminPanel } from "@/components/admin/admin-panel";
export const metadata = {
  title: "Quản trị · Cổng sản phẩm CNTT",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const user = await guardAdminPage();
  return (
    <AdminPanel
      section="dashboard"
      fullName={user.fullName}
      localUploadEnabled={process.env.STORAGE_DRIVER === "local"}
    />
  );
}
