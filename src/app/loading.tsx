import { WebsiteSkeleton } from "@/components/websites/website-skeleton";

export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Đang tải bảng điều khiển FPT Polytechnic"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <div className="h-16 border-b border-border bg-surface/90">
        <div className="mx-auto flex h-full max-w-[1600px] items-center gap-3 px-3 sm:px-6">
          <div className="h-8 w-24 animate-pulse rounded bg-muted sm:h-9 sm:w-[120px]" />
          <div className="mx-auto h-9 min-w-0 max-w-lg flex-1 animate-pulse rounded-lg bg-muted" />
          <div className="size-9 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1600px] flex-1">
        <aside className="hidden h-[calc(100vh-64px)] w-[232px] space-y-6 border-r border-border bg-surface p-4 lg:block">
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-9 animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-9 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-7 flex flex-col gap-2">
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            <div className="h-8 w-44 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-52 animate-pulse rounded bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <WebsiteSkeleton key={index} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
