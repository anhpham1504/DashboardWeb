import {AuthForm} from "@/components/admin/auth-form";
import {currentSession} from "@/lib/auth";
import {redirect} from "next/navigation";
export const metadata={title:"Đăng nhập quản trị",robots:{index:false,follow:false}};
export default async function Page(){const session=await currentSession();if(session)redirect(session.user.mustChangePassword?"/change-password":session.user.role==="ADMIN"?"/admin":"/systems");return <AuthForm/>;}
