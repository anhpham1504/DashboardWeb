"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FolderCog,
  Grid2X2,
  List,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WebsiteCard } from "@/components/websites/website-card";
import { WebsiteSkeleton } from "@/components/websites/website-skeleton";
import { WebsiteLoadError } from "@/components/websites/website-states";
import type { CategoryDto, WebsiteDto } from "@/types/models";
import { formatNumber, getCategoryDisplayName } from "@/lib/localization";
import styles from "./directory.module.css";

interface SystemsDirectoryProps {
  websites: WebsiteDto[];
  allWebsites?: WebsiteDto[];
  categories: CategoryDto[];
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (value: "grid" | "list") => void;
  loading: boolean;
  error: string;
  onRetry: () => void;
}

const isFeaturedProduct = (website: WebsiteDto) => Boolean(website.isFeatured);

export function SystemsDirectory({
  websites,
  allWebsites = websites,
  categories,
  total,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  loading,
  error,
  onRetry,
}: SystemsDirectoryProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [scope, setScope] = useState("all");
  const featuredCount = allWebsites.filter(isFeaturedProduct).length;
  const visibleWebsites = websites.filter(
    (website) =>
      scope === "all" ||
      (scope === "featured"
        ? isFeaturedProduct(website)
        : !isFeaturedProduct(website)),
  );
  const filtered = search !== "" || category !== "all" || scope !== "all";
  const count = (value: number) =>
    loading && !allWebsites.length ? "—" : formatNumber(value);
  const activeCategory = categories.find((item) => item.id === category);

  function clearFilters() {
    onSearchChange("");
    onCategoryChange("all");
    setScope("all");
  }

  return (
    <section
      id="all-systems"
      aria-labelledby="directory-title"
      className={styles.page}
    >
      <div className={styles.intro}>
        <h1 id="directory-title">
          Tất cả hệ thống<span className="text-primary">.</span>
        </h1>
        <p className={styles.description}>
          Sản phẩm sinh viên và các công cụ phục vụ học tập, lập trình, làm
          việc.
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.toolbarTop}>
          <div className={styles.search}>
            <Search size={17} />
            <input
              ref={searchInputRef}
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Tìm theo tên, mô tả hoặc địa chỉ website..."
              aria-label="Tìm kiếm hệ thống"
            />
            {search && (
              <button
                type="button"
                aria-label="Xóa từ khóa tìm kiếm"
                onClick={() => {
                  onSearchChange("");
                  searchInputRef.current?.focus();
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className={styles.controls}>
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger
                aria-label="Lọc theo danh mục"
                className={styles.selectTrigger}
              >
                <FolderCog size={14} />
                <span className={styles.selectValue}>
                  {activeCategory
                    ? getCategoryDisplayName(activeCategory.name)
                    : "Danh mục"}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {getCategoryDisplayName(item.name)} (
                    {formatNumber(item.websiteCount)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={onSortChange}>
              <SelectTrigger
                aria-label="Sắp xếp danh sách hệ thống"
                className={styles.selectTrigger}
              >
                <SlidersHorizontal size={14} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order">Thứ tự giới thiệu</SelectItem>
                <SelectItem value="updated">Mới cập nhật</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="name-asc">Tên A–Z</SelectItem>
                <SelectItem value="name-desc">Tên Z–A</SelectItem>
              </SelectContent>
            </Select>
            <div
              className={styles.view}
              role="group"
              aria-label="Chọn kiểu hiển thị"
            >
              <button
                type="button"
                title="Dạng lưới"
                aria-label="Dạng lưới"
                aria-pressed={view === "grid"}
                onClick={() => onViewChange("grid")}
              >
                <Grid2X2 size={17} />
              </button>
              <button
                type="button"
                title="Dạng danh sách"
                aria-label="Dạng danh sách"
                aria-pressed={view === "list"}
                onClick={() => onViewChange("list")}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scopeRow}>
        <div className={styles.scopes} role="group" aria-label="Loại website">
          {[
            ["all", "Tất cả website", total],
            ["featured", "Sản phẩm nổi bật", featuredCount],
            ["others", "Hệ thống khác", total - featuredCount],
          ].map(([value, label, number]) => (
            <button
              key={value}
              type="button"
              aria-pressed={scope === value}
              onClick={() => setScope(String(value))}
            >
              {label}
              <span>{count(Number(number))}</span>
            </button>
          ))}
        </div>
        <div className={styles.status}>
          <p role="status">
            {error
              ? "Chưa tải được dữ liệu"
              : loading
                ? "Đang tải hệ thống..."
                : `Hiển thị ${formatNumber(visibleWebsites.length)} website`}
            {activeCategory && !loading && !error
              ? ` · ${getCategoryDisplayName(activeCategory.name)}`
              : ""}
          </p>
          {filtered && (
            <button type="button" onClick={clearFilters}>
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {error ? (
        <WebsiteLoadError onRetry={onRetry} />
      ) : loading ? (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Đang tải danh sách hệ thống"
          className={view === "grid" ? styles.grid : styles.list}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <WebsiteSkeleton key={index} view={view} />
          ))}
        </div>
      ) : !visibleWebsites.length ? (
        <div className={styles.empty}>
          <Search size={30} />
          <h2>
            {filtered
              ? "Chưa tìm thấy website phù hợp"
              : "Thư viện đang chờ liên kết đầu tiên"}
          </h2>
          <p>
            {filtered
              ? "Thử một từ khóa khác hoặc xóa bộ lọc để xem toàn bộ thư viện."
              : "Các website sẽ được cập nhật tại đây."}
          </p>
          {filtered && (
            <Button variant="outline" onClick={clearFilters}>
              Xóa tất cả bộ lọc
            </Button>
          )}
        </div>
      ) : (
        <div
          id="directory-results"
          className={view === "grid" ? styles.grid : styles.list}
        >
          {visibleWebsites.map((website) => (
            <WebsiteCard
              key={website.id}
              website={website}
              view={view}
              directory
            />
          ))}
        </div>
      )}

      <div className={styles.about}>
        <div>
          <h2>Tìm hiểu bộ môn Công nghệ thông tin</h2>
        </div>
        <Link href="/about">
          Về bộ môn
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
