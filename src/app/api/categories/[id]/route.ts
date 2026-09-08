import { apiError, ok } from "@/lib/api";
import { categoryInputSchema } from "@/schemas/category.schema";
import { categoryService } from "@/services/category.service";

function serialize(category: NonNullable<Awaited<ReturnType<typeof categoryService.get>>>) { const { _count, ...rest } = category; return { ...rest, websiteCount: _count.websites }; }
export async function GET(_request: Request, context: RouteContext<"/api/categories/[id]">) { try { const { id } = await context.params; const category = await categoryService.get(id); if (!category) return Response.json({ success: false, error: { code: "NOT_FOUND", message: "Category not found." } }, { status: 404 }); return ok(serialize(category)); } catch (error) { return apiError(error); } }
export async function PUT(request: Request, context: RouteContext<"/api/categories/[id]">) { try { const { id } = await context.params; return ok(serialize(await categoryService.update(id, categoryInputSchema.parse(await request.json())))); } catch (error) { return apiError(error); } }
export async function DELETE(_request: Request, context: RouteContext<"/api/categories/[id]">) { try { const { id } = await context.params; await categoryService.delete(id); return ok({ id }); } catch (error) { return apiError(error); } }
