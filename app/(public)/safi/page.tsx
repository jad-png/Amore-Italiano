import type { Metadata } from "next";
import SafiStory from "@/components/public/safi/SafiStory";
import { getSafiContent } from "@/lib/safi-server";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSafiContent();
  const title = content.hero.title || "Safi — Histoire";
  const description = content.hero.description || "Découvrez l'histoire de Safi, son patrimoine, son port, sa médina et son artisanat de la poterie.";

  return {
    title,
    description,
    alternates: { canonical: "/safi" },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fr_MA",
      url: "/safi",
      images: [{ url: content.hero.image, alt: content.hero.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [content.hero.image],
    },
  };
}

export default function SafiPage() {
  return <SafiStory />;
}
