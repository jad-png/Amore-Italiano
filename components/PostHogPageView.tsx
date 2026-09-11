"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export default function PostHogPageView() {
  const posthog = usePostHog();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const query = searchParams.toString();
    const currentUrl = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;

    posthog.capture("$pageview", { $current_url: currentUrl });
  }, [pathname, posthog, searchParams]);

  return null;
}
