import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError } from "@/lib/http-error";

export function ok<T>(data: T, status = 200, total?: number) { return NextResponse.json({ success: true, data, ...(total === undefined ? {} : { total }) }, { status }); }
export function apiError(error: unknown) {
  if(error instanceof HttpError) return NextResponse.json({success:false,error:{code:error.code,message:error.message}},{status:error.status,headers:{"Cache-Control":"no-store"}});
  if (error instanceof ZodError) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: error.issues[0]?.message ?? "Dữ liệu không hợp lệ." } }, { status: 400, headers: { "Cache-Control": "no-store" } });
  if (error instanceof Error && "code" in error && error.code === "NOT_FOUND") return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: error.message } }, { status: 404 });
  if (error instanceof Error && "code" in error && error.code === "CONFLICT") return NextResponse.json({ success: false, error: { code: "CONFLICT", message: error.message } }, { status: 409 });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ success: false, error: { code: "CONFLICT", message: "Tên đăng nhập, email hoặc slug đã tồn tại." } }, { status: 409 });
  if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") return NextResponse.json({success:false,error:{code:"CONFLICT",message:"Danh mục còn website hoặc dữ liệu tham chiếu không tồn tại."}},{status:409});
  if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return NextResponse.json({success:false,error:{code:"NOT_FOUND",message:"Không tìm thấy dữ liệu."}},{status:404});
  console.error("Unhandled API error", { name: error instanceof Error ? error.name : typeof error, code: error instanceof Prisma.PrismaClientKnownRequestError ? error.code : undefined });
  return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Có lỗi nội bộ. Vui lòng thử lại." } }, { status: 500, headers: { "Cache-Control": "no-store" } });
}
