import Link from "next/link";
import { assertAdmin } from "@/lib/auth";

export default async function AdminDashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await assertAdmin();
  return <div className="min-h-screen bg-[#f7f2e8] pt-28"><nav className="mx-auto flex w-[92%] max-w-[1180px] gap-5 border-b border-[#ded8cc] pb-5 text-sm font-semibold"><Link href="/admin/dashboard">Dashboard</Link><Link href="/admin/menu">Menu</Link><Link href="/admin/settings">Paramètres</Link></nav>{children}</div>;
}
