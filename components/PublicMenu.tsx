"use client";

import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";

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

export default function PublicMenu({ categories, items }: { categories: Category[]; items: Item[] }) {
  const posthog = usePostHog();
  const [category, setCategory] = useState("all");
  const visibleItems = items.filter((item) => item.is_available && (category === "all" || item.category_id === category));

  useEffect(() => {
    posthog.capture("menu_viewed");
  }, [posthog]);

  return (
    <>
      <div className="mb-[35px] flex flex-wrap gap-2.5">
        <button
          onClick={() => setCategory("all")}
          className={`cursor-pointer rounded-full border bg-transparent px-[18px] py-2.5 text-sm transition-colors ${category === "all" ? "border-[#a92e27] bg-[#a92e27] text-white" : "border-[#ded8cc] hover:border-[#a92e27] hover:bg-[#a92e27] hover:text-white"}`}
        >
          Tutto
        </button>
        {categories.map((item) => (
          <button
            key={item.id}
            onClick={() => setCategory(item.id)}
            className={`cursor-pointer rounded-full border bg-transparent px-[18px] py-2.5 text-sm transition-colors ${category === item.id ? "border-[#a92e27] bg-[#a92e27] text-white" : "border-[#ded8cc] hover:border-[#a92e27] hover:bg-[#a92e27] hover:text-white"}`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
        {visibleItems.map((item) => (
          <article key={item.id} className="flex justify-between gap-5 border-b border-[#ded8cc] py-5">
            <div>
              <h3 className="serif text-[21px]">{item.name}</h3>
              <p className="text-[13px] text-[#6e6a61]">{item.description}</p>
            </div>
            <strong className="price whitespace-nowrap font-bold text-[#a92e27]">{formatItemPrice(item)}</strong>
          </article>
        ))}
      </div>
      {!visibleItems.length && <p className="text-[#4a4741]">Aucun plat disponible dans cette catégorie.</p>}
    </>
  );
}
