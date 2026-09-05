import type { Metadata } from "next";
import Link from "next/link";
import { getAnalyticsStats } from "@/app/actions/analytics";
import { assertAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await assertAdmin();

  const [{ count: applications }, { count: menuItems }, analytics] =
    await Promise.all([
      supabase.from("applications").select("id", { count: "exact", head: true }),
      supabase.from("menu_items").select("id", { count: "exact", head: true }),
      getAnalyticsStats(),
    ]);

  const cards = [
    ["Visiteurs", analytics.visitors],
    ["Pages vues", analytics.pageViews],
    ["Formulaires commencés", analytics.formStarted],
    ["Candidatures envoyées", analytics.formSubmitted],
  ] as const;

  return (
    <section className="mx-auto w-[92%] max-w-[1180px] py-16">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a92e27]">
        Administration
      </p>
      <h1 className="serif mt-3 text-6xl">Dashboard.</h1>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Link href="/admin/applications" className="rounded-xl bg-white p-7 shadow-sm">
          <strong className="serif block text-4xl">{applications ?? 0}</strong>
          <span>Candidatures reçues</span>
        </Link>
        <Link href="/admin/menu" className="rounded-xl bg-white p-7 shadow-sm">
          <strong className="serif block text-4xl">{menuItems ?? 0}</strong>
          <span>Éléments du menu</span>
        </Link>
      </div>

      <section className="mt-10 rounded-xl bg-white p-7 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a92e27]">
              PostHog
            </p>
            <h2 className="serif mt-2 text-3xl">Conversion · 30 derniers jours</h2>
          </div>
          {analytics.unavailable && (
            <p className="text-xs text-[#4a4741]">Analytics non configurées.</p>
          )}
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-lg bg-[#f7f2e8] p-5">
              <strong className="serif block text-4xl">{value.toLocaleString("fr-FR")}</strong>
              <span className="text-sm text-[#4a4741]">{label}</span>
            </div>
          ))}
        </div>

        <p className="mt-5 text-sm text-[#4a4741]">
          Taux de conversion formulaire : <strong>{analytics.conversionRate}%</strong>
        </p>
      </section>
    </section>
  );
}
