import "server-only";

import { mkdir, rm } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import sharp, { type Metadata } from "sharp";
import { HttpError } from "@/lib/http-error";

const allowedByExtension = new Map([
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
]);
const mimeByFormat: Record<string, string> = { png: "image/png", jpeg: "image/jpeg", webp: "image/webp" };

export function maxUploadBytes() {
  const configured = Number(process.env.MAX_UPLOAD_MB ?? 5);
  const megabytes = Number.isFinite(configured) ? Math.min(10, Math.max(1, configured)) : 5;
  return megabytes * 1024 * 1024;
}

export async function storeImage(file: File, kind: "logo" | "poster") {
  if (process.env.STORAGE_DRIVER !== "local") {
    throw new HttpError(409, "UPLOAD_DISABLED", "Máy chủ chưa bật lưu ảnh cục bộ. Hãy dùng URL HTTPS hoặc cấu hình STORAGE_DRIVER=local trên ổ đĩa bền vững.");
  }
  if (!file.size || file.size > maxUploadBytes()) {
    throw new HttpError(413, "FILE_SIZE", `Ảnh phải có dung lượng từ 1 byte đến ${Math.round(maxUploadBytes() / 1024 / 1024)} MB.`);
  }

  const extension = extname(file.name).toLowerCase();
  const expectedMime = allowedByExtension.get(extension);
  if (!expectedMime || expectedMime !== file.type.toLowerCase()) {
    throw new HttpError(400, "FILE_TYPE", "Chỉ chấp nhận PNG, JPEG hoặc WebP có phần mở rộng và MIME khớp nhau.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let metadata: Metadata;
  try {
    metadata = await sharp(buffer, { failOn: "error", limitInputPixels: 16_777_216 }).metadata();
  } catch {
    throw new HttpError(400, "FILE_CONTENT", "Nội dung file không phải ảnh hợp lệ.");
  }
  const actualMime = metadata.format ? mimeByFormat[metadata.format] : undefined;
  if (!actualMime || actualMime !== expectedMime || !metadata.width || !metadata.height) {
    throw new HttpError(400, "FILE_CONTENT", "Định dạng thực tế của ảnh không khớp tên file hoặc MIME.");
  }
  if (metadata.width > 4096 || metadata.height > 4096) {
    throw new HttpError(400, "IMAGE_DIMENSIONS", "Kích thước ảnh tối đa là 4096 × 4096 px.");
  }

  const fileName = `${kind}-${randomUUID()}.webp`;
  const uploadRoot = resolve(process.cwd(), "public", "uploads");
  const destination = resolve(join(uploadRoot, fileName));
  if (!destination.startsWith(`${uploadRoot}\\`) && !destination.startsWith(`${uploadRoot}/`)) {
    throw new HttpError(400, "FILE_PATH", "Đường dẫn ảnh không hợp lệ.");
  }
  await mkdir(uploadRoot, { recursive: true });
  const maximumDimension = kind === "logo" ? 1024 : 2400;
  try {
    await sharp(buffer, { failOn: "error" })
      .rotate()
      .resize({ width: maximumDimension, height: maximumDimension, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile(destination);
  } catch {
    await rm(destination, { force: true }).catch(() => undefined);
    throw new HttpError(400, "FILE_CONTENT", "Không thể xử lý ảnh. Vui lòng kiểm tra lại file PNG, JPEG hoặc WebP.");
  }
  return `/uploads/${fileName}`;
}

export async function removeOwnedImage(url: string) {
  if (!/^\/uploads\/(?:logo|poster)-[a-f0-9-]+\.webp$/.test(url)) return;
  const uploadRoot = resolve(process.cwd(), "public", "uploads");
  const target = resolve(join(process.cwd(), "public", url.replace(/^\//, "")));
  if (target.startsWith(`${uploadRoot}\\`) || target.startsWith(`${uploadRoot}/`)) {
    await rm(target, { force: true });
  }
}
