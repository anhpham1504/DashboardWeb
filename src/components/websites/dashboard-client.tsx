"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar, SidebarNav } from "@/components/layout/app-sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { WebsiteCard } from "@/components/websites/website-card";
import {
  WebsiteFormDialog,
  type WebsiteFormValue,
} from "@/components/websites/website-form-dialog";
import { WebsiteSkeleton } from "@/components/websites/website-skeleton";
import {
  WebsiteEmptyState,
  WebsiteLoadError,
} from "@/components/websites/website-states";
import { WebsiteToolbar } from "@/components/websites/website-toolbar";
import { useDebounce } from "@/hooks/use-debounce";
import { apiRequest } from "@/lib/client-api";
import {
  formatNumber,
  getCategoryDisplayName,
  getUserError,
} from "@/lib/localization";
import type { CategoryDto, WebsiteDto } from "@/types/models";

export function DashboardClient() {
  const [websites, setWebsites] = useState<WebsiteDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [collectionTotal, setCollectionTotal] = useState(0);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [editing, setEditing] = useState<WebsiteDto | null>(null);
  const [deleting, setDeleting] = useState<WebsiteDto | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const formReturnFocusRef = useRef<HTMLElement | null>(null);
  const deleteReturnFocusRef = useRef<HTMLElement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (category !== "all") params.set("categoryId", category);
      params.set("sort", sort);
      const [websiteData, categoryData] = await Promise.all([
        apiRequest<WebsiteDto[]>(`/api/websites?${params}`),
        apiRequest<CategoryDto[]>("/api/categories"),
      ]);
      setWebsites(websiteData);
      setCategories(categoryData);
      if (category === "all" && !debouncedSearch) {
        setCollectionTotal(websiteData.length);
      }
    } catch (reason) {
      setError(getUserError(reason, "Không thể tải danh sách website."));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, sort]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    const refresh = () => void load();
    window.addEventListener("linkhub:refresh", refresh);
    return () => window.removeEventListener("linkhub:refresh", refresh);
  }, [load]);

  const total = useMemo(() => {
    const categorizedTotal = categories.reduce(
      (sum, item) => sum + item.websiteCount,
      0
    );
    return Math.max(collectionTotal, categorizedTotal);
  }, [categories, collectionTotal]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === category),
    [categories, category]
  );

  async function save(value: WebsiteFormValue) {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/websites/${editing.id}` : "/api/websites";
    await apiRequest<WebsiteDto>(url, { method, body: JSON.stringify(value) });
    toast.success(editing ? "Đã cập nhật website." : "Đã thêm website.");
    if (!editing) setCollectionTotal((current) => current + 1);
    setEditing(null);
    await load();
  }

  async function remove() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await apiRequest<{ id: string }>(`/api/websites/${deleting.id}`, {
        method: "DELETE",
      });
      toast.success("Đã xóa website.");
      setCollectionTotal((current) => Math.max(0, current - 1));
      setDeleting(null);
      await load();
      document.getElementById("add-website-button")?.focus();
    } catch (reason) {
      toast.error(getUserError(reason, "Không thể xóa website."));
    } finally {
      setDeletingBusy(false);
    }
  }

  function openAdd() {
    formReturnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setEditing(null);
    setFormOpen(true);
  }

  function findWebsiteActionButton(name: string) {
    return (
      Array.from(
        document.querySelectorAll<HTMLElement>("button[aria-label]")
      ).find(
        (element) =>
          element.getAttribute("aria-label") === `Thao tác với ${name}`
      ) ?? null
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <AppHeader
        search={search}
        onSearchChange={setSearch}
        onAdd={openAdd}
        onOpenMobileNav={() => setMobileNavOpen(true)}
      />

      {/* Main Container */}
      <div className="mx-auto flex w-full max-w-[1600px] flex-1">
        {/* Desktop Sidebar */}
        <AppSidebar
          categories={categories}
          total={total}
          selected={category}
          onSelect={setCategory}
        />

        {/* Mobile Navigation Drawer */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Điều hướng</SheetTitle>
            </SheetHeader>
            <div className="min-h-0 flex-1 p-4">
              <SidebarNav
                categories={categories}
                total={total}
                selected={category}
                onSelect={(id) => {
                  setCategory(id);
                  setMobileNavOpen(false);
                }}
                onItemClick={() => setMobileNavOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
          {/* Page Heading & Controls Bar */}
          <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.11em] text-primary-strong">
                <span className="size-1.5 rounded-full bg-primary" />
                <span>Liên kết của bạn</span>
              </div>
              <h1 className="text-3xl font-bold tracking-[-0.025em] text-foreground">
                {category === "all"
                  ? "Website"
                  : getCategoryDisplayName(activeCategory?.name || "Website")}
              </h1>
              <p
                aria-live="polite"
                className="mt-1.5 text-sm text-muted-foreground"
              >
                {loading
                  ? "Đang tải danh sách website..."
                  : category !== "all" || debouncedSearch
                    ? `Hiển thị ${formatNumber(websites.length)} website`
                    : `Bạn đang có ${formatNumber(websites.length)} website`}
              </p>
            </div>

            <WebsiteToolbar
              categories={categories}
              category={category}
              total={total}
              sort={sort}
              view={view}
              onCategoryChange={setCategory}
              onSortChange={setSort}
              onViewChange={setView}
            />
          </div>

          {/* Body content based on state */}
          {error ? (
            <WebsiteLoadError onRetry={() => void load()} />
          ) : loading ? (
            <div
              aria-busy="true"
              aria-label="Đang tải danh sách website"
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                  : "space-y-3"
              }
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <WebsiteSkeleton key={index} view={view} />
              ))}
            </div>
          ) : websites.length === 0 ? (
            <WebsiteEmptyState
              search={debouncedSearch}
              category={category}
              categoryName={activeCategory?.name}
              onClearSearch={() => setSearch("")}
              onShowAll={() => setCategory("all")}
              onAdd={openAdd}
            />
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                  : "space-y-3"
              }
            >
              {websites.map((website) => (
                <WebsiteCard
                  key={website.id}
                  website={website}
                  view={view}
                  onEdit={() => {
                    formReturnFocusRef.current = findWebsiteActionButton(
                      website.name
                    );
                    setEditing(website);
                    setFormOpen(true);
                  }}
                  onDelete={() => {
                    deleteReturnFocusRef.current = findWebsiteActionButton(
                      website.name
                    );
                    setDeleting(website);
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Website Add/Edit Dialog */}
      <WebsiteFormDialog
        key={`${editing?.id ?? "new"}-${formOpen ? "open" : "closed"}`}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        website={editing}
        categories={categories}
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
            <div className="mb-2 grid size-11 place-items-center rounded-xl bg-danger/10 text-danger">
              <Trash2 size={20} />
            </div>
            <AlertDialogTitle>Xóa website?</AlertDialogTitle>
            <AlertDialogDescription>
              Website &ldquo;{deleting?.name}&rdquo; sẽ bị xóa khỏi danh sách. Thao
              tác này không thể hoàn tác.
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
                <span>{deletingBusy ? "Đang xóa..." : "Xóa website"}</span>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
