import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-center text-foreground">
      <div className="max-w-md">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Không tìm thấy trang
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
        </p>
        <Button asChild className="mt-6" size="sm">
          <Link href="/">
            <Home size={15} />
            <span>Về trang chính</span>
          </Link>
        </Button>
      </div>
    </main>
  );
}
