import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
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
    <section className="bg-[#e9e2d5] py-25">
      <div className="mx-auto w-[92%] max-w-[1180px]">
        <SectionHeader
          title={
            <>
              Ci vediamo
              <br />a Safi.
            </>
          }
        >
          Venez nous rendre visite au Label Gallery, au cœur du centre-ville.
        </SectionHeader>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              "📍 Adresse",
              <>
                {" "}
                <b>Label Gallery</b>
                <br />
                Centre-ville, Safi
                <br />
                Maroc
                <br />
                <br />
                <a
                  className="inline-block rounded-full bg-[#a92e27] px-5 py-3 text-xs font-bold !text-white"
                  target="_blank"
                  href="https://www.google.com/maps/search/?api=1&query=Amore+Italiano+Safi"
                >
                  OUVRIR GOOGLE MAPS
                </a>
              </>,
            ],
            [
              "🕐 Horaires",
              <>
                <b>Tous les jours</b>
                <br />
                11h00 — 23h00
                <br />
                <i>En été : jusqu&apos;à minuit.</i>
              </>,
            ],
            [
              "📞 Téléphone",
              <>
                00212 524 62 88 97
                <br />
                00212 658 66 33 76
                <br />
                00212 762 81 85 08
              </>,
            ],
          ].map(([h, c]) => (
            <Reveal key={h as string} className="rounded-xl bg-[#f7f2e8] p-8">
              <h3 className="serif mb-3 text-3xl">{h}</h3>
              <p className="text-[#4a4741]">{c}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
