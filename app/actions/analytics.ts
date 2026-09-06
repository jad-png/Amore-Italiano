"use server";

import { assertAdmin } from "@/lib/auth";

const WINDOW = "30 DAY";

type ApiPayload<T> = {
  results?: T[];
  next?: string | null;
};

export type AnalyticsResult<T> = {
  data: T;
  warning?: string;
};

export type OverviewMetrics = {
  visitors: number;
  pageviews: number;
  averageSessionDuration: number;
  bounceRate: number;
};

export type VisitorProfile = {
  id: string;
  distinctId?: string;
  country: string;
  browser: string;
  device: string;
  lastSeenAt: string | null;
};

export type SessionRecording = {
  id: string;
  duration: number;
  startTime: string | null;
  location: string;
  device: string;
  replayUrl: string;
};

export type TopPage = {
  path: string;
  views: number;
};

export type AnalyticsStats = OverviewMetrics & {
  formStarted: number;
  formSubmitted: number;
  conversionRate: number;
  unavailable?: boolean;
};

function getConfig() {
  return {
    apiKey: process.env.POSTHOG_PERSONAL_API_KEY,
    projectId:
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID ||
      process.env.PUBLIC_POSTHOG_PROJECT_ID ||
      process.env.POSTHOG_PROJECT_ID,
    host: (
      process.env.NEXT_PUBLIC_POSTHOG_HOST ||
      process.env.PUBLIC_POSTHOG_HOST ||
      process.env.POSTHOG_API_HOST ||
      ""
    ).replace(/\/$/, ""),
  };
}

function unavailable<T>(data: T): AnalyticsResult<T> {
  return {
    data,
    warning:
      "PostHog analytics are not configured. Add POSTHOG_PERSONAL_API_KEY and NEXT_PUBLIC_POSTHOG_PROJECT_ID.",
  };
}

async function posthogFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { apiKey, projectId, host } = getConfig();
  if (!apiKey || !projectId || !host) {
    const error = new Error(
      "PostHog configuration is missing. Set the API key, project ID, and host.",
    );
    console.error("[PostHog] Missing API key or project ID:", error.message);
    throw error;
  }

  const response = await fetch(`${host}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    console.error(
      `[PostHog] Request failed with ${response.status} ${response.statusText}: ${message}`,
    );
    throw new Error(`PostHog request failed with ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

async function runHogQL<T>(query: string): Promise<T[]> {
  const { projectId } = getConfig();
  const payload = await posthogFetch<ApiPayload<T>>(`/api/projects/${projectId}/query/`, {
    method: "POST",
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
  });
  return payload.results ?? [];
}

export async function getOverviewMetrics(): Promise<AnalyticsResult<OverviewMetrics>> {
  await assertAdmin();
  const empty: OverviewMetrics = {
    visitors: 0,
    pageviews: 0,
    averageSessionDuration: 0,
    bounceRate: 0,
  };

  try {
    const [result] = await runHogQL<{
      visitors: number;
      pageviews: number;
      average_session_duration: number;
      bounce_rate: number;
    }>(`
      WITH session_stats AS (
        SELECT
          properties.$session_id AS session_id,
          countIf(event = '$pageview') AS pageviews,
          dateDiff('second', min(timestamp), max(timestamp)) AS duration
        FROM events
        WHERE timestamp >= now() - INTERVAL ${WINDOW}
          AND properties.$session_id IS NOT NULL
        GROUP BY session_id
      )
      SELECT
        count(DISTINCT if(event = '$pageview', person_id, NULL)) AS visitors,
        countIf(event = '$pageview') AS pageviews,
        (SELECT avg(duration) FROM session_stats WHERE pageviews > 0) AS average_session_duration,
        (SELECT avg(if(pageviews = 1, 1, 0)) * 100 FROM session_stats WHERE pageviews > 0) AS bounce_rate
      FROM events
      WHERE timestamp >= now() - INTERVAL ${WINDOW}
    `);

    if (!result) return unavailable(empty);

    return {
      data: {
        visitors: Number(result.visitors) || 0,
        pageviews: Number(result.pageviews) || 0,
        averageSessionDuration: Number(result.average_session_duration) || 0,
        bounceRate: Number(result.bounce_rate) || 0,
      },
    };
  } catch (error) {
    console.error("[PostHog] Overview metrics request failed:", error);
    return unavailable(empty);
  }
}

type PersonApiRecord = {
  id: string;
  distinct_ids?: string[];
  properties?: Record<string, unknown>;
  last_seen_at?: string | null;
};

function property(properties: Record<string, unknown> | undefined, keys: string[]) {
  for (const key of keys) {
    const value = properties?.[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "—";
}

export async function getRecentVisitors(): Promise<AnalyticsResult<VisitorProfile[]>> {
  await assertAdmin();
  try {
    const { projectId } = getConfig();
    const payload = await posthogFetch<ApiPayload<PersonApiRecord>>(
      `/api/projects/${projectId}/persons/?limit=10&ordering=-last_seen_at`,
    );

    return {
      data: (payload.results ?? []).map((person) => ({
        id: person.id,
        distinctId: person.distinct_ids?.[0],
        country: property(person.properties, ["$geoip_country_name", "$geoip_country_code"]),
        browser: property(person.properties, ["$browser"]),
        device: property(person.properties, ["$device_type", "$os"]),
        lastSeenAt: person.last_seen_at ?? null,
      })),
    };
  } catch (error) {
    console.error("[PostHog] Recent visitors request failed:", error);
    return unavailable([]);
  }
}

type RecordingApiRecord = {
  id: string;
  recording_duration?: number;
  duration?: number;
  start_time?: string | null;
  distinct_id?: string;
  person?: { properties?: Record<string, unknown> };
  properties?: Record<string, unknown>;
};

export async function getSessionRecordings(): Promise<AnalyticsResult<SessionRecording[]>> {
  await assertAdmin();
  try {
    const { projectId } = getConfig();
    const payload = await posthogFetch<ApiPayload<RecordingApiRecord>>(
      `/api/projects/${projectId}/session_recordings/?limit=10`,
    );

    const recordings = (payload.results ?? []).map((recording) => {
      const properties = recording.person?.properties ?? recording.properties;
      return {
        id: recording.id,
        duration: Number(recording.duration ?? recording.recording_duration) || 0,
        startTime: recording.start_time ?? null,
        location: property(properties, ["$geoip_city_name", "$geoip_country_name"]),
        device: property(properties, ["$device_type", "$browser", "$os"]),
        replayUrl: `${getConfig().host}/project/${projectId}/replay/${recording.id}`,
      };
    });

    recordings.sort((a, b) =>
      (b.startTime ?? "").localeCompare(a.startTime ?? ""),
    );

    return {
      data: recordings,
    };
  } catch (error) {
    console.error("[PostHog] Session recordings request failed:", error);
    return unavailable([]);
  }
}

export async function getTopPages(): Promise<AnalyticsResult<TopPage[]>> {
  await assertAdmin();
  try {
    const rows = await runHogQL<{ path: string; views: number }>(`
      SELECT
        coalesce(properties.$pathname, properties.$current_url, '/') AS path,
        count() AS views
      FROM events
      WHERE event = '$pageview'
        AND timestamp >= now() - INTERVAL ${WINDOW}
      GROUP BY path
      ORDER BY views DESC
      LIMIT 10
    `);

    return {
      data: rows.map((row) => ({
        path: row.path || "/",
        views: Number(row.views) || 0,
      })),
    };
  } catch (error) {
    console.error("[PostHog] Top pages request failed:", error);
    return unavailable([]);
  }
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const [overview, conversion] = await Promise.all([
    getOverviewMetrics(),
    runConversionQuery(),
  ]);

  return {
    ...overview.data,
    ...conversion.data,
    unavailable: Boolean(overview.warning || conversion.warning),
  };
}

async function runConversionQuery(): Promise<AnalyticsResult<Pick<AnalyticsStats, "formStarted" | "formSubmitted" | "conversionRate">>> {
  await assertAdmin();
  const empty = { formStarted: 0, formSubmitted: 0, conversionRate: 0 };

  try {
    const [result] = await runHogQL<{
      form_started: number;
      form_submitted: number;
    }>(`
      SELECT
        countIf(event = 'work_form_started') AS form_started,
        countIf(event = 'work_form_submitted') AS form_submitted
      FROM events
      WHERE timestamp >= now() - INTERVAL ${WINDOW}
    `);
    if (!result) return unavailable(empty);

    const formStarted = Number(result.form_started) || 0;
    const formSubmitted = Number(result.form_submitted) || 0;
    return {
      data: {
        formStarted,
        formSubmitted,
        conversionRate: formStarted
          ? Math.round((formSubmitted / formStarted) * 100)
          : 0,
      },
    };
  } catch (error) {
    console.error("[PostHog] Conversion metrics request failed:", error);
    return unavailable(empty);
  }
}
