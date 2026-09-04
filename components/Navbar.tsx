"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const links = [
  ["Histoire", "/histoire"],
  ["Menu", "/menu"],
  ["Safi", "/safi"],
  ["Adresse", "/adresse"],
  ["Contact", "/contact"],
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 z-50 flex w-full items-center gap-3 border-b border-black/5 bg-[#f7f2e8]/90 px-[3%] py-3 backdrop-blur-xl md:gap-7 md:px-[4%]">
      <Link href="/" className="shrink-0">
        <Image
          src="/images/amore-33-png.webp"
          alt="Amore Italiano Safi"
          width={940}
          height={327}
          sizes="(max-width: 768px) 78px, 190px"
          className="h-12 w-[78px] object-contain object-left md:h-[68px] md:w-[190px]"
        />
      </Link>
      <div
        className={`${open ? "absolute left-0 top-full flex" : "hidden"} w-full flex-col gap-5 border-b border-black/5 bg-[#f7f2e8] px-6 py-5 text-sm font-semibold md:static md:ml-auto md:mr-auto md:flex md:w-auto md:flex-row md:border-0 md:bg-transparent md:p-0`}
      >
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className="hover:text-[#a92e27]"
          >
            {label}
          </Link>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Ouvrir le menu"
        className="ml-auto rounded-full border border-[#171717] px-3 py-2 text-xs md:hidden"
      >
        ☰
      </button>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("open-work-modal"))}
        className="rounded-full bg-[#a92e27] px-3 py-2 text-[9px] font-bold tracking-wider !text-white transition hover:-translate-y-0.5 md:px-4 md:text-[11px]"
      >
        TRAVAILLER AVEC NOUS
      </button>
      <a
        className="hidden rounded-full border border-[#596246] bg-[#596246] px-4 py-2 text-[11px] font-bold tracking-wider !text-white transition hover:-translate-y-0.5 sm:inline-flex"
        href="https://wa.me/212658663376?text=Bonjour%20Amore%20Italiano%20Safi%2C%20je%20souhaite%20vous%20contacter."
        target="_blank"
        rel="noopener"
      >
        CONTACTEZ-NOUS
      </a>
    </nav>
  );
}
