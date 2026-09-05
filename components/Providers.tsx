"use client";

import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

if (typeof window !== "undefined" && key && !posthog.__loaded) {
  posthog.init(key, {
    api_host: host,
    capture_pageview: false,
    capture_pageleave: true,
  });
}

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

