import { z } from "zod";
import { assertSafeUrl, normalizeUrl } from "@/lib/url";

export const websiteInputSchema = z.object({
  name: z.string().trim().min(1, "Website name is required.").max(100),
  url: z.string().trim().min(1, "URL is required.").transform(normalizeUrl).refine((value) => { try { assertSafeUrl(value); return true; } catch { return false; } }, "Enter a valid http or https URL."),
  description: z.string().trim().max(250).optional().nullable(),
  categoryId: z.string().trim().optional().nullable(),
  faviconUrl: z.string().trim().optional().nullable(),
});

export type WebsiteInput = z.infer<typeof websiteInputSchema>;
