import type { Metadata } from "next";
import { CategoriesClient } from "@/components/categories/categories-client";
export const metadata: Metadata = { title: "Danh mục | FPT Polytechnic" };
export default function CategoriesPage() { return <CategoriesClient/>; }
