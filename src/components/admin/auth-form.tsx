"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brand, ThemeToggle } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/client-api";

export function AuthForm({ change = false }: { change?: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-9">
        <div className="mb-8 flex items-center justify-between">
          <Brand />
          <ThemeToggle />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-strong">
          Cổng sản phẩm CNTT
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold">
          {change ? "Đổi mật khẩu tạm" : "Đăng nhập quản trị"}
        </h1>
        <p className="mb-6 mt-3 text-sm text-muted-foreground">
          {change
            ? "Đặt mật khẩu mới từ 8 đến 128 ký tự để bảo vệ tài khoản."
            : "Sử dụng tài khoản được quản trị viên cấp."}
        </p>
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            const values = new FormData(event.currentTarget);
            const body = change
              ? {
                  currentPassword: values.get("currentPassword"),
                  password: values.get("password"),
                }
              : {
                  username: values.get("username"),
                  password: values.get("password"),
                };
            try {
              const data = await apiRequest<{ redirect: string }>(
                `/api/auth/${change ? "change-password" : "login"}`,
                { method: "POST", body: JSON.stringify(body) },
              );
              router.replace(data.redirect);
              router.refresh();
            } catch (cause) {
              setError(
                cause instanceof Error ? cause.message : "Không thể đăng nhập.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          {change ? (
            <label className="grid gap-2 text-sm font-semibold">
              Mật khẩu hiện tại
              <input
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                maxLength={128}
                className="rounded-lg border bg-background px-3 py-3"
              />
            </label>
          ) : (
            <label className="grid gap-2 text-sm font-semibold">
              Tên đăng nhập
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                minLength={3}
                maxLength={64}
                spellCheck={false}
                className="rounded-lg border bg-background px-3 py-3"
              />
            </label>
          )}
          <label className="grid gap-2 text-sm font-semibold">
            {change ? "Mật khẩu mới" : "Mật khẩu"}
            <input
              name="password"
              type="password"
              required
              minLength={change ? 8 : 1}
              maxLength={128}
              autoComplete={change ? "new-password" : "current-password"}
              className="rounded-lg border bg-background px-3 py-3"
              aria-describedby={error ? "auth-error" : undefined}
            />
          </label>
          {error ? (
            <p id="auth-error" role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
          <Button disabled={busy} type="submit" className="mt-2 h-12">
            {busy ? "Đang xử lý..." : change ? "Lưu mật khẩu mới" : "Đăng nhập"}
          </Button>
        </form>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-muted-foreground"
        >
          ← Về trang giới thiệu
        </Link>
      </div>
    </main>
  );
}
