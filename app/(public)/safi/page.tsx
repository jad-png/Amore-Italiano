import type { Metadata } from "next";
import SafiStory from "@/components/public/safi/SafiStory";

export const metadata: Metadata = {
  title: "Safi — Histoire",
  description:
    "Découvrez l'histoire de Safi, son patrimoine, son port, sa médina et son artisanat de la poterie.",
};

export default function SafiPage() {
  return <SafiStory />;
}
