import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkModal from "@/components/WorkModal";

const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans", weight: ["400", "500", "600", "700"] });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--font-playfair", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://amoreitaliano-safi.com"),
  title: {
    default: "Amore Italiano — Safi",
    template: "%s — Amore Italiano Safi",
  },
  description: "Pizza, café, gelato et cuisine italienne depuis 2013 à Safi.",
  openGraph: {
    title: "Amore Italiano — Safi",
    description: "Pizza, café, gelato et cuisine italienne depuis 2013 à Safi.",
    type: "website",
    images: ["/images/amore-21-png.webp"],
  },
  alternates: { canonical: "/" },
  icons: { icon: "/images/amore-33-png.webp" },
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
      <body className={`${dmSans.variable} ${playfairDisplay.variable}`} suppressHydrationWarning>
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
