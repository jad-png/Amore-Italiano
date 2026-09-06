import type { TopPage } from "@/app/actions/analytics";

export default function TopPagesTable({ pages }: { pages: TopPage[] }) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="serif text-3xl">Pages populaires</h2>
      {!pages.length ? (
        <p className="mt-5 text-sm text-[#4a4741]">Aucune page vue récemment.</p>
      ) : (
        <ol className="mt-5 space-y-3">
          {pages.map((page, index) => (
            <li key={`${page.path}-${index}`} className="flex items-center gap-4 border-b border-[#eee8dc] pb-3 last:border-0">
              <span className="w-6 text-sm font-bold text-[#a92e27]">{index + 1}</span>
              <span className="min-w-0 flex-1 truncate font-semibold">{page.path}</span>
              <span className="text-sm text-[#4a4741]">{page.views.toLocaleString("fr-FR")}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

