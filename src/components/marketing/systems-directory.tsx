"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronRight, FolderCog, Grid2X2, List, Plus, Search, X, GraduationCap, MousePointer2, LockKeyhole, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WebsiteCard } from "@/components/websites/website-card";
import { WebsiteSkeleton } from "@/components/websites/website-skeleton";
import { WebsiteLoadError } from "@/components/websites/website-states";
import type { CategoryDto, WebsiteDto } from "@/types/models";
import { formatNumber, getCategoryDisplayName } from "@/lib/localization";
import { showcaseCatalog } from "@/lib/showcase";
import { getDomain } from "@/lib/url";
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
  onAdd: () => void;
  onEdit: (website: WebsiteDto) => void;
  onDelete: (website: WebsiteDto) => void;
}

const isStudentProduct = (website: WebsiteDto) =>
  showcaseCatalog.some((item) => item.hostname === getDomain(website.url));

export function SystemsDirectory({
  websites, allWebsites = websites, categories, total, search, onSearchChange, category,
  onCategoryChange, sort, onSortChange, view, onViewChange, loading, error,
  onRetry, onAdd, onEdit, onDelete,
}: SystemsDirectoryProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [scope, setScope] = useState("all");
  const studentCount = allWebsites.filter(isStudentProduct).length;
  const visibleWebsites = websites.filter((website) =>
    scope === "all" || (scope === "student" ? isStudentProduct(website) : !isStudentProduct(website)));
  const filtered = search !== "" || category !== "all" || scope !== "all";
  const count = (value: number) => loading && !allWebsites.length ? "—" : formatNumber(value);
  const activeCategory = categories.find((item) => item.id === category);

  function clearFilters() {
    onSearchChange("");
    onCategoryChange("all");
    setScope("all");
  }

  return (
    <section id="all-systems" aria-labelledby="directory-title" className={styles.page}>
      <nav aria-label="Đường dẫn trang" className={styles.breadcrumb}>
        <Link href="/">Trang chủ</Link><ChevronRight size={12} /><span aria-current="page">Tất cả hệ thống</span>
      </nav>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>FPT Polytechnic / Không gian kết nối số</p>
          <h1 id="directory-title">Tất cả hệ thống<span className="text-primary">.</span></h1>
          <p className={styles.description}>Một nơi để khám phá sản phẩm sinh viên và truy cập các công cụ học tập, lập trình, làm việc. Tìm đúng ứng dụng, bắt đầu chỉ với một lần nhấp.</p>
          <div className={styles.actions}>
            <Button id="add-website-button" onClick={onAdd} size="sm"><Plus size={16} />Thêm website</Button>
            <Button asChild variant="outline" size="sm"><Link href="/categories"><FolderCog size={15} />Quản lý danh mục</Link></Button>
          </div>
        </div>
        <aside className={styles.overview} aria-label="Tổng quan thư viện">
          <p>THƯ VIỆN CỦA BỘ MÔN CNTT</p>
          <dl className={styles.stats}>
            <div><dd>{count(total)}</dd><dt>Website</dt></div>
            <div><dd>{count(studentCount)}</dd><dt>Sản phẩm SV</dt></div>
            <div><dd>{count(categories.length)}</dd><dt>Danh mục</dt></div>
          </dl>
          <Link href="/#projects"><span>Xem bộ sưu tập sản phẩm sinh viên</span><ArrowUpRight size={16} /></Link>
        </aside>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.toolbarTop}>
          <div className={styles.search}>
            <Search size={17} />
            <input ref={searchInputRef} type="search" value={search} onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Tìm theo tên, mô tả hoặc địa chỉ website..." aria-label="Tìm kiếm hệ thống" />
            {search && <button type="button" aria-label="Xóa từ khóa tìm kiếm" onClick={() => { onSearchChange(""); searchInputRef.current?.focus(); }}><X size={16} /></button>}
          </div>
          <div className={styles.controls}>
            <Select value={sort} onValueChange={onSortChange}>
              <SelectTrigger aria-label="Sắp xếp danh sách hệ thống" className="h-11 min-w-36 text-xs"><SlidersHorizontal size={14} /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem><SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="name-asc">Tên A–Z</SelectItem><SelectItem value="name-desc">Tên Z–A</SelectItem>
              </SelectContent>
            </Select>
            <div className={styles.view} role="group" aria-label="Chọn kiểu hiển thị">
              <button type="button" title="Dạng lưới" aria-label="Dạng lưới" aria-pressed={view === "grid"} onClick={() => onViewChange("grid")}><Grid2X2 size={17} /></button>
              <button type="button" title="Dạng danh sách" aria-label="Dạng danh sách" aria-pressed={view === "list"} onClick={() => onViewChange("list")}><List size={18} /></button>
            </div>
          </div>
        </div>
        <div className={styles.filters} role="group" aria-label="Lọc theo danh mục">
          <span>Danh mục</span>
          <button type="button" className={styles.chip} aria-pressed={category === "all"} onClick={() => onCategoryChange("all")}>Tất cả<span>{count(total)}</span></button>
          {categories.map((item) => <button key={item.id} type="button" className={styles.chip} aria-pressed={category === item.id} onClick={() => onCategoryChange(item.id)}>
            {getCategoryDisplayName(item.name)}<span>{formatNumber(item.websiteCount)}</span>
          </button>)}
        </div>
      </div>

      <div className={styles.scopeRow}>
        <div className={styles.scopes} role="group" aria-label="Loại website">
          {[["all", "Tất cả website", total], ["student", "Sản phẩm sinh viên", studentCount], ["tools", "Công cụ khác", total - studentCount]].map(([value, label, number]) =>
            <button key={value} type="button" aria-pressed={scope === value} onClick={() => setScope(String(value))}>{label}<span>{count(Number(number))}</span></button>)}
        </div>
        <div className={styles.status}>
          <p role="status">{error ? "Chưa tải được dữ liệu" : loading ? "Đang tải hệ thống..." : `Hiển thị ${formatNumber(visibleWebsites.length)} website`}{activeCategory && !loading && !error ? ` · ${getCategoryDisplayName(activeCategory.name)}` : ""}</p>
          {filtered && <button type="button" onClick={clearFilters}>Xóa bộ lọc</button>}
        </div>
      </div>

      {error ? <WebsiteLoadError onRetry={onRetry} /> : loading ?
        <div aria-busy="true" aria-label="Đang tải danh sách hệ thống" className={view === "grid" ? styles.grid : styles.list}>
          {Array.from({ length: 6 }, (_, index) => <WebsiteSkeleton key={index} view={view} />)}
        </div> : !visibleWebsites.length ?
        <div className={styles.empty}>
          <Search size={30} /><h2>{filtered ? "Chưa tìm thấy website phù hợp" : "Thư viện đang chờ liên kết đầu tiên"}</h2>
          <p>{filtered ? "Thử một từ khóa khác hoặc xóa bộ lọc để xem toàn bộ thư viện." : "Thêm website học tập, công việc hoặc một sản phẩm mới của bạn."}</p>
          <Button variant="outline" onClick={filtered ? clearFilters : onAdd}>{filtered ? "Xóa tất cả bộ lọc" : "Thêm website đầu tiên"}</Button>
        </div> :
        <div id="directory-results" className={view === "grid" ? styles.grid : styles.list}>
          {visibleWebsites.map((website) => <WebsiteCard key={website.id} website={website} view={view} directory onEdit={() => onEdit(website)} onDelete={() => onDelete(website)} />)}
        </div>}

      <div className={styles.help}>
        <div className={styles.helpItem}><GraduationCap size={20} /><div><h2>Sản phẩm sinh viên</h2><p>Anh Em Motor, My Interview, V-Shield, Victionary English và SHB Agents là 5 sản phẩm được giới thiệu của bộ môn.</p></div></div>
        <div className={styles.helpItem}><MousePointer2 size={20} /><div><h2>Mở nhanh, không mất trang</h2><p>Chọn một thẻ để mở website trong tab mới. Dùng Ctrl/Cmd + K để tìm kiếm, hoặc đổi sang dạng danh sách để xem gọn hơn.</p></div></div>
        <div className={styles.helpItem}><LockKeyhole size={20} /><div><h2>Lưu ý khi trải nghiệm</h2><p>Anh Em Motor và SHB Agents cần tài khoản được cấp. Các công cụ bên ngoài có chính sách tài khoản và sử dụng riêng.</p></div></div>
      </div>
      <div className={styles.about}>
        <div><h2>Học thật. Làm thật. Kết nối từ những dòng code.</h2><p>Không gian của bộ môn Công nghệ thông tin, FPT Polytechnic: nơi giới thiệu những ứng dụng do sinh viên xây dựng và tập hợp công cụ hỗ trợ học tập, sáng tạo, làm việc. Công cụ bên ngoài không phải sản phẩm của sinh viên.</p></div>
        <Link href="/about">Về bộ môn<ArrowRight size={16} /></Link>
      </div>
    </section>
  );
}
