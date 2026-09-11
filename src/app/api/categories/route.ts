import {apiError,ok} from "@/lib/api";
import {prisma} from "@/lib/prisma";
import {legacyMutation} from "@/lib/legacy-admin";
import {publicQuerySchema} from "@/schemas/admin.schema";
export async function GET(request:Request){try{const q=publicQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams));const where={isVisible:true,...(q.search?{name:{contains:q.search}}:{})};const [items,total]=await prisma.$transaction([prisma.category.findMany({where,skip:(q.page-1)*q.pageSize,take:q.pageSize,orderBy:[{displayOrder:"asc"},{name:"asc"}],include:{_count:{select:{websites:{where:{isVisible:true}}}}}}),prisma.category.count({where})]);return ok(items.map(({_count,...item})=>({...item,websiteCount:_count.websites})),200,total);}catch(e){return apiError(e);}}
export async function POST(request:Request){return legacyMutation(request,"categories");}
