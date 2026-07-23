import { Link } from "@tanstack/react-router";
import { ShieldCheck, MessageSquare, ArrowUpRight, Globe, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface InvestorHeroProps {
  onOpenConsultModal: () => void;
}

export function InvestorHero({ onOpenConsultModal }: InvestorHeroProps) {
  const { language } = useTranslation();
  const isEn = language === "en";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-card via-card/90 to-primary/15 p-6 md:p-10 shadow-2xl">
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
      <div className="relative z-10 space-y-5">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />{" "}
            {isEn ? "Executive Pitching Brief · PIDI x DIGDAYA 2026 Hackathon" : "Standalone Pitching Executive Summary · Hackathon PIDI x DIGDAYA 2026"}
          </div>

          <Link
            to="/dashboard"
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
          >
            {isEn ? "Try Real-Time Analyst Console" : "Langsung Coba Real-Time Dashboard"} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <h1 className="text-2xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
          {isEn ? "Securing Indonesia's Digital Economy with " : "Membangun Ketahanan Ekonomi Digital Indonesia Melalui "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400">AI Fraud Intelligence</span>
        </h1>

        <p className="max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed">
          {isEn
            ? "SAFER is a high-performance B2B SaaS AI Analytics Layer for Indonesian Payment Service Providers (PJP) — Tier-1/2 banks and fintechs. Combining real-time ML Scoring V3 (<50ms), SHAP Explainable AI, and Network Graph Intelligence to secure QRIS & BI-FAST transactions."
            : "SAFER adalah B2B SaaS AI Analytics Layer berkinerja tinggi untuk institusi Penyelenggara Jasa Pembayaran (PJP) — bank BUKU 3/4 dan fintech Indonesia. Memadukan ML Scoring V3 real-time (<50ms), SHAP Explainable AI, dan Graph Intelligence untuk mengamankan transaksi QRIS & BI-FAST."}
        </p>

        {/* CTA GRID BANNER */}
        <div className="pt-4 grid gap-4 sm:flex sm:items-center">
          <button
            onClick={onOpenConsultModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-xl hover:bg-primary/90 transition-all hover:scale-[1.02]"
          >
            <MessageSquare className="h-4 w-4" /> {isEn ? "Contact SAFER Founders Team" : "Hubungi & Konsultasi Tim SAFER"} <ArrowUpRight className="h-4 w-4" />
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-card/90 px-6 py-3.5 text-sm font-bold text-foreground hover:bg-primary/10 hover:border-primary transition-all"
          >
            <Globe className="h-4 w-4 text-primary" /> {isEn ? "Explore Main SAFER Product & Landing Portal?" : "Ingin Menjelajahi Produk & Portal Landing Page Dulu?"} <ArrowRight className="h-4 w-4 text-primary" />
          </Link>
        </div>
      </div>
    </div>
  );
}
