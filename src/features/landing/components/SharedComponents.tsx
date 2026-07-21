/**
 * Landing Page — Shared Utility Components
 */
export function SectionHead({ eyebrow, title, subtitle, className = "" }: { eyebrow: string; title: string; subtitle: string; className?: string }) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${className}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</div>
      <h2 className="text-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">{subtitle}</p>
    </div>
  );
}
