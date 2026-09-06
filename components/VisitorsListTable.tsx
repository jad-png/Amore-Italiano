import type { VisitorProfile } from "@/app/actions/analytics";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function VisitorsListTable({
  visitors,
}: {
  visitors: VisitorProfile[];
}) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="serif text-3xl">Visiteurs récents</h2>
      {!visitors.length ? (
        <p className="mt-5 text-sm text-[#4a4741]">Aucun visiteur récent.</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="border-b border-[#ded8cc] text-xs uppercase tracking-wider text-[#4a4741]">
              <tr>
                <th className="p-3">Visiteur</th>
                <th className="p-3">Pays</th>
                <th className="p-3">Navigateur</th>
                <th className="p-3">Appareil</th>
                <th className="p-3">Dernière activité</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="border-b border-[#eee8dc] last:border-0">
                  <td className="p-3 font-semibold">{visitor.distinctId ?? visitor.id}</td>
                  <td className="p-3">{visitor.country}</td>
                  <td className="p-3">{visitor.browser}</td>
                  <td className="p-3">{visitor.device}</td>
                  <td className="p-3 text-[#4a4741]">{formatDate(visitor.lastSeenAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

