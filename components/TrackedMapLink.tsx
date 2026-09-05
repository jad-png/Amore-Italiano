"use client";

import { usePostHog } from "posthog-js/react";

export default function TrackedMapLink({
  href,
  children,
}: Readonly<{ href: string; children: React.ReactNode }>) {
  const posthog = usePostHog();

  return (
    <a
      className="inline-block rounded-full bg-[#a92e27] px-5 py-3 text-xs font-bold !text-white"
      target="_blank"
      rel="noreferrer"
      href={href}
      onClick={() => posthog.capture("location_clicked")}
    >
      {children}
    </a>
  );
}

