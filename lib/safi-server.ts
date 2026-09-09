import "server-only";

import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import { defaultSafiContent, readSafiContent } from "@/lib/safi";

const SAFI_CONTENT_TAG = "safi-page-content";

const loadSafiContent = unstable_cache(
  async () => {
    try {
      const { data, error } = await supabase.from("restaurant_settings").select("key, value");
      if (error) throw error;
      return readSafiContent((data ?? []) as { key: string; value: unknown }[]);
    } catch (error) {
      console.error("[Safi] Unable to load CMS content; using defaults.", error);
      return defaultSafiContent;
    }
  },
  [SAFI_CONTENT_TAG],
  { revalidate: 300, tags: [SAFI_CONTENT_TAG] },
);

export function getSafiContent() {
  return loadSafiContent();
}
