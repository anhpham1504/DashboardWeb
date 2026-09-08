"use client";

import { useState, type RefObject } from "react";
import { LoaderCircle } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form-controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFaviconUrl, normalizeUrl } from "@/lib/url";
import {
  getCategoryDisplayName,
  getUserError,
  getWebsiteDisplayDescription,
} from "@/lib/localization";
import type { CategoryDto, WebsiteDto } from "@/types/models";

export type WebsiteFormValue = {
  name: string;
  url: string;
  description: string;
  categoryId: string | null;
  faviconUrl: string | null;
};

const empty: WebsiteFormValue = {
  name: "",
  url: "",
  description: "",
  categoryId: null,
  faviconUrl: null,
};

function validateUrl(value: string, required: boolean) {
  if (!value.trim()) return required ? "Vui lòng nhập đường dẫn website." : "";

  try {
    const parsed = new URL(normalizeUrl(value));
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "Chỉ hỗ trợ đường dẫn HTTP hoặc HTTPS.";
    }
    return "";
  } catch {
    return "Đường dẫn website không hợp lệ.";
  }
}

export function WebsiteFormDialog({
  open,
  onOpenChange,
  website,
  categories,
  onSubmit,
  returnFocusRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  website: WebsiteDto | null;
  categories: CategoryDto[];
  onSubmit: (value: WebsiteFormValue) => Promise<void>;
  returnFocusRef?: RefObject<HTMLElement | null>;
}) {
  const [value, setValue] = useState<WebsiteFormValue>(() =>
    website
      ? {
          name: website.name,
          url: website.url,
          description: website.description
            ? getWebsiteDisplayDescription(website.description)
            : "",
          categoryId: website.categoryId,
          faviconUrl:
            website.faviconUrl === getFaviconUrl(website.url)
              ? null
              : website.faviconUrl,
        }
      : empty
  );

  const [touched, setTouched] = useState<{
    name?: boolean;
    url?: boolean;
    faviconUrl?: boolean;
  }>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const nameError =
    touched.name && !value.name.trim()
      ? "Tên website không được để trống."
      : "";
  const urlError = touched.url ? validateUrl(value.url, true) : "";
  const faviconError = touched.faviconUrl
    ? validateUrl(value.faviconUrl || "", false)
    : "";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setTouched({ name: true, url: true, faviconUrl: true });

    if (
      !value.name.trim() ||
      validateUrl(value.url, true) ||
      validateUrl(value.faviconUrl || "", false)
    ) {
      setError("Vui lòng kiểm tra các trường được đánh dấu.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const submittedValue =
        website &&
        value.description === getWebsiteDisplayDescription(website.description)
          ? { ...value, description: website.description || "" }
          : value;
      await onSubmit(submittedValue);
      onOpenChange(false);
    } catch (reason) {
      setError(getUserError(reason, "Không thể lưu website."));
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
            {website ? "Chỉnh sửa website" : "Thêm website"}
          </DialogTitle>
          <DialogDescription>
            {website
              ? "Cập nhật thông tin website."
              : "Lưu website để truy cập nhanh sau này."}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={submit} className="mt-5 space-y-4">
          <Field
            label="Tên website *"
            error={nameError}
            errorId="website-name-error"
          >
            <Input
              id="website-name"
              autoFocus
              autoComplete="off"
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "website-name-error" : undefined}
              aria-required="true"
              maxLength={100}
              value={value.name}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              onChange={(e) => {
                setValue({ ...value, name: e.target.value });
                if (error) setError("");
              }}
              placeholder="Nhập tên website"
            />
          </Field>

          <Field label="Đường dẫn *" error={urlError} errorId="website-url-error">
            <Input
              id="website-url"
              inputMode="url"
              autoComplete="url"
              aria-invalid={Boolean(urlError)}
              aria-describedby={urlError ? "website-url-error" : undefined}
              aria-required="true"
              spellCheck={false}
              value={value.url}
              onBlur={() => setTouched((prev) => ({ ...prev, url: true }))}
              onChange={(e) => {
                setValue({ ...value, url: e.target.value });
                if (error) setError("");
              }}
              placeholder="https://github.com"
            />
          </Field>

          <Field
            label="Mô tả"
            counter={`${value.description.length}/250`}
            hint="Mô tả ngắn hoặc ghi chú"
          >
            <Textarea
              maxLength={250}
              value={value.description}
              onChange={(e) =>
                setValue({ ...value, description: e.target.value })
              }
              placeholder="Nhập mô tả ngắn..."
              className="min-h-24"
            />
          </Field>

          <Field label="Danh mục">
            <Select
              value={value.categoryId || "uncategorized"}
              onValueChange={(categoryId) =>
                setValue({
                  ...value,
                  categoryId: categoryId === "uncategorized" ? null : categoryId,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uncategorized">Chưa phân loại</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {getCategoryDisplayName(category.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field
            label="Đường dẫn favicon (không bắt buộc)"
            hint="Để trống để tự động nhận diện từ đường dẫn website"
            error={faviconError}
            errorId="website-favicon-error"
          >
            <Input
              id="website-favicon"
              inputMode="url"
              aria-invalid={Boolean(faviconError)}
              aria-describedby={
                faviconError ? "website-favicon-error" : undefined
              }
              spellCheck={false}
              value={value.faviconUrl || ""}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, faviconUrl: true }))
              }
              onChange={(e) =>
                setValue({
                  ...value,
                  faviconUrl: e.target.value.trim() ? e.target.value : null,
                })
              }
              placeholder="https://example.com/favicon.ico"
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
                  : website
                    ? "Lưu thay đổi"
                    : "Thêm website"}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
