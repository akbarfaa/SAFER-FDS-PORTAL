import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2L3 6v6c0 5 3.8 9.5 9 10 5.2-.5 9-5 9-10V6l-9-4z" />
        </svg>
      </div>
      <div className="leading-none">
        <div className="text-[15px] font-semibold tracking-tight">SAFER</div>
        <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Fraud Intelligence</div>
      </div>
    </Link>
  );
}
