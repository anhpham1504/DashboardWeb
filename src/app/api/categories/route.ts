import { apiError, ok } from "@/lib/api";
import { categoryInputSchema } from "@/schemas/category.schema";
import { categoryService } from "@/services/category.service";

function serialize(category: Awaited<ReturnType<typeof categoryService.list>>[number]) { const { _count, ...rest } = category; return { ...rest, websiteCount: _count.websites }; }
export async function GET() { try { return ok((await categoryService.list()).map(serialize)); } catch (error) { return apiError(error); } }
export async function POST(request: Request) { try { const category = await categoryService.create(categoryInputSchema.parse(await request.json())); return ok(serialize(category), 201); } catch (error) { return apiError(error); } }
