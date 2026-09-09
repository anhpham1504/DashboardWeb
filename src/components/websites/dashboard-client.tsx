"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app-header";
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
import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturedSystems } from "@/components/marketing/featured-systems";
import { EcosystemBento } from "@/components/marketing/ecosystem-bento";
import { BenefitsSection } from "@/components/marketing/benefits-section";
import { SystemsDirectory } from "@/components/marketing/systems-directory";
import { FinalCta } from "@/components/marketing/final-cta";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { DirectoryPreview } from "@/components/marketing/directory-preview";
import {
  WebsiteFormDialog,
  type WebsiteFormValue,
} from "@/components/websites/website-form-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { apiRequest } from "@/lib/client-api";
import { getUserError } from "@/lib/localization";
import type { CategoryDto, WebsiteDto } from "@/types/models";

export function DashboardClient({
  mode = "marketing",
  initialCategory = "all",
}: {
  mode?: "marketing" | "directory";
  initialCategory?: string;
}) {
  const [websites, setWebsites] = useState<WebsiteDto[]>([]);
  const [featuredWebsites, setFeaturedWebsites] = useState<WebsiteDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [collectionTotal, setCollectionTotal] = useState(0);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [category, setCategory] = useState(initialCategory || "all");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
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
        setFeaturedWebsites(websiteData);
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
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* 01. Header */}
      <AppHeader
        search={mode === "directory" ? search : undefined}
        onSearchChange={mode === "directory" ? setSearch : undefined}
        onAdd={mode === "directory" ? openAdd : undefined}
      />

      <main id="main-content" className="flex-1">
        {mode === "marketing" ? (
          <>
            <HeroSection
              websites={featuredWebsites.length > 0 ? featuredWebsites : websites}
              totalWebsites={total}
              totalCategories={categories.length}
            />
            <FeaturedSystems
              websites={featuredWebsites.length > 0 ? featuredWebsites : websites}
            />
            <EcosystemBento categories={categories} />
            <BenefitsSection />
            <DirectoryPreview
              totalWebsites={total}
              totalCategories={categories.length}
            />
            <FinalCta />
          </>
        ) : (
          <SystemsDirectory
            websites={websites}
            categories={categories}
            total={total}
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
            loading={loading}
            error={error}
            onRetry={() => void load()}
            onAdd={openAdd}
            onEdit={(website) => {
              formReturnFocusRef.current = findWebsiteActionButton(website.name);
              setEditing(website);
              setFormOpen(true);
            }}
            onDelete={(website) => {
              deleteReturnFocusRef.current = findWebsiteActionButton(website.name);
              setDeleting(website);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <MarketingFooter />

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
