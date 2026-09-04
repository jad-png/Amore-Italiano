import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { Story, Location } from "@/components/ContentSections";
import Gallery from "@/components/Gallery";
import MenuList from "@/components/MenuList";
export default function Home() {
  return (
    <>
      <section className="relative flex min-h-svh items-center overflow-hidden bg-[#171717] text-white">
        <Image
          src="/images/amore-22.jpg"
          alt="Cuisine italienne Amore Italiano"
          fill
          priority
          className="object-cover"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/amore-22.jpg"
          aria-hidden="true"
        >
          <source src="/magnific_a-cinematic-professional-_EbjwQm7uuO.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="relative z-10 mx-auto w-[92%] max-w-[1180px] py-32">
          <Reveal>
            <div className="mb-5 text-xs font-bold uppercase tracking-[.2em]">
              Ristorante · Caffè · Gelateria
            </div>
            <h1 className="serif max-w-[900px] text-[clamp(58px,8vw,112px)] leading-[.92] tracking-[-.04em]">
              L&apos;Italie,
              <br />
              au cœur de <em>Safi.</em>
            </h1>
            <p className="my-7 max-w-[650px] text-lg text-white/90">
              Pizza, pasta, café &amp; gelato — préparés avec passion. Une
              cuisine italienne classique, généreuse et authentique depuis 2013.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-[#a92e27] px-6 py-3 text-sm font-bold !text-white transition hover:-translate-y-0.5"
                href="/menu"
              >
                DÉCOUVRIR LE MENU
              </Link>
              <Link
                className="rounded-full border border-white/80 bg-white/10 px-6 py-3 text-sm font-bold"
                href="/adresse"
              >
                NOUS TROUVER
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <div className="mx-auto grid w-[92%] max-w-[1180px] grid-cols-1 border-y border-[#ded8cc] py-8 md:grid-cols-3">
        {[
          ["2013", "L'aventure commence"],
          ["2019", "Arrivée à Safi"],
          ["11h — 23h", "Tous les jours"],
        ].map((x) => (
          <div key={x[0]} className="text-center">
            <strong className="serif block text-4xl">{x[0]}</strong>
            <span className="text-xs uppercase tracking-widest text-[#6e6a61]">
              {x[1]}
            </span>
          </div>
        ))}
      </div>
      <section className="py-25">
        <div className="mx-auto w-[92%] max-w-[1180px]">
          <SectionHeader
            title={
              <>
                I nostri
                <br />
                incontournables.
              </>
            }
          >
            Les saveurs qui font l&apos;identité d&apos;Amore Italiano :
            simples, généreuses et préparées avec passion.
          </SectionHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "amore-22.jpg",
                "Pizza",
                "Des recettes italiennes pour toutes les envies.",
              ],
              ["amore-23.jpg", "Caffè", "Une pause café au cœur de Safi."],
              [
                "amore-24.jpg",
                "Gelato",
                "La glace italienne pour finir en beauté.",
              ],
              [
                "amore-25.jpg",
                "Drinks",
                "Jus, milk-shakes et boissons fraîches.",
              ],
            ].map((x) => (
              <Reveal
                key={x[1]}
                className="overflow-hidden rounded-xl bg-[#eee8dc]"
              >
                <img
                  src={`/images/${x[0]}`}
                  alt={x[1]}
                  className="h-[250px] w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="serif text-2xl">{x[1]}</h3>
                  <p className="mt-1 text-sm text-[#6e6a61]">{x[2]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Story />
      <section className="py-25">
        <div className="mx-auto w-[92%] max-w-[1180px]">
          <SectionHeader title="La carta.">
            L&apos;Italie dans votre assiette. Découvrez nos pizzas, cafés, jus et spécialités.
          </SectionHeader>
          <MenuList />
        </div>
      </section>
      <section className="py-25">
        <div className="mx-auto w-[92%] max-w-[1180px]">
          <SectionHeader kicker="En images" title="Nos créations.">
            Un aperçu de nos desserts, glaces et plats, directement depuis notre
            atelier.
          </SectionHeader>
          <Gallery />
        </div>
      </section>
      <section className="py-25">
        <div className="mx-auto grid w-[92%] max-w-[1180px] items-center gap-12 md:grid-cols-2">
          <Reveal>
            <img
              src="/images/amore-32.jpg"
              alt="Architecture marocaine à Safi"
              className="h-[400px] w-full rounded-xl object-cover md:h-[580px]"
            />
          </Reveal>
          <Reveal>
            <div className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#a92e27]">
              Ciao, Safi.
            </div>
            <h2 className="serif text-6xl leading-none">
              Une ville
              <br />
              authentique.
            </h2>
            <p className="serif my-6 text-2xl">
              « Une adresse italienne au cœur d&apos;une ville authentique. »
            </p>
            <p className="text-[#6e6a61]">
              Safi possède une identité particulière, entre médina, remparts,
              ateliers de potiers et océan Atlantique. C&apos;est ici
              qu&apos;Amore Italiano a choisi de s&apos;installer en 2019, au
              cœur du centre-ville.
            </p>
            <Link
              className="mt-6 inline-block rounded-full bg-[#a92e27] px-6 py-3 text-sm font-bold !text-white"
              href="/adresse"
            >
              DÉCOUVRIR L&apos;ADRESSE
            </Link>
          </Reveal>
        </div>
      </section>
      <Location />
      <section className="py-25">
        <div className="mx-auto w-[92%] max-w-[1180px]">
          <SectionHeader
            title={
              <>
                On vous
                <br />
                attend. ❤️
              </>
            }
          >
            Une question ? Une réservation ? N&apos;hésitez pas à nous
            contacter.
          </SectionHeader>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-[#a92e27] px-6 py-3 text-sm font-bold !text-white"
              href="tel:+212524628897"
            >
              APPELER MAINTENANT
            </Link>
            <a
              className="rounded-full border border-[#171717] px-6 py-3 text-sm font-bold"
              target="_blank"
              href="https://www.instagram.com/amoreitaliano.safi/"
            >
              INSTAGRAM · @amoreitaliano.safi
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
