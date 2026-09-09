import type { Metadata } from "next";
import SafiPageManager from "@/components/admin/SafiPageManager";
import { assertAdmin } from "@/lib/auth";
import { readSafiContent } from "@/lib/safi";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = { title: "Gestion de la page Safi" };
export const dynamic = "force-dynamic";

export default async function AdminSafiPage() {
  await assertAdmin();
  const { data } = await supabase.from("restaurant_settings").select("key, value");

  return (
    <main className="mx-auto w-[92%] max-w-[1180px] py-14">
      <SafiPageManager initialContent={readSafiContent((data ?? []) as { key: string; value: unknown }[])} />
    </main>
  );
}
