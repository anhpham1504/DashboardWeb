import { apiError, ok } from "@/lib/api";
import { checkOrigin, readJson, requireAdmin } from "@/lib/auth";
import {
  entitySchema,
  idSchema,
  listQuerySchema,
} from "@/schemas/admin.schema";
import { getAdmin, listAdmin, mutateAdmin } from "@/services/admin.service";
import { HttpError } from "@/lib/http-error";
type Context = { params: Promise<{ entity: string; id?: string[] }> };
async function handle(request: Request, context: Context) {
  try {
    const session = await requireAdmin();
    const params = await context.params;
    const entity = entitySchema.parse(params.entity);
    if (params.id && params.id.length !== 1)
      throw new HttpError(404, "NOT_FOUND", "Không tìm thấy đường dẫn.");
    const id = params.id?.[0] ? idSchema.parse(params.id[0]) : undefined;
    if (request.method === "GET") {
      const data = id
        ? await getAdmin(entity, id)
        : await listAdmin(
            entity,
            listQuerySchema.parse(
              Object.fromEntries(new URL(request.url).searchParams),
            ),
          );
      const response = ok(data);
      response.headers.set("Cache-Control", "no-store");
      return response;
    }
    checkOrigin(request);
    const data = await mutateAdmin(
      entity,
      session.userId,
      session.id,
      request.method,
      id,
      request.method === "DELETE" ? null : await readJson(request),
    );
    return ok(data, request.method === "POST" ? 201 : 200);
  } catch (e) {
    return apiError(e);
  }
}
export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
export const PATCH = handle;
