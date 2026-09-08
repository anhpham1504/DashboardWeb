"use client";

import { useState, type RefObject } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/form-controls";
import {
  getCategoryDisplayDescription,
  getCategoryDisplayName,
  getUserError,
} from "@/lib/localization";
import type { CategoryDto } from "@/types/models";

export type CategoryFormValue = { name: string; description: string };

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  returnFocusRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryDto | null;
  onSubmit: (value: CategoryFormValue) => Promise<void>;
  returnFocusRef?: RefObject<HTMLElement | null>;
}) {
  const [value, setValue] = useState<CategoryFormValue>(() => ({
    name: category ? getCategoryDisplayName(category.name) : "",
    description: category?.description
      ? getCategoryDisplayDescription(category.description)
      : "",
  }));
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const nameError =
    touched && !value.name.trim() ? "Vui lòng nhập tên danh mục." : "";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);

    if (!value.name.trim()) {
      setError("Vui lòng nhập tên danh mục.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const submittedValue = category
        ? {
            name:
              value.name === getCategoryDisplayName(category.name)
                ? category.name
                : value.name,
            description:
              value.description ===
              getCategoryDisplayDescription(category.description)
                ? category.description || ""
                : value.description,
          }
        : value;
      await onSubmit(submittedValue);
      onOpenChange(false);
    } catch (reason) {
      setError(getUserError(reason, "Không thể lưu danh mục."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[480px]"
        onCloseAutoFocus={(event) => {
          if (!returnFocusRef?.current?.isConnected) return;
          event.preventDefault();
          returnFocusRef.current.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {category ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Cập nhật thông tin danh mục."
              : "Tạo danh mục để sắp xếp các website."}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={submit} className="mt-5 space-y-4">
          <Field
            label="Tên danh mục *"
            error={nameError}
            errorId="category-name-error"
          >
            <Input
              id="category-name"
              autoFocus
              autoComplete="off"
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "category-name-error" : undefined}
              aria-required="true"
              maxLength={50}
              value={value.name}
              onBlur={() => setTouched(true)}
              onChange={(e) => {
                setValue({ ...value, name: e.target.value });
                if (error) setError("");
              }}
              placeholder="Ví dụ: Thiết kế, Năng suất, Mạng xã hội"
            />
          </Field>

          <Field
            label="Mô tả"
            counter={`${value.description.length}/200`}
            hint="Mô tả ngắn cho danh mục"
          >
            <Textarea
              maxLength={200}
              value={value.description}
              onChange={(e) =>
                setValue({ ...value, description: e.target.value })
              }
              placeholder="Nhập mô tả danh mục..."
              className="min-h-24"
            />
          </Field>

          {error && (
            <div
              className="rounded-lg border border-danger/20 bg-danger/10 px-3 py-2.5 text-sm text-danger"
              role="alert"
            >
              {error}
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit" disabled={saving} size="sm">
              {saving && <LoaderCircle className="animate-spin" size={14} />}
              <span>
                {saving
                  ? "Đang lưu..."
                  : category
                    ? "Lưu thay đổi"
                    : "Thêm danh mục"}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
