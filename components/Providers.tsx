"use client";

import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import { useUser } from "@clerk/nextjs";
import { Suspense, useEffect } from "react";
import PostHogPageView from "@/components/PostHogPageView";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isLoaded, user } = useUser();

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    console.log("PostHog Init Key:", key ? "EXISTS" : "MISSING");

    if (!key || posthog.__loaded) return;

    posthog.init(key, {
      api_host: host,
      capture_pageview: false,
      capture_pageleave: true,
    });
  }, []);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

    if (!isLoaded || !key) return;

    const configuredAdminUserId = process.env.NEXT_PUBLIC_ADMIN_USER_ID;
    const configuredAdminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
    const userEmail = user?.primaryEmailAddress?.emailAddress.toLowerCase();
    const isAdmin =
      user?.publicMetadata?.role === "admin" ||
      user?.id === configuredAdminUserId ||
      Boolean(userEmail && configuredAdminEmails.includes(userEmail));

    if (isAdmin) {
      posthog.opt_out_capturing();
    } else if (posthog.has_opted_out_capturing()) {
      posthog.opt_in_capturing();
    }
  }, [isLoaded, user]);

  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PostHogProvider>
  );
}
