"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={400}>{children}</TooltipProvider>
      <Toaster
        containerAriaLabel="Thông báo"
        customAriaLabel="Thông báo"
        closeButton
        richColors
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          closeButtonAriaLabel: "Đóng thông báo",
        }}
      />
    </ThemeProvider>
  );
}
