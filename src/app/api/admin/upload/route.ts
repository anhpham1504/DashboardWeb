import { z } from "zod";
import { apiError, ok } from "@/lib/api";
import { checkOrigin, lockSecurityWrites, requireAdmin, requireTransactionSession } from "@/lib/auth";
import { HttpError } from "@/lib/http-error";
import { maxUploadBytes, removeOwnedImage, storeImage } from "@/lib/image-storage";
import { prisma } from "@/lib/prisma";

const kindSchema = z.enum(["logo", "poster"]);

export async function POST(request: Request) {
  let storedUrl: string | undefined;
  try {
    const session = await requireAdmin();
    checkOrigin(request);
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data;")) {
      throw new HttpError(400, "BAD_REQUEST", "Yêu cầu tải ảnh phải dùng multipart/form-data.");
    }
    const declaredLength = Number(request.headers.get("content-length"));
    const requestLimit = maxUploadBytes() + 256 * 1024;
    if (!Number.isSafeInteger(declaredLength) || declaredLength <= 0) {
      throw new HttpError(411, "LENGTH_REQUIRED", "Cần khai báo dung lượng dữ liệu tải lên.");
    }
    if (declaredLength > requestLimit) throw new HttpError(413, "TOO_LARGE", "Dữ liệu tải lên quá lớn.");
    const form = await request.formData();
    const formKeys = [...form.keys()];
    if (formKeys.some((key) => key !== "file" && key !== "kind") || form.getAll("file").length !== 1 || form.getAll("kind").length !== 1) {
      throw new HttpError(400, "BAD_REQUEST", "Biểu mẫu tải ảnh không hợp lệ.");
    }
    const file = form.get("file");
    const kind = kindSchema.parse(form.get("kind"));
    if (!(file instanceof File)) throw new HttpError(400, "FILE_REQUIRED", "Vui lòng chọn ảnh.");
    storedUrl = await storeImage(file, kind);
    await prisma.$transaction(async (tx) => {
      await lockSecurityWrites(tx);
      await requireTransactionSession(tx, session.id, { admin: true });
      await tx.auditLog.create({
        data: { actorUserId: session.userId, action: "IMAGE_UPLOADED", entityType: "Image", metadata: { kind, url: storedUrl } },
      });
    });
    return ok({ url: storedUrl }, 201);
  } catch (error) {
    if (storedUrl) await removeOwnedImage(storedUrl).catch(() => undefined);
    return apiError(error);
  }
}
