"use server";

import { randomUUID } from "node:crypto";
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

function menuPrice(formData: FormData, key: string) {
  const value = number(formData, key, -1);
  if (value < 0) throw new Error("Le prix du plat est obligatoire.");
  return value;
}

function optionalMenuPrice(formData: FormData, key: string) {
  const raw = text(formData, key);
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Le prix doit être un nombre positif.");
  }
  return value;
}

function validatePriceSet(priceMedium: number | null, priceLarge: number | null) {
  if ((priceMedium === null) !== (priceLarge === null)) {
    throw new Error("Renseignez les prix M et L ensemble, ou laissez-les vides pour un prix unique.");
  }
}

const MAX_MENU_IMAGE_SIZE = 8 * 1024 * 1024;

function hasValidImageSignature(buffer: Buffer, type: string) {
  const isJpeg = type === "image/jpeg" && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = type === "image/png" && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = type === "image/webp" && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  const isAvif = type === "image/avif" && buffer.subarray(4, 12).toString("ascii").includes("ftyp");
  return isJpeg || isPng || isWebp || isAvif;
}

async function ensureMenuImagesBucket() {
  const { data: bucket } = await supabase.storage.getBucket("menu-images");
  if (bucket) return null;

  const { error } = await supabase.storage.createBucket("menu-images", {
    public: true,
  });
  if (error && !error.message.toLowerCase().includes("already exists")) return error;
  return null;
}

export async function uploadMenuImage(formData: FormData) {
  await assertAdmin();
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Sélectionnez une image." };
  }
  if (file.size > MAX_MENU_IMAGE_SIZE) {
    return { error: "L'image doit faire 8 Mo maximum." };
  }

  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
  if (!allowedTypes.has(file.type)) {
    return { error: "Formats acceptés : JPG, PNG, WebP ou AVIF." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!hasValidImageSignature(buffer, file.type)) {
    return { error: "Le fichier image est invalide." };
  }

  const bucketError = await ensureMenuImagesBucket();
  if (bucketError) {
    console.error("[CMS] Unable to initialize menu-images bucket:", bucketError);
    return { error: "Le stockage des images est indisponible." };
  }

  const extension = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `menu/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("menu-images")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[CMS] Menu image upload failed:", uploadError);
    return { error: "Impossible d'enregistrer l'image." };
  }

  const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}

export async function createMenuCategory(formData: FormData): Promise<void> {
  await assertAdmin();
  const name = text(formData, "name");
  if (!name) throw new Error("Le nom de la catégorie est obligatoire.");

  const { data: lastCategory, error: lastCategoryError } = await supabase
    .from("menu_categories")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (lastCategoryError) throw new Error(lastCategoryError.message);

  const { error } = await supabase.from("menu_categories").insert({
    name,
    display_order: (lastCategory?.display_order ?? -1) + 1,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function updateMenuCategory(id: string, formData: FormData): Promise<void> {
  await assertAdmin();
  const name = text(formData, "name");
  if (!name) throw new Error("Le nom de la catégorie est obligatoire.");

  const update: { name: string; display_order?: number } = { name };
  if (formData.has("display_order")) {
    update.display_order = number(formData, "display_order");
  }

  const { error } = await supabase.from("menu_categories").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function deleteMenuCategory(id: string, _formData?: FormData): Promise<void> {
  await assertAdmin();
  const { error: itemsError } = await supabase
    .from("menu_items")
    .delete()
    .eq("category_id", id);
  if (itemsError) throw new Error(itemsError.message);

  const { error } = await supabase.from("menu_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function reorderMenuCategories(categoryIds: string[]): Promise<void> {
  await assertAdmin();

  const ids = Array.from(new Set(categoryIds.map(String).filter(Boolean)));
  const { data: existingCategories, error: existingError } = await supabase
    .from("menu_categories")
    .select("id");
  if (existingError) throw new Error(existingError.message);

  const existingIds = new Set((existingCategories ?? []).map((category) => category.id));
  if (ids.length !== existingIds.size || ids.some((id) => !existingIds.has(id))) {
    throw new Error("La liste des catégories a changé. Actualisez la page puis réessayez.");
  }

  const updates = await Promise.all(
    ids.map((id, display_order) =>
      supabase.from("menu_categories").update({ display_order }).eq("id", id),
    ),
  );
  const failedUpdate = updates.find((result) => result.error);
  if (failedUpdate?.error) throw new Error(failedUpdate.error.message);

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function createMenuItem(formData: FormData): Promise<void> {
  await assertAdmin();
  const name = text(formData, "name");
  const categoryId = text(formData, "category_id");
  if (!name || !categoryId) throw new Error("Le nom et la catégorie sont obligatoires.");

  const priceSmall = menuPrice(formData, "price_small");
  const priceMedium = optionalMenuPrice(formData, "price_medium");
  const priceLarge = optionalMenuPrice(formData, "price_large");
  validatePriceSet(priceMedium, priceLarge);

  const { error } = await supabase.from("menu_items").insert({
    category_id: categoryId,
    name,
    description: text(formData, "description"),
    price: priceMedium ?? priceSmall,
    price_small: priceSmall,
    price_medium: priceMedium,
    price_large: priceLarge,
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

  const priceSmall = menuPrice(formData, "price_small");
  const priceMedium = optionalMenuPrice(formData, "price_medium");
  const priceLarge = optionalMenuPrice(formData, "price_large");
  validatePriceSet(priceMedium, priceLarge);

  const update = {
    category_id: categoryId,
    name,
    description: text(formData, "description"),
    price: priceMedium ?? priceSmall,
    price_small: priceSmall,
    price_medium: priceMedium,
    price_large: priceLarge,
    image_url: text(formData, "image_url") || null,
  } as {
    category_id: string;
    name: string;
    description: string;
    price: number;
    price_small: number;
    price_medium: number | null;
    price_large: number | null;
    image_url: string | null;
    is_available?: boolean;
  };
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
