export default function SectionHeader({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-11 flex items-end justify-between gap-7 max-md:block">
      <div>
        {kicker && (
          <div className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#a92e27]">
            {kicker}
          </div>
        )}
        <h2 className="serif text-[clamp(42px,6vw,70px)] leading-none">
          {title}
        </h2>
      </div>
      {children && (
        <p className="max-w-[420px] text-[#6e6a61] max-md:mt-5">{children}</p>
      )}
    </div>
  );
}
