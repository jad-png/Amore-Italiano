import type { Metadata } from "next";
import {
  createMenuCategory,
  createMenuItem,
  deleteMenuCategory,
  deleteMenuItem,
  reorderMenuItems,
  toggleMenuItemAvailability,
  updateMenuCategory,
  updateMenuItem,
} from "@/app/actions/cms";
import { assertAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import MenuImageField from "@/components/MenuImageField";

export const metadata: Metadata = { title: "Gestion du menu" };
export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  await assertAdmin();

  const [{ data: categoriesData }, { data: itemsData }] = await Promise.all([
    supabase
      .from("menu_categories")
      .select("id, name, display_order")
      .order("display_order"),
    supabase
      .from("menu_items")
      .select(
        "id, category_id, name, description, price, is_available, image_url, display_order",
      )
      .order("display_order")
      .order("created_at"),
  ]);

  const categories = categoriesData ?? [];
  const items = itemsData ?? [];

  return (
    <section className="mx-auto w-[92%] max-w-[1180px] py-14">
      <h1 className="serif text-6xl">Menu.</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <h2 className="serif mb-4 text-3xl">Catégories</h2>
          <form action={createMenuCategory} className="mb-6 grid gap-3 rounded-xl bg-white p-5">
            <input name="name" required placeholder="Nouvelle catégorie" className="rounded-lg border border-[#ded8cc] p-3" />
            <input name="display_order" type="number" defaultValue="0" placeholder="Ordre" className="rounded-lg border border-[#ded8cc] p-3" />
            <button className="rounded-full bg-[#a92e27] px-5 py-3 font-bold !text-white">AJOUTER</button>
          </form>
          {categories.map((category) => (
            <div key={category.id} className="mb-3 rounded-xl bg-white p-4">
              <form action={updateMenuCategory.bind(null, category.id)} className="flex gap-2">
                <input name="name" required defaultValue={category.name} className="min-w-0 flex-1 rounded-lg border border-[#ded8cc] p-2" />
                <input name="display_order" type="number" defaultValue={category.display_order} className="w-20 rounded-lg border border-[#ded8cc] p-2" />
                <button className="text-sm font-bold text-[#a92e27]">ENREGISTRER</button>
              </form>
              <form action={deleteMenuCategory.bind(null, category.id)} className="mt-2">
                <button className="text-xs text-[#4a4741]">Supprimer la catégorie et ses plats</button>
              </form>
            </div>
          ))}
        </div>

        <div>
          <h2 className="serif mb-4 text-3xl">Ajouter un plat</h2>
          <form action={createMenuItem} className="grid gap-3 rounded-xl bg-white p-5 md:grid-cols-2">
            <select name="category_id" required defaultValue="" className="rounded-lg border border-[#ded8cc] p-3">
              <option value="">Catégorie</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <input name="name" required placeholder="Nom du plat" className="rounded-lg border border-[#ded8cc] p-3" />
            <input name="price" required type="number" step="0.01" placeholder="Prix" className="rounded-lg border border-[#ded8cc] p-3" />
            <MenuImageField />
            <textarea name="description" placeholder="Description" className="rounded-lg border border-[#ded8cc] p-3 md:col-span-2" />
            <label className="flex items-center gap-2 text-sm md:col-span-2"><input name="is_available" type="checkbox" defaultChecked /> Disponible</label>
            <button className="rounded-full bg-[#a92e27] px-5 py-3 font-bold !text-white md:col-span-2">AJOUTER LE PLAT</button>
          </form>

          <h2 className="serif mb-4 mt-10 text-3xl">Plats</h2>
          <form action={reorderMenuItems} className="mb-5 rounded-xl bg-white p-5">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <input type="hidden" name="item_id" value={item.id} />
                  <span className="min-w-0 flex-1 truncate text-sm">{item.name}</span>
                  <label className="flex items-center gap-2 text-xs text-[#4a4741]">Ordre<input name={`order_${item.id}`} type="number" defaultValue={item.display_order ?? 0} className="w-20 rounded-lg border border-[#ded8cc] p-2" /></label>
                </div>
              ))}
            </div>
            <button className="mt-5 rounded-full border border-[#596246] px-5 py-3 text-sm font-bold text-[#596246]">ENREGISTRER L&apos;ORDRE</button>
          </form>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl bg-white p-5">
                <form action={updateMenuItem.bind(null, item.id)} className="grid gap-3 md:grid-cols-2">
                  <select name="category_id" required defaultValue={item.category_id} className="rounded-lg border border-[#ded8cc] p-2">
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                  <input name="name" required defaultValue={item.name} className="rounded-lg border border-[#ded8cc] p-2" />
                  <input name="price" required type="number" step="0.01" defaultValue={item.price} className="rounded-lg border border-[#ded8cc] p-2" />
                  <MenuImageField defaultValue={item.image_url ?? ""} />
                  <textarea name="description" defaultValue={item.description} className="rounded-lg border border-[#ded8cc] p-2 md:col-span-2" />
                  <label className="flex items-center gap-2 text-sm md:col-span-2"><input name="is_available" type="checkbox" defaultChecked={item.is_available} /> Disponible</label>
                  <button className="rounded-full bg-[#a92e27] px-5 py-2 text-sm font-bold !text-white md:w-fit">MODIFIER</button>
                </form>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <span className={`text-xs font-bold ${item.is_available ? "text-[#596246]" : "text-[#a92e27]"}`}>{item.is_available ? "Disponible" : "Indisponible"}</span>
                  <form action={toggleMenuItemAvailability.bind(null, item.id, !item.is_available)}><button className="text-sm font-bold">{item.is_available ? "DÉSACTIVER" : "ACTIVER"}</button></form>
                  <form action={deleteMenuItem.bind(null, item.id)}><button className="text-sm text-[#4a4741]">SUPPRIMER</button></form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
