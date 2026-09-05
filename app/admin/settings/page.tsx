import type { Metadata } from "next";
import { updateRestaurantSetting } from "@/app/actions/cms";
import { supabase } from "@/lib/supabase";
import { assertAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Paramètres du restaurant" };
export const dynamic = "force-dynamic";

const fields = [["opening_hours", "Horaires d'ouverture", "11h00 — 23h00"], ["phone_numbers", "Numéros de téléphone", ""], ["announcement", "Bannière d'annonce", ""]] as const;

export default async function AdminSettingsPage() {
  await assertAdmin();
  const { data: settingsData } = await supabase.from("restaurant_settings").select("key, value");
  const settings = settingsData ?? [];
  return <section className="mx-auto w-[92%] max-w-[800px] py-14"><h1 className="serif text-6xl">Paramètres.</h1><div className="mt-10 space-y-5">{fields.map(([key, label, fallback]) => { const setting = settings.find((item) => item.key === key); const value = typeof setting?.value === "object" && setting.value && "value" in setting.value ? String(setting.value.value ?? fallback) : fallback; return <form key={key} action={updateRestaurantSetting.bind(null, key)} className="rounded-xl bg-white p-6"><label className="mb-3 block font-bold">{label}</label><textarea name="value" defaultValue={value} rows={key === "announcement" ? 4 : 2} className="w-full rounded-lg border border-[#ded8cc] p-3"/><button className="mt-4 rounded-full bg-[#a92e27] px-5 py-3 text-sm font-bold !text-white">ENREGISTRER</button></form>; })}</div></section>;
}
