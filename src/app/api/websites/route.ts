import {apiError,ok} from "@/lib/api";
import {prisma} from "@/lib/prisma";
import {publicQuerySchema} from "@/schemas/admin.schema";
import {websiteWhere,websiteOrder,websiteInclude} from "@/services/admin.service";
import {legacyMutation} from "@/lib/legacy-admin";
export async function GET(request:Request){try{const q=publicQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams));const query={...q,visible:"all" as const,role:"all" as const,status:"all" as const};const where=websiteWhere(query,true);const [items,total]=await prisma.$transaction([prisma.website.findMany({where,include:websiteInclude,orderBy:websiteOrder(query),skip:(q.page-1)*q.pageSize,take:q.pageSize}),prisma.website.count({where})]);return ok(items,200,total);}catch(e){return apiError(e);}}
export async function POST(request:Request){return legacyMutation(request,"websites");}
