import { z } from "zod";
import { slugify } from "@/lib/slug";
export const idSchema = z
  .string()
  .trim()
  .min(1)
  .max(191)
  .regex(/^[a-zA-Z0-9_-]+$/);
export const passwordSchema = z
  .string()
  .min(8, "Mật khẩu cần ít nhất 8 ký tự.")
  .max(128, "Mật khẩu tối đa 128 ký tự.");
const name = z.string().trim().min(1, "Vui lòng nhập tên.").max(100);
export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Tên đăng nhập cần ít nhất 3 ký tự.")
  .max(64)
  .regex(
    /^[a-z0-9._-]+$/,
    "Tên đăng nhập chỉ gồm chữ thường, số, dấu chấm, gạch dưới hoặc gạch ngang.",
  );
const optionalEmail = z
  .union([
    z.email("Email không hợp lệ.").trim().toLowerCase().max(191),
    z.literal(""),
  ])
  .default("");
export const loginSchema = z
  .object({ username: usernameSchema, password: z.string().min(1).max(128) })
  .strict();
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(128),
    password: passwordSchema,
  })
  .strict();
export const slugSchema = z
  .string()
  .trim()
  .max(150)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$|^$/,
    "Slug chỉ chứa chữ thường, số và dấu gạch ngang.",
  )
  .default("");
export const safeUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => {
    try {
      const u = new URL(v);
      return (
        ["https:", "http:"].includes(u.protocol) && !u.username && !u.password
      );
    } catch {
      return false;
    }
  }, "URL phải là http hoặc https hợp lệ.");
export const imageUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (v) =>
      !v ||
      (/^\/(?:branding|software-icons|showcase|uploads)\/[a-zA-Z0-9._/-]+$/.test(
        v,
      ) &&
        !v.includes("..")) ||
      (/^https:\/\//.test(v) && safeUrlSchema.safeParse(v).success),
    "Ảnh phải là URL HTTPS hoặc tài nguyên nội bộ hợp lệ.",
  );
export const websiteAdminSchema = z
  .object({
    name,
    slug: slugSchema,
    url: safeUrlSchema,
    shortDescription: z.string().trim().max(500).default(""),
    description: z.string().trim().max(20000).default(""),
    logoUrl: imageUrlSchema.default(""),
    posterUrl: imageUrlSchema.default(""),
    categoryId: z.union([idSchema, z.literal(""), z.null()]).default(null),
    keywords: z.string().trim().max(500).default(""),
    displayOrder: z.number().int().min(0).max(1000000).default(0),
    isFeatured: z.boolean().default(false),
    isVisible: z.boolean().default(true),
  })
  .strict()
  .transform((v) => ({ ...v, slug: v.slug || slugify(v.name) }))
  .refine((v) => Boolean(v.slug), {
    path: ["slug"],
    message: "Vui lòng nhập slug.",
  });
export const categoryAdminSchema = z
  .object({
    name,
    slug: slugSchema,
    description: z.string().trim().max(2000).default(""),
    displayOrder: z.number().int().min(0).max(1000000).default(0),
    isVisible: z.boolean().default(true),
  })
  .strict()
  .transform((v) => ({ ...v, slug: v.slug || slugify(v.name) }))
  .refine((v) => Boolean(v.slug), {
    path: ["slug"],
    message: "Vui lòng nhập slug.",
  });
export const userCreateSchema = z
  .object({
    username: usernameSchema,
    email: optionalEmail,
    fullName: name,
    password: passwordSchema,
    role: z.enum(["USER", "ADMIN"]),
    status: z.enum(["ACTIVE", "LOCKED"]).default("ACTIVE"),
  })
  .strict();
export const userUpdateSchema = userCreateSchema
  .omit({ password: true })
  .strict();
export const resetPasswordSchema = z
  .object({ password: passwordSchema })
  .strict();
export const listQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).max(100000).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().max(100).default(""),
    categoryId: idSchema.optional(),
    sort: z
      .enum(["order", "newest", "oldest", "updated", "name-asc", "name-desc"])
      .default("order"),
    visible: z.enum(["all", "true", "false"]).default("all"),
    role: z.enum(["all", "ADMIN", "USER"]).default("all"),
    status: z.enum(["all", "ACTIVE", "LOCKED"]).default("all"),
  })
  .strict();
export const publicQuerySchema = listQuerySchema
  .omit({ visible: true, role: true, status: true })
  .strict();
export const entitySchema = z.enum([
  "websites",
  "categories",
  "users",
  "dashboard",
  "audit",
]);
