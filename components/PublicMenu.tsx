"use client";

import { useState } from "react";

type Category = { id: string; name: string };
type Item = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
};

export default function PublicMenu({ categories, items }: { categories: Category[]; items: Item[] }) {
  const [category, setCategory] = useState("all");
  const visibleItems = items.filter((item) => item.is_available && (category === "all" || item.category_id === category));

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
          <article key={item.id} className="flex justify-between gap-5 border-b border-[#ded8cc] py-5">
            <div><h3 className="serif text-[21px]">{item.name}</h3><p className="text-[13px] text-[#4a4741]">{item.description}</p></div>
            <strong className="whitespace-nowrap text-[#a92e27]">{item.price} DH</strong>
          </article>
        ))}
      </div>
      {!visibleItems.length && <p className="text-[#4a4741]">Aucun plat disponible dans cette catégorie.</p>}
    </>
  );
}
