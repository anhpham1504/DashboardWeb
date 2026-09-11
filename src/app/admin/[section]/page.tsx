import { notFound } from "next/navigation";
import { guardAdminPage } from "@/lib/auth";
import { AdminPanel } from "@/components/admin/admin-panel";
import { entitySchema } from "@/schemas/admin.schema";
export const metadata = {
  title: "Quản trị · Cổng sản phẩm CNTT",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const user = await guardAdminPage();
  const result = entitySchema.safeParse((await params).section);
  if (!result.success) notFound();
  return (
    <AdminPanel
      section={result.data}
      fullName={user.fullName}
      localUploadEnabled={process.env.STORAGE_DRIVER === "local"}
    />
  );
}
