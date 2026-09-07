import Image from "next/image";
import Link from "next/link";
import SafiGallery from "@/components/public/safi/SafiGallery";

const timeline = [
  ["XIe — XIIe siècles", "Asfi, port de l'Atlantique", "La ville se développe comme un port d'échanges. Sous les Almohades, Safi est reliée à Marrakech et entretient des échanges maritimes avec l'Andalousie."],
  ["1509 — 1541", "L'époque portugaise", "Les Portugais prennent Safi au début du XVIe siècle et renforcent ses défenses. L'occupation prend fin en 1541 avec la reprise de la ville par les Saadiens."],
  ["Après 1541", "Un grand port marocain", "Safi retrouve une place importante dans les échanges du Royaume. Sa proximité avec Marrakech favorise son rôle commercial et ses relations avec l'Europe."],
  ["XXe siècle", "Port, pêche et industrie", "Le port s'étend notamment avec le développement des exportations de phosphates. La pêche et la conserverie sardinière connaissent également un essor majeur au cours du siècle."],
] as const;

function StorySection({
  eyebrow,
  title,
  children,
  facts,
  light = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
  facts: readonly [string, string][];
  light?: boolean;
}) {
  return (
    <section className={light ? "bg-white py-24" : "py-24"}>
      <div className="mx-auto grid w-[92%] max-w-[1180px] items-start gap-12 md:grid-cols-[.9fr_1.1fr] md:gap-16">
        <div>
          <div className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-[#a92e27]">
            {eyebrow}
          </div>
          <h2 className="serif text-[clamp(42px,5vw,64px)] leading-none">{title}</h2>
        </div>
        <div>
          <div className="text-base leading-8 text-[#6e6a61]">{children}</div>
          <div className="mt-6">
            {facts.map(([label, description]) => (
              <div key={label} className="flex gap-6 border-t border-[#ded8cc] py-5">
                <strong className="serif min-w-20 text-2xl">{label}</strong>
                <span className="text-sm leading-6 text-[#6e6a61]">{description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SafiStory() {
  return (
    <>
      <header className="overflow-hidden bg-[#f7f2e8] pb-20 pt-36 md:pb-24 md:pt-44">
        <div className="mx-auto grid w-[92%] max-w-[1180px] items-center gap-12 md:grid-cols-[1.05fr_.95fr] md:gap-16">
          <div>
            <div className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-[#a92e27]">
              Ciao, Safi · Maroc
            </div>
            <h1 className="serif mb-6 text-[clamp(56px,8vw,100px)] leading-[.92]">
              L&apos;histoire
              <br />
              de <em className="text-[#a92e27]">Safi.</em>
            </h1>
            <p className="max-w-[650px] text-lg leading-8 text-[#6e6a61]">
              Une ville tournée vers l&apos;Atlantique, façonnée par son port, sa
              médina, ses remparts et son savoir-faire ancestral de la poterie.
            </p>
            <Link
              href="/"
              className="mt-7 inline-flex rounded-full border border-[#171717] px-5 py-3 text-xs font-bold transition hover:bg-[#171717] hover:!text-white"
            >
              ← RETOUR À L&apos;ACCUEIL
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#e8e1d4] shadow-[0_20px_50px_rgba(0,0,0,.12)]">
            <Image
              src="/images/amore-32-jpg.webp"
              alt="Architecture et patrimoine de Safi"
              fill
              priority
              sizes="(max-width: 768px) 92vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </header>

      <main>
        <section className="py-24">
          <div className="mx-auto w-[92%] max-w-[1180px]">
            <div className="mb-14 max-w-[780px]">
              <div className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-[#a92e27]">
                Un passé entre terre et mer
              </div>
              <h2 className="serif text-[clamp(42px,6vw,72px)] leading-[.98]">
                Une ville ancienne,
                <br />
                un caractère unique.
              </h2>
              <p className="mt-5 leading-8 text-[#6e6a61]">
                Safi est une cité portuaire dont l&apos;histoire est intimement liée
                à l&apos;Atlantique. Le nom d&apos;Asfi apparaît dans les textes arabes à
                partir du XIe siècle. À l&apos;époque almohade, la ville devient un
                port important de Marrakech et entretient des relations avec
                l&apos;Andalousie.
              </p>
            </div>
            <div className="grid gap-[18px] md:grid-cols-2">
              {timeline.map(([year, title, description], index) => (
                <article
                  key={year}
                  className={`min-h-[230px] border border-[#ded8cc] bg-white p-8 ${index === 1 ? "bg-[#596246] text-white" : ""}`}
                >
                  <div className={`text-xs font-bold uppercase tracking-[.16em] ${index === 1 ? "text-white" : "text-[#a92e27]"}`}>
                    {year}
                  </div>
                  <h3 className="serif mt-3 text-3xl">{title}</h3>
                  <p className={`mt-3 leading-7 ${index === 1 ? "text-white/80" : "text-[#6e6a61]"}`}>
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <StorySection
          eyebrow="Patrimoine"
          title={<>Le Kechla,<br />mémoire de la ville.</>}
          facts={[
            ["Kechla", "Un vestige majeur de la période portugaise, dominant l'Atlantique."],
            ["Médina", "Un patrimoine vivant fait de ruelles, souks, artisans et traditions."],
            ["Océan", "Le littoral reste au cœur de l'identité de Safi, notamment à travers le surf."],
          ]}
          light
        >
          Le Kechla et les fortifications portugaises comptent parmi les témoins
          les plus marquants du passé de Safi. La médina conserve également une
          architecture et une ambiance profondément marocaines.
        </StorySection>

        <StorySection
          eyebrow="Savoir-faire"
          title={<>Safi,<br />ville de potiers.</>}
          facts={[
            ["Artisanat", "Une tradition de poterie et de céramique profondément liée à l'identité de la ville."],
            ["Culture", "Un patrimoine qui réunit médina, architecture, métiers d'art et vie maritime."],
          ]}
        >
          La poterie est l&apos;un des symboles culturels de Safi. La ville est
          reconnue comme l&apos;une des capitales marocaines de la céramique, avec
          notamment la Colline des Potiers et ses ateliers. Les pièces en terre
          cuite et les céramiques bleues font partie de son identité artisanale.
        </StorySection>

        <SafiGallery />
      </main>
    </>
  );
}
