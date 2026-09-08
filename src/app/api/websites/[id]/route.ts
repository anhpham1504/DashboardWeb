import { apiError, ok } from "@/lib/api";
import { websiteInputSchema } from "@/schemas/website.schema";
import { websiteService } from "@/services/website.service";

export async function GET(_request: Request, context: RouteContext<"/api/websites/[id]">) { try { const { id } = await context.params; const item = await websiteService.get(id); if (!item) return Response.json({ success: false, error: { code: "NOT_FOUND", message: "Website not found." } }, { status: 404 }); return ok(item); } catch (error) { return apiError(error); } }
export async function PUT(request: Request, context: RouteContext<"/api/websites/[id]">) { try { const { id } = await context.params; return ok(await websiteService.update(id, websiteInputSchema.parse(await request.json()))); } catch (error) { return apiError(error); } }
export async function DELETE(_request: Request, context: RouteContext<"/api/websites/[id]">) { try { const { id } = await context.params; await websiteService.delete(id); return ok({ id }); } catch (error) { return apiError(error); } }
