"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const photos = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Port_of_Safi_city%2C_Morocco.jpg",
    alt: "Le port de Safi et l'Atlantique",
    caption: "Le port de Safi & l'Atlantique",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Safi_medina%28js%29.jpg",
    alt: "Les remparts et la médina de Safi",
    caption: "Les remparts et la médina",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Museo_Nacional_de_Cer%C3%A1mica%2C_Safi.jpg",
    alt: "Le Kechla, musée national de la céramique",
    caption: "Le Kechla — Musée national de la céramique",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Poterie_de_Safi_Maroc_Morocco_Marueccos.JPG",
    alt: "La poterie traditionnelle de Safi",
    caption: "La poterie de Safi",
  },
] as const;

export default function SafiGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedPhoto = selectedIndex === null ? null : photos[selectedIndex];

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") {
        setSelectedIndex((current) => (current === null ? 0 : (current + 1) % photos.length));
      }
      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) => (current === null ? 0 : (current - 1 + photos.length) % photos.length));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  return (
    <section className="bg-[#f7f2e8] py-24">
      <div className="mx-auto w-[92%] max-w-[1180px]">
        <div className="mb-14 max-w-[780px]">
          <div className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-[#a92e27]">
            Regards sur Safi
          </div>
          <h2 className="serif text-[clamp(42px,6vw,72px)] leading-[.98]">
            Une ville à
            <br />
            <em className="text-[#a92e27]">regarder.</em>
          </h2>
          <p className="mt-5 max-w-[650px] leading-7 text-[#6e6a61]">
            Quelques images pour découvrir le patrimoine, le port, la médina et
            l&apos;art de la céramique qui font l&apos;identité de Safi.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.25fr_.75fr_.75fr] lg:grid-rows-[260px_260px]">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`group relative min-h-[260px] overflow-hidden rounded-sm bg-[#e8e1d4] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a92e27] focus-visible:ring-offset-4 ${index === 0 ? "lg:row-span-2" : ""}`}
              aria-label={`Agrandir : ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 40vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                priority={index === 0}
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-5 pb-4 pt-12 text-sm font-semibold text-white">
                {photo.caption}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-7 text-[11px] leading-5 text-[#6e6a61]">
          Photos : Wikimedia Commons, utilisées selon les licences indiquées sur
          leurs pages de fichier (notamment CC BY / CC BY-SA). Les crédits et
          licences doivent être conservés si ces images sont publiées sur un site
          en production.
        </p>
      </div>

      {selectedPhoto && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedIndex(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedPhoto.alt}
            className="relative h-[min(82vh,760px)] w-full max-w-5xl"
          >
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
            <p className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 text-center text-sm text-white">
              {selectedPhoto.caption}
            </p>
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute right-0 top-0 rounded-full bg-white/90 px-4 py-2 text-2xl leading-none text-[#171717] transition hover:bg-white"
              aria-label="Fermer la galerie"
            >
              ×
            </button>
            <button
              type="button"
              onClick={() => setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length)}
              className="absolute left-2 top-1/2 rounded-full bg-white/90 px-4 py-2 text-2xl text-[#171717] transition hover:bg-white sm:-left-14"
              aria-label="Image précédente"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setSelectedIndex((selectedIndex + 1) % photos.length)}
              className="absolute right-2 top-1/2 rounded-full bg-white/90 px-4 py-2 text-2xl text-[#171717] transition hover:bg-white sm:-right-14"
              aria-label="Image suivante"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
