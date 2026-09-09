import "server-only";

import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import { readSafiContent } from "@/lib/safi";

const SAFI_CONTENT_TAG = "safi-page-content";

const loadSafiContent = unstable_cache(
  async () => {
    const { data, error } = await supabase.from("restaurant_settings").select("key, value");
    if (error) throw new Error(`Unable to load Safi content: ${error.message}`);
    return readSafiContent((data ?? []) as { key: string; value: unknown }[]);
  },
  [SAFI_CONTENT_TAG],
  { revalidate: 300, tags: [SAFI_CONTENT_TAG] },
);

export function getSafiContent() {
  return loadSafiContent();
}
