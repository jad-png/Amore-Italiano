import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import SafiLocationMap from "@/components/public/safi/SafiLocationMapLoader";
export function Story() {
  return (
    <section className="bg-[#596246] py-25 text-white">
      <div className="mx-auto grid w-[92%] max-w-[1180px] gap-12 md:grid-cols-2 md:items-center md:gap-17">
        <Reveal>
          <div className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#e8c7a5]">
            La nostra storia
          </div>
          <h2 className="serif text-[clamp(45px,6vw,75px)] leading-none">
            Une histoire faite
            <br />
            con tanto amore.
          </h2>
          <p className="my-6 max-w-[560px] text-[#eee]">
            En 2013, trois entrepreneurs italo-marocains unissent leur
            savoir-faire autour d&apos;une même ambition : faire découvrir une
            cuisine italienne classique au Maroc.
          </p>
          <p className="text-[#eee]">
            <b>La qualité avant tout.</b>
            <br />
            Des produits choisis avec attention, une cuisine inspirée de la
            tradition italienne et une volonté de préserver l&apos;esprit qui a donné
            naissance à Amore Italiano.
          </p>
        </Reveal>
        <Reveal className="border-l border-white/40 pl-7">
          {[
            ["2013 · Fès", "Les débuts"],
            ["2015 · Meknès", "Première expansion"],
            ["2016 · Marrakech", "Nouvelle destination"],
            ["2017 · Tanger", "Direction le Nord"],
            ["2018 · Rabat", "La capitale"],
            ["2019 · Safi", "Label Gallery"],
          ].map((x) => (
            <div key={x[0]} className="border-b border-white/15 py-4">
              <b className="serif text-2xl">{x[0]}</b>
              <br />
              {x[1]}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
export function Location() {
  return (
    <section id="adresse" className="bg-[#e9e2d5] py-25">
      <div className="mx-auto w-[92%] max-w-[1180px]">
        <SectionHeader
          title={
            <>
              Nous trouver
              <br />à Safi.
            </>
          }
        >
          Venez nous rendre visite au Label Gallery, au cœur du centre-ville.
        </SectionHeader>
        <div className="relative overflow-hidden rounded-3xl border border-[#ded8cc] bg-[#f7f2e8] p-2 shadow-[0_24px_70px_rgba(65,52,37,.14)]">
          <div className="relative min-h-[520px] overflow-hidden rounded-[1.25rem]">
            <SafiLocationMap />
            <div className="absolute bottom-4 left-4 z-[500] w-[calc(100%-2rem)] max-w-[350px] rounded-2xl border border-white/60 bg-[#f7f2e8]/90 p-6 shadow-[0_18px_40px_rgba(23,23,23,.16)] backdrop-blur-md md:bottom-6 md:left-6">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#a92e27]">Amore Italiano</p>
              <h3 className="serif mt-2 text-3xl leading-tight text-[#171717]">Amore Italiano Safi</h3>
              <address className="mt-3 not-italic text-sm leading-6 text-[#6e6a61]">
                Label Gallery · Centre-ville
                <br />
                Safi, Maroc
              </address>
              <p className="mt-3 text-sm font-medium text-[#4a4741]">Tous les jours: 11h00 — 23h00</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href="https://maps.google.com/?q=Amore+Italiano+Safi"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-[#a92e27] px-4 py-2.5 text-xs font-bold uppercase tracking-[.08em] text-white transition hover:bg-[#86221e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a92e27] focus-visible:ring-offset-2"
                >
                  Obtenir l&apos;itinéraire
                </a>
                <a
                  href="tel:+212524628897"
                  className="inline-flex items-center rounded-full border border-[#a92e27]/40 px-4 py-2.5 text-xs font-bold uppercase tracking-[.08em] text-[#a92e27] transition hover:bg-[#a92e27] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a92e27] focus-visible:ring-offset-2"
                >
                  Appeler
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
