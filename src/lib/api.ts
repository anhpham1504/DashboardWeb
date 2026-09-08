import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, status = 200, total?: number) { return NextResponse.json({ success: true, data, ...(total === undefined ? {} : { total }) }, { status }); }
export function apiError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: error.issues[0]?.message ?? "Invalid input." } }, { status: 400 });
  if (error instanceof Error && "code" in error && error.code === "NOT_FOUND") return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: error.message } }, { status: 404 });
  if (error instanceof Error && "code" in error && error.code === "CONFLICT") return NextResponse.json({ success: false, error: { code: "CONFLICT", message: error.message } }, { status: 409 });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ success: false, error: { code: "CONFLICT", message: "This value already exists." } }, { status: 409 });
  return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." } }, { status: 500 });
}
