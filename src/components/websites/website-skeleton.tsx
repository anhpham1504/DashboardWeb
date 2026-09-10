export function WebsiteSkeleton({ view = "grid" }: { view?: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div className="flex min-h-20 animate-pulse items-center justify-between gap-3.5 rounded-[7px] border border-border bg-surface px-4 py-3.5">
        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          <div className="size-10 shrink-0 rounded-[7px] bg-muted" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-4 w-1/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden md:block h-2.5 w-20 rounded bg-muted" />
          <div className="size-8 rounded bg-muted" />
          <div className="size-8 rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[230px] animate-pulse flex-col justify-between rounded-[7px] border border-border bg-surface p-5">
      <div>
        <div className="flex items-start justify-between">
          <div className="size-12 rounded-[7px] bg-muted" />
          <div className="size-8 rounded-[5px] bg-muted" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-5 w-3/5 rounded bg-muted" />
          <div className="h-3.5 w-full rounded bg-muted" />
          <div className="h-3.5 w-4/5 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 space-y-2.5">
        <div className="h-6 w-20 rounded-md bg-muted" />
        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="size-3.5 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
