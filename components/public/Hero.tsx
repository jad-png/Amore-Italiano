import Link from "next/link";
import Reveal from "@/components/Reveal";

const heroVideoUrl =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL;

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#171717] text-white"
    >
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={heroVideoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(0,0,0,.68)_0%,rgba(0,0,0,.40)_48%,rgba(0,0,0,.20)_100%),linear-gradient(0deg,rgba(0,0,0,.42),transparent_48%)]" />
      <div className="relative z-[2] mx-auto min-w-0 w-[92%] max-w-[1180px] py-32">
        <Reveal>
          <div className="mb-5 text-xs font-bold uppercase tracking-[.2em] drop-shadow-[0_2px_12px_rgba(0,0,0,.35)]">
            Ristorante · Caffè · Gelateria
          </div>
          <h1 className="serif max-w-[900px] break-words text-[clamp(58px,8vw,112px)] leading-[.92] tracking-[-.04em] drop-shadow-[0_3px_24px_rgba(0,0,0,.38)]">
            L&apos;Italie,
            <br />
            au cœur de <em>Safi.</em>
          </h1>
          <p className="my-7 max-w-[650px] text-lg text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,.35)]">
            Pizza, pasta, café &amp; gelato — préparés avec passion. Une cuisine
            italienne classique, généreuse et authentique depuis 2013.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-[#a92e27] px-6 py-3 text-sm font-bold !text-white transition hover:-translate-y-0.5"
              href="#menu"
            >
              DÉCOUVRIR LE MENU
            </Link>
            <Link
              className="rounded-full border border-white/80 bg-white/10 px-6 py-3 text-sm font-bold !text-white backdrop-blur-sm transition hover:-translate-y-0.5"
              href="#adresse"
            >
              NOUS TROUVER
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
