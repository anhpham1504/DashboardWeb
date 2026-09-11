import {apiError,ok} from "@/lib/api";
import {prisma} from "@/lib/prisma";
import {idSchema} from "@/schemas/admin.schema";
import {legacyMutation} from "@/lib/legacy-admin";
import {HttpError} from "@/lib/http-error";
type Context={params:Promise<{id:string}>};
export async function GET(_r:Request,c:Context){try{const id=idSchema.parse((await c.params).id);const item=await prisma.category.findFirst({where:{id,isVisible:true},include:{_count:{select:{websites:{where:{isVisible:true}}}}}});if(!item)throw new HttpError(404,"NOT_FOUND","Không tìm thấy danh mục.");const {_count,...rest}=item;return ok({...rest,websiteCount:_count.websites});}catch(e){return apiError(e);}}
export async function PUT(r:Request,c:Context){return legacyMutation(r,"categories",(await c.params).id);}
export async function DELETE(r:Request,c:Context){return legacyMutation(r,"categories",(await c.params).id);}
