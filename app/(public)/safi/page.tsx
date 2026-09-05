import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
export const metadata: Metadata = {
  title: "Safi",
  description: "Amore Italiano au cœur de Safi.",
};
export default function Page() {
  return (
    <section className="py-40">
      <div className="mx-auto grid w-[92%] max-w-[1180px] items-center gap-12 md:grid-cols-2">
        <Image
          src="/images/amore-32-jpg.webp"
          alt="Architecture marocaine"
          width={960}
          height={640}
          sizes="(max-width: 768px) 92vw, 50vw"
          className="h-[580px] w-full rounded-xl object-cover"
        />
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a92e27]">
            Ciao, Safi.
          </p>
          <h1 className="serif mt-4 text-7xl leading-none">
            Une ville
            <br />
            authentique.
          </h1>
          <p className="serif my-7 text-2xl">
            « Une adresse italienne au cœur d&apos;une ville authentique. »
          </p>
          <p className="text-[#4a4741]">
            Safi possède une identité particulière, entre médina, remparts,
            ateliers de potiers et océan Atlantique. C&apos;est ici
            qu&apos;Amore Italiano a choisi de s&apos;installer en 2019, au cœur
            du centre-ville.
          </p>
          <Link
            href="/adresse"
            className="mt-6 inline-block rounded-full bg-[#a92e27] px-6 py-3 text-sm font-bold !text-white"
          >
            DÉCOUVRIR L&apos;ADRESSE
          </Link>
        </div>
      </div>
    </section>
  );
}
