import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function AdminDashboardPage() {
  const [{ count: applications }, { count: menuItems }] = await Promise.all([
    supabase.from("applications").select("id", { count: "exact", head: true }),
    supabase.from("menu_items").select("id", { count: "exact", head: true }),
  ]);
  return <section className="mx-auto w-[92%] max-w-[1180px] py-16"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#a92e27]">Administration</p><h1 className="serif mt-3 text-6xl">Dashboard.</h1><div className="mt-10 grid gap-5 md:grid-cols-2"><Link href="/admin/applications" className="rounded-xl bg-white p-7 shadow-sm"><strong className="serif block text-4xl">{applications ?? 0}</strong><span>Candidatures reçues</span></Link><Link href="/admin/menu" className="rounded-xl bg-white p-7 shadow-sm"><strong className="serif block text-4xl">{menuItems ?? 0}</strong><span>Éléments du menu</span></Link></div></section>;
}
