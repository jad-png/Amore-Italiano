import type { SessionRecording } from "@/app/actions/analytics";

function formatDuration(seconds: number) {
  if (!seconds) return "—";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function formatDate(value: string | null) {
  if (!value) return "Date inconnue";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export default function SessionRecordingsCard({
  recordings,
}: {
  recordings: SessionRecording[];
}) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="serif text-3xl">Enregistrements récents</h2>
      {!recordings.length ? (
        <p className="mt-5 text-sm text-[#4a4741]">Aucun enregistrement récent.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {recordings.map((recording) => (
            <div
              key={recording.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-[#f7f2e8] p-4"
            >
              <div>
                <p className="font-semibold">{recording.location}</p>
                <p className="text-sm text-[#4a4741]">
                  {recording.device} · {formatDate(recording.startTime)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#596246] px-3 py-1 text-xs font-bold !text-white">
                  {formatDuration(recording.duration)}
                </span>
                <a
                  href={recording.replayUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#a92e27]"
                >
                  OUVRIR DANS POSTHOG ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

