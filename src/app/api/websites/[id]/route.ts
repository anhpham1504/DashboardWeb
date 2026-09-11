import {apiError,ok} from "@/lib/api";
import {prisma} from "@/lib/prisma";
import {idSchema} from "@/schemas/admin.schema";
import {legacyMutation} from "@/lib/legacy-admin";
import {HttpError} from "@/lib/http-error";
type Context={params:Promise<{id:string}>};
export async function GET(_r:Request,c:Context){try{const id=idSchema.parse((await c.params).id);const item=await prisma.website.findFirst({where:{id,isVisible:true,OR:[{categoryId:null},{category:{isVisible:true}}]},include:{category:{select:{id:true,name:true}}}});if(!item)throw new HttpError(404,"NOT_FOUND","Không tìm thấy website.");return ok(item);}catch(e){return apiError(e);}}
export async function PUT(r:Request,c:Context){return legacyMutation(r,"websites",(await c.params).id);}
export async function DELETE(r:Request,c:Context){return legacyMutation(r,"websites",(await c.params).id);}
