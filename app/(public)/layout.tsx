import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkModal from "@/components/WorkModal";
import Providers from "@/components/Providers";

export default function PublicLayout({
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
    <Providers>
      <Navbar />
      <main className="page-shell">{children}</main>
      <Footer />
      <WorkModal />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
    </Providers>
  );
}
