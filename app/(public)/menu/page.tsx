import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import PublicMenu from "@/components/PublicMenu";
import { supabase } from "@/lib/supabase";
export const metadata: Metadata = {
  title: "Menu",
  description:
    "Découvrez les pizzas, cafés, jus et spécialités d'Amore Italiano.",
};
export const dynamic = "force-dynamic";

export default async function Page() {
  const [{ data: categoriesData }, { data: itemsData }] = await Promise.all([
    supabase.from("menu_categories").select("id, name").order("display_order"),
    supabase.from("menu_items").select("id, category_id, name, description, price, is_available").order("created_at"),
  ]);
  const categories = categoriesData ?? [];
  const items = itemsData ?? [];

  return (
    <section className="min-h-screen py-40">
      <div className="mx-auto w-[92%] max-w-[1180px]">
        <SectionHeader title="La carta.">
          L&apos;Italie dans votre assiette. Découvrez nos pizzas, cafés, jus et
          spécialités.
        </SectionHeader>
        <PublicMenu categories={categories} items={items} />
      </div>
    </section>
  );
}
