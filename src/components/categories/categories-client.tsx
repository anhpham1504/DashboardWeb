"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {AppHeader} from "@/components/layout/app-header";
import {MarketingFooter} from "@/components/marketing/marketing-footer";
import {apiRequest} from "@/lib/client-api";
import {getCategoryDisplayName,getCategoryDisplayDescription} from "@/lib/localization";
import type {CategoryDto} from "@/types/models";
export function CategoriesClient(){
 const [items,setItems]=useState<CategoryDto[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 useEffect(()=>{apiRequest<CategoryDto[]>("/api/categories?pageSize=100").then(setItems).catch(()=>setError("Không thể tải danh mục.")).finally(()=>setLoading(false));},[]);
 return <div className="min-h-screen flex flex-col bg-background"><AppHeader/><main className="w-full max-w-6xl mx-auto px-5 py-12 flex-1"><h1 className="text-4xl font-display font-extrabold">Danh mục</h1><p className="my-4 text-muted-foreground">Khám phá các website theo nhu cầu của bạn.</p>{loading?<p role="status">Đang tải danh mục...</p>:error?<p role="alert">{error}</p>:!items.length?<p>Chưa có danh mục.</p>:<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(c=><Link className="p-6 rounded-xl border bg-card" key={c.id} href={"/systems?category="+c.id}><h2 className="font-semibold text-lg">{getCategoryDisplayName(c.name)}</h2><p className="text-sm my-3">{getCategoryDisplayDescription(c.description||"")}</p><span className="text-sm text-primary-strong">{c.websiteCount} website →</span></Link>)}</div>}</main><MarketingFooter/></div>;
}
