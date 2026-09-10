import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-[7px] border border-input bg-surface px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-danger/20",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y rounded-[7px] border border-input bg-surface p-3 text-sm leading-6 text-foreground transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-danger/20",
        className
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  error,
  counter,
  hint,
  errorId,
  children,
}: {
  label: string;
  error?: string;
  counter?: string;
  hint?: string;
  errorId?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-foreground">
      <div className="flex items-center justify-between">
        <span>{label}</span>
        {counter && (
          <span className="text-xs font-normal text-muted-foreground">{counter}</span>
        )}
      </div>
      {children}
      {hint && !error && (
        <span className="text-xs font-normal text-muted-foreground">{hint}</span>
      )}
      {error && (
        <span
          id={errorId}
          className="text-xs font-medium text-danger"
          role="alert"
        >
          {error}
        </span>
      )}
    </label>
  );
}
