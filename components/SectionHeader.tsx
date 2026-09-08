export default function SectionHeader({
  kicker,
  title,
  children,
  inverse = false,
}: {
  kicker?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  inverse?: boolean;
}) {
  return (
    <div className="mb-11 flex items-end justify-between gap-7 max-md:block">
      <div>
        {kicker && (
          <div className={`mb-4 text-xs font-bold uppercase tracking-[.2em] ${inverse ? "text-[#f7f2e8]" : "text-[#a92e27]"}`}>
            {kicker}
          </div>
        )}
        <h2 className={`serif text-[clamp(42px,6vw,70px)] leading-none ${inverse ? "text-[#f7f2e8]" : ""}`}>
          {title}
        </h2>
      </div>
      {children && (
        <p className={`max-w-[420px] max-md:mt-5 ${inverse ? "text-[#f7f2e8]/80" : "text-[#4a4741]"}`}>{children}</p>
      )}
    </div>
  );
}
