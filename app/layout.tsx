import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkModal from "@/components/WorkModal";

export const metadata: Metadata = {
  title: {
    default: "Amore Italiano — Safi",
    template: "%s — Amore Italiano Safi",
  },
  description: "Pizza, café, gelato et cuisine italienne depuis 2013 à Safi.",
  openGraph: {
    title: "Amore Italiano — Safi",
    description: "Pizza, café, gelato et cuisine italienne depuis 2013 à Safi.",
    type: "website",
    images: ["/images/amore-21.png"],
  },
  alternates: { canonical: "/" },
  icons: { icon: "/images/amore-33.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Amore Italiano Safi",
    description: "Pizza, café, gelato et cuisine italienne depuis 2013.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Label Gallery",
      addressLocality: "Safi",
      addressCountry: "MA",
    },
    telephone: ["+212524628897", "+212658663376", "+212762818508"],
    openingHours: "Mo-Su 11:00-23:00",
  };
  return (
    <html lang="fr">
      <body suppressHydrationWarning>
        <Navbar />
        <main className="page-shell">{children}</main>
        <Footer />
        <WorkModal />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
      </body>
    </html>
  );
}
