import { apiError, ok } from "@/lib/api";
import { websiteInputSchema } from "@/schemas/website.schema";
import { websiteService } from "@/services/website.service";

export async function GET(request: Request) {
  try { const { searchParams } = new URL(request.url); const data = await websiteService.list({ search: searchParams.get("search") || undefined, categoryId: searchParams.get("categoryId") || undefined, sort: searchParams.get("sort") || undefined }); return ok(data, 200, data.length); } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try { const input = websiteInputSchema.parse(await request.json()); return ok(await websiteService.create(input), 201); } catch (error) { return apiError(error); }
}
