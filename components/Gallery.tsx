"use client";
import { useState } from "react";
const images = [
  "amore-11.png",
  "amore-13.jpg",
  "amore-15.jpg",
  "amore-17.jpg",
  "amore-19.jpg",
  "amore-21.png",
  "amore-23.png",
  "amore-25.png",
  "amore-27.png",
  "amore-29.png",
  "amore-31.png",
];
export default function Gallery() {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.25fr_.75fr_.95fr] lg:grid-rows-[280px_280px]">
        {images.map((image, i) => (
          <a
            key={image}
            href={`/images/${image}`}
            target="_blank"
            rel="noreferrer"
            className={`${i > 5 && !expanded ? "hidden" : ""} group relative h-[300px] overflow-hidden rounded-[14px] bg-[#e8e1d5] lg:h-auto ${i === 0 ? "lg:row-span-2" : ""} ${i === 3 ? "lg:col-span-2" : ""}`}
          >
            <img
              src={`/images/${image}`}
              alt="Création Amore Italiano"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-[#f7f2e8]/90 px-3 py-2 text-[11px] font-bold uppercase tracking-wider">
              {i === 0 ? "Nos créations" : "Amore Italiano"}
            </span>
          </a>
        ))}
      </div>
      <div className="mt-7 text-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-full border border-[#596246] px-6 py-3 text-xs font-bold text-[#596246] hover:bg-[#596246] hover:text-white"
        >
          {expanded ? "Afficher moins" : "Afficher plus"}
        </button>
      </div>
    </>
  );
}
