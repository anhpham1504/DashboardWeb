"use client";

import { FolderOpen, Plus, RefreshCcw, SearchX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoryDisplayName } from "@/lib/localization";

export function WebsiteLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="grid min-h-72 place-items-center rounded-[7px] border border-dashed border-border bg-surface p-8 text-center"
    >
      <div className="max-w-md">
        <div className="mx-auto mb-3 grid size-10 place-items-center rounded-[7px] bg-danger/10 text-danger">
          <RefreshCcw size={18} />
        </div>
        <h2 className="text-base font-semibold text-foreground">
          Không thể tải danh sách website
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Có lỗi xảy ra khi tải dữ liệu website. Vui lòng thử lại.
        </p>
        <Button
          size="sm"
          variant="secondary"
          className="mt-4"
          onClick={onRetry}
        >
          <RefreshCcw size={14} />
          <span>Thử lại</span>
        </Button>
      </div>
    </div>
  );
}

export function WebsiteEmptyState({
  search,
  category,
  categoryName,
  onClearSearch,
  onShowAll,
  onAdd,
}: {
  search: string;
  category: string;
  categoryName?: string;
  onClearSearch: () => void;
  onShowAll: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="grid min-h-72 place-items-center rounded-[7px] border border-dashed border-border bg-surface/50 p-8 text-center">
      <div className="max-w-md">
        {search ? (
          <>
            <EmptyIcon muted>
              <SearchX size={20} />
            </EmptyIcon>
            <h2 className="text-base font-semibold text-foreground">
              Không tìm thấy website
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              Không có kết quả phù hợp với từ khóa &ldquo;{search}&rdquo;. Hãy thử
              một từ khóa khác.
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-4"
              onClick={onClearSearch}
            >
              <X size={14} />
              <span>Xóa từ khóa</span>
            </Button>
          </>
        ) : category !== "all" ? (
          <>
            <EmptyIcon>
              <FolderOpen size={20} />
            </EmptyIcon>
            <h2 className="text-base font-semibold text-foreground">
              Danh mục này chưa có website
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              Hãy thêm website vào &ldquo;{getCategoryDisplayName(categoryName)}&rdquo;
              hoặc chọn một danh mục khác.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button size="sm" variant="secondary" onClick={onShowAll}>
                Xem tất cả website
              </Button>
              <Button size="sm" onClick={onAdd}>
                <Plus size={14} />
                <span>Thêm website</span>
              </Button>
            </div>
          </>
        ) : (
          <>
            <EmptyIcon>
              <Plus size={20} />
            </EmptyIcon>
            <h2 className="text-base font-semibold text-foreground">
              Chưa có website
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              Lưu các website bạn thường sử dụng để truy cập nhanh chỉ với một
              lần nhấp.
            </p>
            <Button size="sm" className="mt-4" onClick={onAdd}>
              <Plus size={14} />
              <span>Thêm website đầu tiên</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyIcon({
  muted = false,
  children,
}: {
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mx-auto mb-3 grid size-11 place-items-center rounded-[7px] ${
        muted
          ? "bg-muted text-muted-foreground"
          : "bg-primary/10 text-primary"
      }`}
    >
      {children}
    </div>
  );
}
