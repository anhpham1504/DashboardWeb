"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Menu,
  Plus,
  Pencil,
  Eye,
  Trash2,
  KeyRound,
  LayoutDashboard,
  Globe,
  Folder,
  Users,
  History,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { Brand, ThemeToggle } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { apiRequest } from "@/lib/client-api";
import {
  websiteAdminSchema,
  categoryAdminSchema,
  userCreateSchema,
  userUpdateSchema,
  resetPasswordSchema,
} from "@/schemas/admin.schema";
import styles from "./admin.module.css";
type Section = "dashboard" | "websites" | "categories" | "users" | "audit";
type Row = {
  id: string;
  name?: string;
  fullName?: string;
  username?: string;
  email?: string | null;
  slug?: string;
  description?: string;
  shortDescription?: string;
  url?: string;
  logoUrl?: string;
  posterUrl?: string;
  keywords?: string;
  categoryId?: string;
  sortOrder?: number;
  displayOrder?: number;
  isFeatured?: boolean;
  isVisible?: boolean;
  role?: "USER" | "ADMIN";
  status?: "ACTIVE" | "LOCKED";
  action?: string;
  entityType?: string;
  entityId?: string;
  createdAt?: string;
  actor?: { fullName: string } | null;
  _count?: { websites: number };
};
const nav = [
  ["dashboard", "Tổng quan", LayoutDashboard],
  ["websites", "Website / Sản phẩm", Globe],
  ["categories", "Danh mục", Folder],
  ["users", "Tài khoản", Users],
  ["audit", "Lịch sử thao tác", History],
] as const;
const blankWebsite = {
  name: "",
  slug: "",
  url: "",
  shortDescription: "",
  description: "",
  logoUrl: "",
  posterUrl: "",
  keywords: "",
  categoryId: "",
  displayOrder: 0,
  isFeatured: false,
  isVisible: true,
};
const blankCategory = {
  name: "",
  slug: "",
  description: "",
  displayOrder: 0,
  isVisible: true,
};
const blankUser = {
  fullName: "",
  username: "",
  email: "",
  role: "USER",
  status: "ACTIVE",
};
const detailLabels: Record<string, string> = {
  name: "Tên",
  fullName: "Họ và tên",
  username: "Tên đăng nhập",
  email: "Email",
  slug: "Slug",
  description: "Mô tả đầy đủ",
  shortDescription: "Mô tả ngắn",
  url: "URL truy cập",
  logoUrl: "URL logo",
  posterUrl: "URL poster",
  keywords: "Từ khóa",
  categoryId: "Mã danh mục",
  sortOrder: "Thứ tự",
  displayOrder: "Thứ tự",
  isFeatured: "Nổi bật",
  isVisible: "Hiển thị",
  role: "Vai trò",
  status: "Trạng thái",
  action: "Thao tác",
  entityType: "Loại dữ liệu",
  entityId: "Mã dữ liệu",
  createdAt: "Thời điểm tạo",
};
type FormData = Record<string, string | number | boolean>;
export function AdminPanel({
  section,
  fullName,
  localUploadEnabled = false,
}: {
  section: Section;
  fullName: string;
  localUploadEnabled?: boolean;
}) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]),
    [total, setTotal] = useState(0),
    [kpis, setKpis] = useState<Record<string, number>>({}),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [page, setPage] = useState(1),
    [search, setSearch] = useState(""),
    [visible, setVisible] = useState("all"),
    [role, setRole] = useState("all"),
    [status, setStatus] = useState("all"),
    [category, setCategory] = useState(""),
    [sort, setSort] = useState("order");
  const [categories, setCategories] = useState<Row[]>([]),
    [mobile, setMobile] = useState(false),
    [open, setOpen] = useState(false),
    [editing, setEditing] = useState<Row | null>(null),
    [detail, setDetail] = useState<Row | null>(null),
    [deleting, setDeleting] = useState<Row | null>(null),
    [reset, setReset] = useState(false),
    [form, setForm] = useState<FormData>({}),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams({
        page: String(page),
        pageSize: "20",
        search,
        visible,
        role,
        status,
        sort,
      });
      if (category) q.set("categoryId", category);
      if (section === "dashboard")
        setKpis(
          await apiRequest<Record<string, number>>("/api/admin/dashboard"),
        );
      else {
        const data = await apiRequest<{ items: Row[]; total: number }>(
          "/api/admin/" + section + "?" + q,
        );
        setRows(data.items);
        setTotal(data.total);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [section, page, search, visible, role, status, category, sort]);
  useEffect(() => {
    const timer = setTimeout(() => void load(), 250);
    return () => clearTimeout(timer);
  }, [load]);
  useEffect(() => {
    if (section === "websites")
      apiRequest<{ items: Row[] }>("/api/admin/categories?pageSize=100")
        .then((d) => setCategories(d.items))
        .catch(() => setError("Không thể tải danh mục."));
  }, [section]);
  function edit(row: Row | null, passwordReset = false) {
    setEditing(row);
    setReset(passwordReset);
    setErrors({});
    if (passwordReset) setForm({ password: "" });
    else if (section === "websites")
      setForm({
        ...blankWebsite,
        ...Object.fromEntries(
          Object.keys(blankWebsite).map((k) => [
            k,
            k === "displayOrder"
              ? row?.sortOrder || 0
              : (row?.[k as keyof Row] ??
                blankWebsite[k as keyof typeof blankWebsite]),
          ]),
        ),
      } as FormData);
    else if (section === "categories")
      setForm({
        ...blankCategory,
        ...Object.fromEntries(
          Object.keys(blankCategory).map((k) => [
            k,
            row?.[k as keyof Row] ??
              blankCategory[k as keyof typeof blankCategory],
          ]),
        ),
      } as FormData);
    else
      setForm({
        ...blankUser,
        fullName: row?.fullName || "",
        username: row?.username || "",
        email: row?.email || "",
        role: row?.role || "USER",
        status: row?.status || "ACTIVE",
        ...(!row ? { password: "" } : {}),
      });
    setOpen(true);
  }
  const navigation = (
    <nav aria-label="Điều hướng quản trị" className={styles.nav}>
      {nav.map(([key, label, Icon]) => (
        <Link
          key={key}
          href={key === "dashboard" ? "/admin" : "/admin/" + key}
          aria-current={key === section ? "page" : undefined}
          onClick={() => setMobile(false)}
        >
          <Icon size={18} />
          {label}
        </Link>
      ))}
      <Link href="/systems">← Xem trang công khai</Link>
    </nav>
  );
  async function logout() {
    try {
      await apiRequest("/api/auth/logout", { method: "POST", body: "{}" });
      router.replace("/admin/login");
      router.refresh();
    } catch {
      toast.error("Không thể đăng xuất. Vui lòng thử lại.");
    }
  }
  function field(key: string, label: string, type = "text", textarea = false) {
    return (
      <label className={styles.field} key={key} htmlFor={"field-" + key}>
        {label}
        {textarea ? (
          <textarea
            id={"field-" + key}
            value={String(form[key] ?? "")}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            rows={key === "description" ? 5 : 3}
            aria-invalid={Boolean(errors[key])}
            aria-describedby={errors[key] ? "error-" + key : undefined}
          />
        ) : (
          <input
            id={"field-" + key}
            type={type}
            value={String(form[key] ?? "")}
            onChange={(e) =>
              setForm({
                ...form,
                [key]:
                  type === "number" ? Number(e.target.value) : e.target.value,
              })
            }
            min={type === "number" ? 0 : undefined}
            autoComplete={type === "password" ? "new-password" : undefined}
            aria-invalid={Boolean(errors[key])}
            aria-describedby={errors[key] ? "error-" + key : undefined}
          />
        )}{" "}
        {errors[key] && (
          <span id={"error-" + key} className={styles.error}>
            {errors[key]}
          </span>
        )}
      </label>
    );
  }
  function checkbox(key: string, label: string) {
    return (
      <label className={styles.check}>
        <input
          type="checkbox"
          checked={Boolean(form[key])}
          onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
        />
        {label}
      </label>
    );
  }
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Brand />
        <p className={styles.kicker}>Khu vực quản trị</p>
        {navigation}
      </aside>
      <div className={styles.main}>
        <header className={styles.header}>
          <Button
            className={styles.menu}
            variant="ghost"
            size="icon-sm"
            aria-label="Mở menu quản trị"
            onClick={() => setMobile(true)}
          >
            <Menu />
          </Button>
          <span className={styles.identity}>
            {fullName}
            <small>Quản trị viên</small>
          </span>
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            <LogOut size={15} />
            <span>Đăng xuất</span>
          </Button>
        </header>
        <main className={styles.content}>
          <div className={styles.title}>
            <div>
              <p className={styles.kicker}>FPT Polytechnic · CNTT</p>
              <h1>{nav.find((n) => n[0] === section)?.[1]}</h1>
              <p>Quản lý nội dung và trải nghiệm của cổng sản phẩm.</p>
            </div>
            {["websites", "categories", "users"].includes(section) && (
              <Button onClick={() => edit(null)}>
                <Plus size={16} />
                Thêm mới
              </Button>
            )}
          </div>
          {section !== "dashboard" && section !== "audit" && (
            <div className={styles.filters}>
              <input
                aria-label="Tìm kiếm quản trị"
                placeholder="Tìm theo tên, tên đăng nhập hoặc email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {section === "users" ? (
                <>
                  <select
                    aria-label="Lọc vai trò"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="all">Mọi vai trò</option>
                    <option>ADMIN</option>
                    <option>USER</option>
                  </select>
                  <select
                    aria-label="Lọc trạng thái tài khoản"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="all">Mọi trạng thái</option>
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="LOCKED">Đã khóa</option>
                  </select>
                </>
              ) : (
                <select
                  aria-label="Lọc hiển thị"
                  value={visible}
                  onChange={(e) => {
                    setVisible(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">Mọi trạng thái</option>
                  <option value="true">Đang hiển thị</option>
                  <option value="false">Đang ẩn</option>
                </select>
              )}
              {section === "websites" && (
                <>
                  <select
                    aria-label="Danh mục quản trị"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Sắp xếp quản trị"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="order">Thứ tự</option>
                    <option value="updated">Mới cập nhật</option>
                    <option value="name-asc">Tên A–Z</option>
                    <option value="name-desc">Tên Z–A</option>
                  </select>
                </>
              )}
            </div>
          )}
          {loading ? (
            <p role="status" className={styles.state}>
              Đang tải dữ liệu...
            </p>
          ) : error ? (
            <div role="alert" className={styles.state}>
              <p>{error}</p>
              <Button onClick={() => void load()}>Thử lại</Button>
            </div>
          ) : section === "dashboard" ? (
            <>
              <div className={styles.kpis}>
                {[
                  ["websites", "Tổng sản phẩm"],
                  ["visible", "Website đang hiển thị"],
                  ["categories", "Danh mục"],
                  ["users", "Tài khoản"],
                ].map(([key, label]) => (
                  <article key={key}>
                    <p>{label}</p>
                    <strong>{kpis[key] ?? 0}</strong>
                  </article>
                ))}
              </div>
              <section className={styles.welcome}>
                <h2>Nội dung tốt bắt đầu từ quản lý rõ ràng.</h2>
                <p>
                  Cập nhật poster, đường dẫn và mô tả để giới thiệu đúng thành
                  quả của sinh viên. Các thay đổi được lưu cùng lịch sử thao
                  tác.
                </p>
                <Link href="/admin/websites">Quản lý sản phẩm →</Link>
              </section>
            </>
          ) : !rows.length ? (
            <p className={styles.state}>Chưa có dữ liệu phù hợp.</p>
          ) : (
            <div className={styles.rows}>
              {rows.map((row) => (
                <article key={row.id} className={styles.row}>
                  <div className={styles.rowInfo}>
                    <h2>{row.name || row.fullName || row.action}</h2>
                    <p>
                      {row.username
                        ? `@${row.username}${row.email ? ` · ${row.email}` : ""}`
                        : row.url || row.description || row.entityType}
                    </p>
                    <div className={styles.badges}>
                      {row.role && (
                        <span>
                          {row.role} ·{" "}
                          {row.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
                        </span>
                      )}
                      {row.isVisible !== undefined && (
                        <span>
                          {row.isVisible ? "Đang hiển thị" : "Đang ẩn"}
                        </span>
                      )}
                      {row.isFeatured && <span>Nổi bật</span>}
                      {row.sortOrder !== undefined && (
                        <span>Thứ tự: {row.sortOrder}</span>
                      )}
                      {row._count && <span>{row._count.websites} website</span>}
                      {section === "audit" && (
                        <span>
                          {row.actor?.fullName || "Hệ thống"} ·{" "}
                          {new Date(row.createdAt!).toLocaleString("vi-VN")}
                        </span>
                      )}
                    </div>
                  </div>
                  {section !== "audit" && (
                    <div className={styles.actions}>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={"Xem " + (row.name || row.fullName)}
                        onClick={() => setDetail(row)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => edit(row)}
                      >
                        <Pencil size={14} />
                        Sửa
                      </Button>
                      {section === "users" ? (
                        <Button
                          variant="outline"
                          size="icon-sm"
                          aria-label={"Đặt lại mật khẩu " + row.fullName}
                          onClick={() => edit(row, true)}
                        >
                          <KeyRound size={16} />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={"Xóa " + row.name}
                          onClick={() => setDeleting(row)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
          {section !== "dashboard" && (
            <div className={styles.pagination}>
              <span>
                {total} bản ghi · Trang {page} /{" "}
                {Math.max(1, Math.ceil(total / 20))}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1 || loading}
                onClick={() => setPage(page - 1)}
              >
                Trước
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page * 20 >= total || loading}
                onClick={() => setPage(page + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </main>
      </div>
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Quản trị CNTT</SheetTitle>
          </SheetHeader>
          {navigation}
        </SheetContent>
      </Sheet>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!busy) setOpen(v);
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {reset ? "Đặt lại mật khẩu" : editing ? "Chỉnh sửa" : "Thêm mới"}
            </DialogTitle>
            <DialogDescription>
              {reset
                ? "Mật khẩu tạm ít nhất 8 ký tự. Tất cả phiên đăng nhập sẽ bị thu hồi."
                : "Hoàn thiện thông tin trước khi lưu. Slug có thể để trống để tạo từ tên."}
            </DialogDescription>
          </DialogHeader>
          <form
            className={styles.form}
            onSubmit={async (e) => {
              e.preventDefault();
              setErrors({});
              const schema = reset
                ? resetPasswordSchema
                : section === "websites"
                  ? websiteAdminSchema
                  : section === "categories"
                    ? categoryAdminSchema
                    : editing
                      ? userUpdateSchema
                      : userCreateSchema;
              const parsed = schema.safeParse(form);
              if (!parsed.success) {
                setErrors(
                  Object.fromEntries(
                    parsed.error.issues.map((i) => [
                      String(i.path[0]),
                      i.message,
                    ]),
                  ),
                );
                return;
              }
              setBusy(true);
              try {
                await apiRequest(
                  "/api/admin/" + section + (editing ? "/" + editing.id : ""),
                  {
                    method: reset ? "PATCH" : editing ? "PUT" : "POST",
                    body: JSON.stringify(form),
                  },
                );
                setOpen(false);
                toast.success("Đã lưu thay đổi.");
                await load();
              } catch (e) {
                setErrors({
                  _form: e instanceof Error ? e.message : "Không thể lưu.",
                });
              } finally {
                setBusy(false);
              }
            }}
          >
            {reset ? (
              field("password", "Mật khẩu tạm mới", "password")
            ) : section === "users" ? (
              <>
                {field("fullName", "Họ và tên")}
                {field("username", "Tên đăng nhập")}
                {field("email", "Email (không bắt buộc)", "email")}
                {!editing && field("password", "Mật khẩu tạm", "password")}
                <label className={styles.field}>
                  Vai trò
                  <select
                    value={String(form.role)}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option>USER</option>
                    <option>ADMIN</option>
                  </select>
                </label>
                <label className={styles.field}>
                  Trạng thái
                  <select
                    value={String(form.status)}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="LOCKED">Đã khóa</option>
                  </select>
                </label>
              </>
            ) : (
              <>
                {field("name", "Tên")}
                {field("slug", "Slug")}
                {section === "websites" && (
                  <>
                    {field("url", "Link truy cập", "url")}
                    {field("shortDescription", "Mô tả ngắn", "text", true)}
                  </>
                )}
                {field("description", "Mô tả đầy đủ", "text", true)}
                {section === "websites" && (
                  <>
                    <label className={styles.field}>
                      Danh mục
                      <select
                        value={String(form.categoryId || "")}
                        onChange={(e) =>
                          setForm({ ...form, categoryId: e.target.value })
                        }
                      >
                        <option value="">Chưa phân loại</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    {field("keywords", "Từ khóa")}
                    {field("logoUrl", "URL logo")}
                    {field("posterUrl", "URL poster")}
                    <div className={styles.previews}>
                      {["logoUrl", "posterUrl"].map((key) =>
                        form[key] ? (
                          <Image
                            unoptimized
                            width={110}
                            height={110}
                            key={key}
                            src={String(form[key])}
                            alt={
                              key === "logoUrl"
                                ? "Xem trước logo"
                                : "Xem trước poster"
                            }
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        ) : null,
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {localUploadEnabled
                        ? "Có thể dùng URL HTTPS, tài nguyên nội bộ hoặc tải ảnh lên ổ đĩa bền vững của máy chủ."
                        : "Máy chủ đang dùng chế độ URL. Hãy nhập URL HTTPS hoặc đường dẫn ảnh có sẵn trong thư viện."}
                    </p>
                    {localUploadEnabled &&
                      (["logo", "poster"] as const).map((kind) => (
                        <label className={styles.field} key={kind}>
                          Tải {kind === "logo" ? "logo" : "poster"}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const data = new window.FormData();
                              data.set("file", file);
                              data.set("kind", kind);
                              setBusy(true);
                              try {
                                const r = await fetch("/api/admin/upload", {
                                  method: "POST",
                                  body: data,
                                });
                                const b = await r.json();
                                if (!r.ok)
                                  throw new Error(
                                    b.error?.message || "Không tải được ảnh.",
                                  );
                                setForm((f) => ({
                                  ...f,
                                  [kind === "logo" ? "logoUrl" : "posterUrl"]:
                                    b.data.url,
                                }));
                                toast.success(`Đã tải ${kind}.`);
                              } catch (cause) {
                                setErrors({
                                  _form:
                                    cause instanceof Error
                                      ? cause.message
                                      : "Không tải được ảnh.",
                                });
                              } finally {
                                setBusy(false);
                              }
                            }}
                          />
                        </label>
                      ))}
                    {checkbox("isFeatured", "Sản phẩm nổi bật")}
                  </>
                )}
                {field("displayOrder", "Thứ tự hiển thị", "number")}
                {checkbox("isVisible", "Hiển thị công khai")}
              </>
            )}
            {errors._form && (
              <p role="alert" className={styles.error}>
                {errors._form}
              </p>
            )}
            <div className={styles.formActions}>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(detail)}
        onOpenChange={(v) => {
          if (!v) setDetail(null);
        }}
      >
        <DialogContent className="max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{detail?.name || detail?.fullName}</DialogTitle>
            <DialogDescription>
              Thông tin đã lưu trong hệ thống
            </DialogDescription>
          </DialogHeader>
          <dl className={styles.details}>
            {Object.entries(detail || {})
              .filter(([k, v]) => typeof v !== "object" && !["id"].includes(k))
              .map(([k, v]) => (
                <div key={k}>
                  <dt>{detailLabels[k] || k}</dt>
                  <dd>
                    {typeof v === "boolean"
                      ? v
                        ? "Có"
                        : "Không"
                      : String(v ?? "—")}
                  </dd>
                </div>
              ))}
          </dl>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(v) => {
          if (!v && !busy) setDeleting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác không thể hoàn tác. Danh mục có website sẽ được bảo vệ
              khỏi xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Hủy</AlertDialogCancel>
            <Button
              variant="danger"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await apiRequest(
                    "/api/admin/" + section + "/" + deleting?.id,
                    { method: "DELETE" },
                  );
                  setDeleting(null);
                  toast.success("Đã xóa.");
                  await load();
                } catch (e) {
                  toast.error(
                    e instanceof Error ? e.message : "Không thể xóa.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Đang xóa..." : "Xác nhận xóa"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
