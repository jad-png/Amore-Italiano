import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import MenuList from "@/components/MenuList";
export const metadata: Metadata = {
  title: "Menu",
  description:
    "Découvrez les pizzas, cafés, jus et spécialités d'Amore Italiano.",
};
export default function Page() {
  return (
    <section className="min-h-screen py-40">
      <div className="mx-auto w-[92%] max-w-[1180px]">
        <SectionHeader title="La carta.">
          L&apos;Italie dans votre assiette. Découvrez nos pizzas, cafés, jus et
          spécialités.
        </SectionHeader>
        <MenuList />
      </div>
    </section>
  );
}
