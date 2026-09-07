"use client";

import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import Image from "next/image";

type Category = { id: string; name: string };
type Item = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price_small: number | null;
  price_medium: number | null;
  price_large: number | null;
  price?: number | null;
  is_available: boolean;
  image_url: string | null;
};

function formatPrice(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function formatItemPrice(item: Item) {
  const prices = [item.price_small, item.price_medium, item.price_large];
  if (prices.every((price) => price !== null && price !== undefined)) {
    return `${prices.map((price) => formatPrice(Number(price))).join(" / ")} DH`;
  }
  if (item.price_small !== null && item.price_small !== undefined && item.price_medium == null && item.price_large == null) {
    return `${formatPrice(Number(item.price_small))} DH`;
  }
  return item.price === null || item.price === undefined
    ? "Prix sur demande"
    : `${formatPrice(Number(item.price))} DH`;
}

function getLocalImagePath(value: string | null) {
  const path = value?.trim();
  if (!path) return null;
  if (path.startsWith("/images/")) return path;
  if (path.startsWith("public/images/")) return `/${path.slice("public/".length)}`;
  return `/images/${path.replace(/^\/+/, "")}`;
}

export default function PublicMenu({ categories, items }: { categories: Category[]; items: Item[] }) {
  const posthog = usePostHog();
  const [category, setCategory] = useState("all");
  const visibleItems = items.filter((item) => item.is_available && (category === "all" || item.category_id === category));

  useEffect(() => {
    posthog.capture("menu_viewed");
  }, [posthog]);

  return (
    <>
      <div className="mb-9 flex flex-wrap gap-2">
        <button onClick={() => setCategory("all")} className={`rounded-full border px-4 py-2 text-sm ${category === "all" ? "border-[#a92e27] bg-[#a92e27] !text-white" : "border-[#ded8cc]"}`}>Tutto</button>
        {categories.map((item) => (
          <button key={item.id} onClick={() => setCategory(item.id)} className={`rounded-full border px-4 py-2 text-sm ${category === item.id ? "border-[#a92e27] bg-[#a92e27] !text-white" : "border-[#ded8cc]"}`}>{item.name}</button>
        ))}
      </div>
      <div className="grid gap-x-7 md:grid-cols-2">
        {visibleItems.map((item) => (
          <article key={item.id} className="border-b border-[#ded8cc] py-5">
            {getLocalImagePath(item.image_url) && (
              <Image
                src={getLocalImagePath(item.image_url) as string}
                alt={item.name}
                width={640}
                height={420}
                sizes="(max-width: 768px) 92vw, 45vw"
                className="mb-4 h-52 w-full rounded-xl object-cover"
              />
            )}
            <div className="flex justify-between gap-5">
              <div>
                <h3 className="serif text-[21px]">{item.name}</h3>
                <p className="text-[13px] text-[#4a4741]">{item.description}</p>
              </div>
              <strong className="whitespace-nowrap text-[#a92e27]">{formatItemPrice(item)}</strong>
            </div>
          </article>
        ))}
      </div>
      {!visibleItems.length && <p className="text-[#4a4741]">Aucun plat disponible dans cette catégorie.</p>}
    </>
  );
}
