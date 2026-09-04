import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Amore Italiano Safi.",
};
export default function Page() {
  return (
    <section className="min-h-screen py-40">
      <div className="mx-auto w-[92%] max-w-[1180px]">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a92e27]">
          Contact
        </p>
        <h1 className="serif mt-4 text-7xl leading-none">
          On vous
          <br />
          attend. ❤️
        </h1>
        <p className="my-7 max-w-xl text-lg text-[#6e6a61]">
          Une question ? Une réservation ? N&apos;hésitez pas à nous contacter.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="tel:+212524628897"
              className="rounded-full bg-[#a92e27] px-6 py-3 text-sm font-bold !text-white"
          >
            APPELER MAINTENANT
          </Link>
          <a
            target="_blank"
            href="https://www.instagram.com/amoreitaliano.safi/"
            className="rounded-full border border-[#171717] px-6 py-3 text-sm font-bold"
          >
            INSTAGRAM · @amoreitaliano.safi
          </a>
        </div>
      </div>
    </section>
  );
}
