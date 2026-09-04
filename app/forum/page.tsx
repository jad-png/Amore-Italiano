import type { Metadata } from "next";
import WorkButton from "@/components/WorkButton";
export const metadata: Metadata = {
  title: "Forum",
  description: "Rejoindre l'équipe Amore Italiano Safi.",
};
export default function Page() {
  return (
    <section className="min-h-screen px-[4%] py-40">
      <div className="mx-auto max-w-[1180px]">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a92e27]">
          Opportunités
        </p>
        <h1 className="serif mt-4 max-w-3xl text-7xl leading-none">
          Travailler avec nous.
        </h1>
        <p className="mt-7 max-w-xl text-lg text-[#4a4741]">
          Vous souhaitez rejoindre notre équipe ? Ouvrez le formulaire de
          candidature et envoyez-nous votre CV.
        </p>
        <WorkButton />
      </div>
    </section>
  );
}
