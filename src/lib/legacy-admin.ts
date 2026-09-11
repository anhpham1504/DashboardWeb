import { apiError, ok } from "@/lib/api";
import { requireAdmin, checkOrigin, readJson } from "@/lib/auth";
import { mutateAdmin } from "@/services/admin.service";
import { idSchema } from "@/schemas/admin.schema";
export async function legacyMutation(
  request: Request,
  entity: "websites" | "categories",
  id?: string,
) {
  try {
    const s = await requireAdmin();
    checkOrigin(request);
    if (id) idSchema.parse(id);
    return ok(
      await mutateAdmin(
        entity,
        s.userId,
        s.id,
        request.method,
        id,
        request.method === "DELETE" ? null : await readJson(request),
      ),
      request.method === "POST" ? 201 : 200,
    );
  } catch (e) {
    return apiError(e);
  }
}
