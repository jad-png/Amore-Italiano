import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "histoire", "menu", "safi", "adresse", "forum", "contact"].map(
    (path) => ({
      url: `https://amoreitaliano.ma/${path}`,
      lastModified: new Date(),
    }),
  );
}
