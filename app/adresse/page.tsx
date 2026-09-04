import type { Metadata } from "next";
import { Location } from "@/components/ContentSections";
export const metadata: Metadata = {
  title: "Adresse",
  description:
    "Retrouvez Amore Italiano au Label Gallery, centre-ville de Safi.",
};
export default function Page() {
  return (
    <>
      <div className="px-[4%] pb-15 pt-40">
        <div className="mx-auto max-w-[1180px]">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a92e27]">
            Nous trouver
          </p>
          <h1 className="serif mt-4 text-7xl leading-none">
            Ci vediamo
            <br />a Safi.
          </h1>
        </div>
      </div>
      <Location />
    </>
  );
}
