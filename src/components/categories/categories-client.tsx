"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Folder,
  FolderOpen,
  LoaderCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import {
  CategoryFormDialog,
  type CategoryFormValue,
} from "@/components/categories/category-form-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/client-api";
import {
  formatNumber,
  getCategoryDisplayDescription,
  getCategoryDisplayName,
  getUserError,
} from "@/lib/localization";
import type { CategoryDto } from "@/types/models";

export function CategoriesClient() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryDto | null>(null);
  const [deleting, setDeleting] = useState<CategoryDto | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const formReturnFocusRef = useRef<HTMLElement | null>(null);
  const deleteReturnFocusRef = useRef<HTMLElement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setCategories(await apiRequest<CategoryDto[]>("/api/categories"));
    } catch (reason) {
      setError(getUserError(reason, "Không thể tải danh sách danh mục."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function save(value: CategoryFormValue) {
    await apiRequest<CategoryDto>(
      editing ? `/api/categories/${editing.id}` : "/api/categories",
      {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(value),
      }
    );
    toast.success(editing ? "Đã cập nhật danh mục." : "Đã thêm danh mục.");
    setEditing(null);
    await load();
  }

  async function remove() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await apiRequest<{ id: string }>(`/api/categories/${deleting.id}`, {
        method: "DELETE",
      });
      toast.success("Đã xóa danh mục.");
      setDeleting(null);
      await load();
      document.getElementById("add-category-button")?.focus();
    } catch (reason) {
      toast.error(getUserError(reason, "Không thể xóa danh mục."));
    } finally {
      setDeletingBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20 dark:bg-[radial-gradient(circle_at_8%_18%,#3d164b55,transparent_25%),radial-gradient(circle_at_92%_42%,#123e5b4d,transparent_28%),#0d0a17]">
      <AppHeader />

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-[22px] py-9 sm:px-9 lg:py-12 xl:px-16">
        {/* Back Link */}
        <Link
          href="/systems"
          className="group mb-8 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary-strong"
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-150 group-hover:-translate-x-1"
          />
          <span>Quay lại danh sách hệ thống</span>
        </Link>

        {/* Page Title & Action */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[clamp(32px,3vw,42px)] font-semibold leading-[1.15] tracking-[-0.045em] text-foreground">
              Danh mục<span className="text-primary">.</span>
            </h1>
            <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
              Sắp xếp các website đã lưu để tìm kiếm nhanh chóng.
            </p>
          </div>

          <Button
            id="add-category-button"
            size="sm"
            onClick={() => {
              formReturnFocusRef.current =
                document.activeElement instanceof HTMLElement
                  ? document.activeElement
                  : null;
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>Thêm danh mục</span>
          </Button>
        </div>

        {/* Content State */}
        {error ? (
          <div
            role="alert"
            className="grid min-h-72 place-items-center rounded-[7px] border border-dashed border-border bg-surface p-8 text-center"
          >
            <div className="max-w-md">
              <h2 className="text-base font-semibold text-foreground">
                Không thể tải dữ liệu
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Đã xảy ra lỗi khi tải danh sách danh mục.
              </p>
              <Button
                size="sm"
                variant="secondary"
                className="mt-4"
                onClick={() => void load()}
              >
                <RefreshCcw size={14} />
                <span>Thử lại</span>
              </Button>
            </div>
          </div>
        ) : loading ? (
          <div aria-busy="true" aria-label="Đang tải danh sách danh mục" className="overflow-hidden rounded-[7px] border border-border bg-surface">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid min-h-20 animate-pulse grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border/70 px-4 last:border-b-0 sm:px-5"
              >
                <div className="size-10 rounded-[7px] bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-muted" />
                  <div className="h-3 w-64 max-w-full rounded bg-muted" />
                </div>
                <div className="size-9 rounded-[7px] bg-muted" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="grid min-h-72 place-items-center rounded-[7px] border border-dashed border-border bg-surface/50 p-8 text-center">
            <div className="max-w-md">
              <div className="mx-auto mb-3 grid size-11 place-items-center rounded-[7px] bg-primary/10 text-primary">
                <FolderOpen size={20} />
              </div>
              <h2 className="text-base font-semibold text-foreground">
                Chưa có danh mục
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                Tạo danh mục để sắp xếp các website đã lưu thành từng nhóm.
              </p>
              <Button
                size="sm"
                className="mt-4"
                onClick={() => {
                  formReturnFocusRef.current =
                    document.activeElement instanceof HTMLElement
                      ? document.activeElement
                      : null;
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <Plus size={14} />
                <span>Tạo danh mục</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[7px] border border-border bg-surface dark:rounded-2xl dark:border-[#493661] dark:bg-[linear-gradient(145deg,#191225,#121d2b)] dark:shadow-[inset_0_1px_0_#ffffff0a,0_28px_55px_-42px_#a978ff]">
            {/* Table Header */}
            <div className="hidden grid-cols-[minmax(180px,0.8fr)_minmax(220px,1.25fr)_120px_56px] items-center gap-5 border-b border-border/80 bg-muted/45 px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground md:grid dark:bg-[#281b3a]/70 dark:text-[#cfc1df]">
              <span>Danh mục</span>
              <span>Mô tả</span>
              <span>Số website</span>
              <span className="text-right">Thao tác</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border/60">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex min-h-20 items-center justify-between gap-4 p-4 transition-colors hover:bg-surface-raised/40 md:grid md:grid-cols-[minmax(180px,0.8fr)_minmax(220px,1.25fr)_120px_56px] md:gap-5 md:px-5 md:py-4 dark:hover:bg-[#2c2040]/70"
                >
                  {/* Category info */}
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-[7px] border border-primary/15 bg-primary/10 text-primary">
                      <Folder size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {getCategoryDisplayName(category.name)}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground md:hidden">
                        {category.description
                          ? getCategoryDisplayDescription(category.description)
                          : "Chưa có mô tả."}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="hidden line-clamp-2 text-sm leading-5 text-muted-foreground md:block">
                    {category.description
                      ? getCategoryDisplayDescription(category.description)
                      : "Chưa có mô tả."}
                  </p>

                  {/* Website count badge */}
                  <div className="hidden md:block">
                    <span className="inline-flex min-h-6 items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {formatNumber(category.websiteCount)} website
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground md:hidden">
                      {category.websiteCount}
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Thao tác với ${getCategoryDisplayName(category.name)}`}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            formReturnFocusRef.current =
                              Array.from(
                                document.querySelectorAll<HTMLElement>(
                                  "button[aria-label]"
                                )
                              ).find(
                                (element) =>
                                  element.getAttribute("aria-label") ===
                                  `Thao tác với ${getCategoryDisplayName(category.name)}`
                              ) ?? null;
                            setEditing(category);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil size={14} className="text-muted-foreground" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            deleteReturnFocusRef.current =
                              Array.from(
                                document.querySelectorAll<HTMLElement>(
                                  "button[aria-label]"
                                )
                              ).find(
                                (element) =>
                                  element.getAttribute("aria-label") ===
                                  `Thao tác với ${getCategoryDisplayName(category.name)}`
                              ) ?? null;
                            setDeleting(category);
                          }}
                          className="text-danger focus:text-danger"
                        >
                          <Trash2 size={14} className="text-danger" />
                          <span>Xóa</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <MarketingFooter />

      {/* Category Dialog */}
      <CategoryFormDialog
        key={`${editing?.id ?? "new"}-${formOpen ? "open" : "closed"}`}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        category={editing}
        onSubmit={save}
        returnFocusRef={formReturnFocusRef}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent
          onCloseAutoFocus={(event) => {
            if (!deleteReturnFocusRef.current?.isConnected) return;
            event.preventDefault();
            deleteReturnFocusRef.current.focus();
          }}
        >
          <AlertDialogHeader>
            <div className="mb-2 grid size-11 place-items-center rounded-[7px] bg-danger/10 text-danger">
              <Trash2 size={20} />
            </div>
            <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.websiteCount
                ? `Hiện có ${formatNumber(deleting.websiteCount)} website thuộc danh mục này. Các website này sẽ được chuyển sang mục “Chưa phân loại”. Thao tác này không thể hoàn tác.`
                : `Bạn có chắc muốn xóa danh mục “${getCategoryDisplayName(deleting?.name || "")}”? Thao tác này không thể hoàn tác.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary" size="sm">
                Hủy
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="danger"
                size="sm"
                disabled={deletingBusy}
                onClick={() => void remove()}
              >
                {deletingBusy && <LoaderCircle className="animate-spin" size={15} />}
                <span>{deletingBusy ? "Đang xóa..." : "Xóa danh mục"}</span>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
