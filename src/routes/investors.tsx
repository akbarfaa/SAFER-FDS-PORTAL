/**
 * Investor & Growth Relations Portal Route — Thin Orchestrator
 * Composes investor components from @/features/investors.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Compass, ArrowRight } from "lucide-react";
import { Logo } from "@/components/safer/Logo";
import { ThemeToggle } from "@/components/safer/ThemeToggle";
import { LanguageToggle } from "@/components/safer/LanguageToggle";
import { useTranslation } from "@/lib/i18n";
import {
  InvestorHero,
  InvestorStats,
  InvestorProblemSolution,
  InvestorProductPillars,
  InvestorProjections,
  InvestorGovernance,
  InvestorConsultModal,
} from "@/features/investors";

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "Investor & Growth Relations Portal · SAFER FDS" },
      {
        name: "description",
        content: "Halaman Hubungan Investor SAFER — Proyeksi finansial, model bisnis B2B SaaS, unit economics, dan peluang pendanaan pre-seed FDS pembayaran digital Indonesia.",
      },
      {
        name: "keywords",
        content: "investor safer, fds startup investment, pitch deck safer, pre seed funding indonesia, fraud detection system roi",
      },
    ],
  }),
  component: InvestorPage,
});

function InvestorPage() {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      
      {/* ─── STANDALONE INVESTOR TOP BAR (NO SIDEBAR LAYOUT) ─── */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 md:px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden sm:inline-block h-4 w-px bg-border" />
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
            <Sparkles className="h-3 w-3" /> {isEn ? "Investor & Growth Relations" : "Investor & Growth Relations"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* ─── 1 CTA BESAR: JELAJAHI PORTAL UTAMA SAFER ─── */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 px-4 py-2 text-xs md:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-[1.02] transition-all"
          >
            <Compass className="h-4 w-4" />
            <span>{isEn ? "Explore SAFER Main Portal" : "Jelajahi Portal Utama SAFER"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2 border-l border-border pl-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ─── MAIN INVESTOR PITCH CONTENT (FULL WIDTH) ─── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
        <InvestorHero onOpenConsultModal={() => setIsConsultModalOpen(true)} />
        <InvestorStats />
        <InvestorProblemSolution />
        <InvestorProductPillars />
        <InvestorProjections />
        <InvestorGovernance onOpenConsultModal={() => setIsConsultModalOpen(true)} />
      </main>

      {/* ─── STANDALONE FOOTER ─── */}
      <footer className="border-t border-border bg-card/40 py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} SAFER — Prototype for demonstration purposes.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-foreground">{isEn ? "Main Portal" : "Portal Utama"}</Link>
            <Link to="/dashboard" className="hover:text-foreground">Dashboard Demo</Link>
            <a href="https://api.safer.web.id/docs" target="_blank" rel="noreferrer" className="hover:text-foreground">API Docs</a>
          </div>
        </div>
      </footer>

      {/* ─── Investor Consultation Modal ─── */}
      <InvestorConsultModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
      />
    </div>
  );
}
