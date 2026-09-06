"use server";

import { assertAdmin } from "@/lib/auth";

export type AnalyticsStats = {
  visitors: number;
  pageViews: number;
  formStarted: number;
  formSubmitted: number;
  conversionRate: number;
  unavailable?: boolean;
};

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  await assertAdmin();

  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const apiHost = (
    process.env.POSTHOG_API_HOST ||
    process.env.PUBLIC_POSTHOG_HOST ||
    "https://us.posthog.com"
  ).replace(/\/$/, "");

  const empty: AnalyticsStats = {
    visitors: 0,
    pageViews: 0,
    formStarted: 0,
    formSubmitted: 0,
    conversionRate: 0,
    unavailable: true,
  };

  if (!apiKey || !projectId) return empty;

  try {
    const response = await fetch(`${apiHost}/api/projects/${projectId}/query/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          kind: "HogQLQuery",
          query: `
            SELECT
              count(DISTINCT if(event = '$pageview', person_id, NULL)) AS visitors,
              countIf(event = '$pageview') AS page_views,
              countIf(event = 'work_form_started') AS form_started,
              countIf(event = 'work_form_submitted') AS form_submitted
            FROM events
            WHERE timestamp >= now() - INTERVAL 30 DAY
          `,
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) return empty;

    const payload = (await response.json()) as {
      results?: Array<[number, number, number, number]>;
    };
    const [visitors = 0, pageViews = 0, formStarted = 0, formSubmitted = 0] =
      payload.results?.[0] ?? [];

    return {
      visitors: Number(visitors) || 0,
      pageViews: Number(pageViews) || 0,
      formStarted: Number(formStarted) || 0,
      formSubmitted: Number(formSubmitted) || 0,
      conversionRate: formStarted
        ? Math.round((formSubmitted / formStarted) * 100)
        : 0,
    };
  } catch {
    return empty;
  }
}

