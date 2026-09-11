import {redirect} from "next/navigation";
import {currentSession} from "@/lib/auth";
import {AuthForm} from "@/components/admin/auth-form";
export const metadata={title:"Đổi mật khẩu tạm",robots:{index:false,follow:false}};
export default async function Page(){if(!await currentSession())redirect("/admin/login");return <AuthForm change/>;}
