"use client";

import * as React from "react";
import * as Alert from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";

export const AlertDialog = Alert.Root;
export const AlertDialogTrigger = Alert.Trigger;
export const AlertDialogPortal = Alert.Portal;
export const AlertDialogCancel = Alert.Cancel;
export const AlertDialogAction = Alert.Action;

export function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof Alert.Overlay>) {
  return (
    <Alert.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

export function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Alert.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <Alert.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[8px] border border-border border-t-[3px] border-t-primary bg-popover p-5 text-popover-foreground shadow-2xl transition-all duration-200 sm:p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          className
        )}
        {...props}
      >
        {children}
      </Alert.Content>
    </AlertDialogPortal>
  );
}

export function AlertDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-left", className)}
      {...props}
    />
  );
}

export function AlertDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-5",
        className
      )}
      {...props}
    />
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof Alert.Title>) {
  return (
    <Alert.Title
      className={cn("text-2xl font-semibold tracking-[-0.04em] text-foreground", className)}
      {...props}
    />
  );
}

export function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof Alert.Description>) {
  return (
    <Alert.Description
      className={cn("text-sm leading-6 text-muted-foreground", className)}
      {...props}
    />
  );
}
