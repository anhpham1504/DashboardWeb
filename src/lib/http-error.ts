export class HttpError extends Error {
  constructor(public status:number,public code:string,message:string){super(message);}
}
export function assertAdmin(role:string){if(role!=="ADMIN") throw new HttpError(403,"FORBIDDEN","Bạn không có quyền quản trị.");}
export function assertLastAdmin(activeAdmins:number, wasAdmin:boolean, willBeAdmin:boolean){
  if(wasAdmin && !willBeAdmin && activeAdmins<=1) throw new HttpError(409,"LAST_ADMIN","Không thể vô hiệu hóa quản trị viên cuối cùng.");
}
