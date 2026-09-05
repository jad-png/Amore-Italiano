"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function number(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

export async function createMenuCategory(formData: FormData): Promise<void> {
  await assertAdmin();
  const name = text(formData, "name");
  if (!name) throw new Error("Le nom de la catégorie est obligatoire.");

  const { error } = await supabase.from("menu_categories").insert({
    name,
    display_order: number(formData, "display_order"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function updateMenuCategory(id: string, formData: FormData): Promise<void> {
  await assertAdmin();
  const name = text(formData, "name");
  if (!name) throw new Error("Le nom de la catégorie est obligatoire.");

  const { error } = await supabase
    .from("menu_categories")
    .update({ name, display_order: number(formData, "display_order") })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function deleteMenuCategory(id: string, _formData?: FormData): Promise<void> {
  await assertAdmin();
  const { error } = await supabase.from("menu_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function createMenuItem(formData: FormData): Promise<void> {
  await assertAdmin();
  const name = text(formData, "name");
  const categoryId = text(formData, "category_id");
  if (!name || !categoryId) throw new Error("Le nom et la catégorie sont obligatoires.");

  const { error } = await supabase.from("menu_items").insert({
    category_id: categoryId,
    name,
    description: text(formData, "description"),
    price: number(formData, "price"),
    is_available: formData.get("is_available") === "on",
    image_url: text(formData, "image_url") || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function updateMenuItem(id: string, formData: FormData): Promise<void> {
  await assertAdmin();
  const name = text(formData, "name");
  const categoryId = text(formData, "category_id");
  if (!name || !categoryId) throw new Error("Le nom et la catégorie sont obligatoires.");

  const update = {
    category_id: categoryId,
    name,
    description: text(formData, "description"),
    price: number(formData, "price"),
    image_url: text(formData, "image_url") || null,
  } as { category_id: string; name: string; description: string; price: number; image_url: string | null; is_available?: boolean };
  if (formData.has("is_available")) update.is_available = formData.get("is_available") === "on";
  const { error } = await supabase.from("menu_items").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function deleteMenuItem(id: string, _formData?: FormData): Promise<void> {
  await assertAdmin();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function toggleMenuItemAvailability(id: string, isAvailable: boolean, _formData?: FormData): Promise<void> {
  await assertAdmin();
  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function reorderMenuItems(formData: FormData): Promise<void> {
  await assertAdmin();
  const ids = formData.getAll("item_id").map(String);
  for (const id of ids) {
    const displayOrder = Number(formData.get(`order_${id}`));
    if (!Number.isFinite(displayOrder)) continue;
    const { error } = await supabase.from("menu_items").update({ display_order: displayOrder }).eq("id", id);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function updateRestaurantSetting(key: string, formData: FormData): Promise<void> {
  await assertAdmin();
  const value = text(formData, "value");
  if (!key) throw new Error("La clé du paramètre est obligatoire.");

  const { error } = await supabase.from("restaurant_settings").upsert({
    key,
    value: { value },
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/adresse");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}
