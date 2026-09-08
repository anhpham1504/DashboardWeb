"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6 text-center text-foreground">
      <div className="max-w-md">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-danger/10 text-danger">
          <RefreshCcw size={22} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Không thể tải ứng dụng</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Có lỗi xảy ra khi tải FPT Polytechnic. Vui lòng thử lại.
        </p>
        <Button className="mt-5" size="sm" onClick={reset}>
          <RefreshCcw size={14} />
          <span>Thử lại</span>
        </Button>
      </div>
    </main>
  );
}
