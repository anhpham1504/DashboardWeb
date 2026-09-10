import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

export function Button({
  variant = "primary",
  size = "default",
  asChild,
  className,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  const defaultType = asChild ? undefined : props.type ?? "button";

  return (
    <Component
      type={defaultType}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[5px] text-sm font-semibold transition-[color,background-color,border-color,box-shadow,transform] duration-200 select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px",
        // Variants
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:-translate-y-px hover:bg-primary-hover",
        variant === "secondary" &&
          "border border-border bg-surface text-foreground hover:border-foreground/20 hover:bg-muted/80",
        variant === "outline" &&
          "border border-border bg-transparent text-foreground hover:bg-muted/70",
        variant === "ghost" &&
          "bg-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground",
        variant === "danger" &&
          "bg-danger text-danger-foreground shadow-xs hover:bg-danger/90 hover:shadow-sm",
        // Sizes
        size === "default" && "h-10 px-4",
        size === "sm" && "h-9 px-3 text-sm",
        size === "lg" && "h-11 px-5 text-base",
        size === "icon" && "size-10 p-0",
        size === "icon-sm" && "size-9 p-0",
        className
      )}
      {...props}
    />
  );
}
