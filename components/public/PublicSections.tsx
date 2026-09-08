import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import SafiGallerySection from "@/components/public/SafiGallerySection";
import { supabase } from "@/lib/supabase";

export function Stats() {
  return (
    <div className="mx-auto grid w-[92%] max-w-[1180px] grid-cols-1 border-y border-[#ded8cc] py-8 md:grid-cols-3">
      {[
        ["2013", "L'aventure commence"],
        ["2019", "Arrivée à Safi"],
        ["11h — 23h", "Tous les jours"],
      ].map(([value, label]) => (
        <div key={value} className="text-center">
          <strong className="serif block text-4xl">{value}</strong>
          <span className="text-xs uppercase tracking-widest text-[#4a4741]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Highlights() {
  const cards = [
    ["amore-22-jpg.webp", "Pizza", "Des recettes italiennes pour toutes les envies."],
    ["amore-23-jpg.webp", "Caffè", "Une pause café au cœur de Safi."],
    ["amore-24-jpg.webp", "Gelato", "La glace italienne pour finir en beauté."],
    ["amore-25-jpg.webp", "Drinks", "Jus, milk-shakes et boissons fraîches."],
  ] as const;

  return (
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
          Les saveurs qui font l&apos;identité d&apos;Amore Italiano : simples,
          généreuses et préparées avec passion.
        </SectionHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([image, title, description]) => (
            <Reveal key={title} className="overflow-hidden rounded-xl bg-[#eee8dc]">
              <Image
                src={`/images/${image}`}
                alt={title}
                width={1367}
                height={2048}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="h-[250px] w-full object-cover"
              />
              <div className="p-5">
                <h3 className="serif text-2xl">{title}</h3>
                <p className="mt-1 text-sm text-[#4a4741]">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function SafiSection() {
  const { data } = await supabase
    .from("restaurant_settings")
    .select("key, value")
    .in("key", ["safi_title", "safi_description", "safi_button_text", "safi_button_link", "safi_images"]);
  const settings = data ?? [];

  function value(key: string, fallback = "") {
    const setting = settings.find((item) => item.key === key);
    if (!setting?.value || typeof setting.value !== "object" || !("value" in setting.value)) return fallback;
    return typeof setting.value.value === "string" ? setting.value.value : fallback;
  }

  const imageSetting = settings.find((item) => item.key === "safi_images");
  const images = imageSetting?.value && typeof imageSetting.value === "object" && "value" in imageSetting.value && Array.isArray(imageSetting.value.value)
    ? imageSetting.value.value.filter((image: unknown): image is string => typeof image === "string")
    : [];

  return (
    <SafiGallerySection
      title={value("safi_title", "Une ville authentique.")}
      description={value("safi_description", "Safi possède une identité particulière, entre médina, remparts, ateliers de potiers et océan Atlantique.")}
      buttonText={value("safi_button_text", "DÉCOUVRIR L'HISTOIRE DE SAFI")}
      buttonLink={value("safi_button_link", "/safi")}
      images={images}
    />
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="py-25">
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
          Une question ? Une réservation ? N&apos;hésitez pas à nous contacter.
        </SectionHeader>
        <div className="flex flex-wrap gap-3">
          <a
            className="rounded-full bg-[#a92e27] px-6 py-3 text-sm font-bold !text-white"
            href="tel:+212524628897"
          >
            APPELER MAINTENANT
          </a>
          <a
            className="rounded-full border border-[#171717] px-6 py-3 text-sm font-bold"
            target="_blank"
            rel="noreferrer"
            href="https://www.instagram.com/amoreitaliano.safi/"
          >
            INSTAGRAM · @amoreitaliano.safi
          </a>
        </div>
      </div>
    </section>
  );
}
