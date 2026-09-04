"use client";
import { useState } from "react";
const dishes = [
  [
    "pizza",
    "Margherita",
    "Sauce tomate · mozzarella · basilic",
    "45 / 68 / 115 DH",
  ],
  [
    "pizza",
    "Nutella",
    "Nutella · banane · crème fraîche · fromage",
    "40 / 65 / 115 DH",
  ],
  [
    "pizza",
    "5 Formaggi",
    "Crème de fromage · mozzarella · gorgonzola · brie",
    "49 / 70 / 140 DH",
  ],
  [
    "pizza",
    "Tonno e Cipolla",
    "Thon · mozzarella · oignons",
    "48 / 75 / 140 DH",
  ],
  [
    "pizza",
    "Vegetariana",
    "Aubergine · courgette · poivrons · champignons",
    "48 / 79 / 140 DH",
  ],
  [
    "pizza",
    "Salami",
    "Sauce tomate · mozzarella · pepperoni",
    "45 / 70 / 140 DH",
  ],
  [
    "pizza",
    "Poulet",
    "Poulet · champignons · tomates cerises · mozzarella",
    "50 / 80 / 140 DH",
  ],
  [
    "pizza",
    "Viande Hachée",
    "Viande hachée de bœuf · mozzarella",
    "50 / 79 / 140 DH",
  ],
  [
    "pizza",
    "Napoletana",
    "Anchois · câpres · mozzarella · sauce tomate",
    "45 / 78 / 135 DH",
  ],
  [
    "pizza",
    "Regina",
    "Dinde fumée · champignons · artichaut · mozzarella",
    "52 / 85 / 145 DH",
  ],
  [
    "pizza",
    "Diavola",
    "Hot dog · jalapeños · salami · mozzarella",
    "49 / 79 / 145 DH",
  ],
  [
    "pizza",
    "Mamma Mia",
    "Parmesan · pesto · courgette · crevettes · mozzarella",
    "52 / 85 / 145 DH",
  ],
  [
    "pizza",
    "Bella Ciao",
    "Parmesan · pomme de terre · jambon · oignon · mozzarella",
    "47 / 78 / 140 DH",
  ],
  [
    "pizza",
    "Frutti di Mare",
    "Fruits de mer · mozzarella · sauce tomate",
    "56 / 85 / 155 DH",
  ],
  ["pizza", "Salmone", "Saumon fumé · tomate · mozzarella", "56 / 85 / 155 DH"],
  ["cafe", "Espresso Prestige", "Café italien", "15 DH"],
  ["cafe", "Double Espresso", "Café italien", "18 DH"],
  ["cafe", "Café Crème", "Café · lait", "18 DH"],
  ["cafe", "Cappuccino", "Espresso · lait mousseux", "18 DH"],
  ["cafe", "Chocolat chaud", "Chocolat", "16 DH"],
  ["cafe", "Affogato", "Gelato · espresso", "38 DH"],
  ["jus", "Citron", "Jus frais", "22 DH"],
  ["jus", "Orange", "Jus frais", "25 DH"],
  ["jus", "Banane", "Jus frais", "26 DH"],
  ["jus", "Fraise", "Jus frais", "30 DH"],
  ["jus", "Mangue", "Jus frais", "32 DH"],
  ["jus", "Panaché lait", "Mix de fruits · lait", "36 DH"],
  ["drink", "Milk Shake", "Boisson gourmande", "34 DH"],
  ["drink", "Orange Shake", "Orange · glace", "34 DH"],
  ["drink", "Virgin Mojito", "Menthe · citron · soda", "36 DH"],
  ["drink", "Soda", "Boisson fraîche", "15 DH"] as const,
];
const tabs = [
  ["all", "Tutto"],
  ["pizza", "Pizza"],
  ["cafe", "Caffè"],
  ["jus", "Jus"],
  ["drink", "Drinks"],
];
export default function MenuList() {
  const [cat, setCat] = useState("all");
  return (
    <>
      <div className="mb-9 flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCat(key)}
    className={`rounded-full border px-4 py-2 text-sm transition ${cat === key ? "border-[#a92e27] bg-[#a92e27] !text-white" : "border-[#ded8cc] hover:border-[#a92e27] hover:bg-[#a92e27] hover:text-white"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-x-7 md:grid-cols-2">
        {dishes
          .filter((d) => cat === "all" || d[0] === cat)
          .map((d) => (
            <article
              key={d[1]}
              className="flex justify-between gap-5 border-b border-[#ded8cc] py-5"
            >
              <div>
                <h3 className="serif text-[21px]">{d[1]}</h3>
                <p className="text-[13px] text-[#4a4741]">{d[2]}</p>
              </div>
              <strong className="whitespace-nowrap text-[#a92e27]">
                {d[3]}
              </strong>
            </article>
          ))}
      </div>
    </>
  );
}
