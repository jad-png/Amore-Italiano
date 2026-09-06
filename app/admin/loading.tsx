function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-[#e9e2d5] ${className}`} />;
}

export default function AdminLoading() {
  return (
    <section className="mx-auto w-[92%] max-w-[1180px] py-16">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-4 h-16 w-72" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
      <Skeleton className="mt-6 h-64" />
    </section>
  );
}

