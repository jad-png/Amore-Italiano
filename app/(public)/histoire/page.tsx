import type { Metadata } from "next";
import { Story } from "@/components/ContentSections";
export const metadata: Metadata = {
  title: "Histoire",
  description: "L'histoire d'Amore Italiano depuis 2013.",
};
export default function Page() {
  return (
    <>
      <div className="px-[4%] pb-15 pt-40">
        <div className="mx-auto max-w-[1180px]">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a92e27]">
            Amore Italiano
          </p>
          <h1 className="serif mt-4 text-7xl leading-none">
            La nostra storia.
          </h1>
        </div>
      </div>
      <Story />
    </>
  );
}
