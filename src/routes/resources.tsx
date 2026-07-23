/**
 * Resources & Insights Center Route — Thin Orchestrator (Bilingual i18n Supported)
 * Uses the same top header model as Investors page with customized action CTAs.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Sparkles, Compass, ArrowRight, LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/safer/Logo";
import { ThemeToggle } from "@/components/safer/ThemeToggle";
import { LanguageToggle } from "@/components/safer/LanguageToggle";
import { ArticleList, ArticleReader, ARTICLES } from "@/features/resources";
import { useTranslation } from "@/lib/i18n";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources & Insights Center · SAFER FDS" },
      { name: "description", content: "Pusat edukasi dan panduan teknologi fraud: Apa itu FDS, jenis penipuan digital di Indonesia, dan cara kerja SAFER." },
      { name: "keywords", content: "apa itu fds, fraud detection system indonesia, cara kerja fds, jenis fraud perbankan, rekening bagong, smart ai safer" },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const { language } = useTranslation();
  const isEn = language === "en";

  const [selectedArticleId, setSelectedArticleId] = useState<string>("what-is-fds");
  const activeArticle = ARTICLES.find((a) => a.id === selectedArticleId) || ARTICLES[0];

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* ─── STANDALONE TOP HEADER BAR (MATCHES INVESTORS PAGE NAVBAR STYLE) ─── */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 md:px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden sm:inline-block h-4 w-px bg-border" />
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-400">
            <Sparkles className="h-3 w-3" /> {isEn ? "Resources & Insights Center" : "Pusat Edukasi & Insights"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* ─── 1 CTA BESAR: JELAJAHI PORTAL UTAMA ─── */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-primary px-4 py-2 text-xs md:text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:opacity-90 hover:scale-[1.02] transition-all"
          >
            <Compass className="h-4 w-4" />
            <span>{isEn ? "Explore SAFER Main Portal" : "Jelajahi Portal Utama SAFER"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Secondary CTA: Analyst Console */}
          <Link
            to="/dashboard"
            className="hidden lg:inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{isEn ? "Open Analyst Console" : "Buka Konsol Analis"}</span>
          </Link>

          <div className="flex items-center gap-2 border-l border-border pl-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 md:px-8 py-8 md:py-12">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-8 shadow-sm">
          <h3 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-500" /> 
            {isEn ? "Fraud Knowledge Base & Insights Center" : "Pusat Pengetahuan & Insights Fraud"}
          </h3>
          <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {isEn 
              ? "Welcome to the SAFER Knowledge Center. Here we summarize core banking FDS fundamentals, emerging Indonesian digital financial scam analysis, and technical AI architecture documentation."
              : "Selamat datang di Pusat Edukasi SAFER. Di sini kami merangkum pemahaman dasar tentang FDS perbankan, analisis pola penipuan keuangan digital terbaru di Indonesia, serta dokumentasi bagaimana arsitektur AI kami membantu mengamankan transaksi finansial."}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <ArticleList
            articles={ARTICLES}
            selectedId={selectedArticleId}
            onSelect={setSelectedArticleId}
          />

          <div className="lg:col-span-2">
            <ArticleReader article={activeArticle} />
          </div>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-card/40 border-t border-border mt-auto">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 space-y-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <Logo />
              <p className="mt-3 max-w-md text-xs text-muted-foreground leading-relaxed">
                SAFER — Smart AI Fraud &amp; Economic Risk Intelligence. Built for Indonesia&apos;s digital financial ecosystem.
              </p>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-4">
              <Link to="/" className="hover:text-foreground">{isEn ? "Main Portal" : "Portal Utama"}</Link>
              <Link to="/investors" className="hover:text-foreground">{isEn ? "Investor Portal" : "Portal Investor"}</Link>
              <a href="https://api.safer.web.id/docs" target="_blank" rel="noreferrer" className="hover:text-foreground">API Docs</a>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground shadow-sm">
            <span className="font-semibold text-foreground">
              {isEn ? "Industry Disclaimer:" : "Pernyataan Penyangkalan (Disclaimer Industri):"}
            </span>{" "}
            {isEn 
              ? "All transaction data, customer names, account numbers, IP addresses, device log data, and network visualization relationships presented in this SAFER FDS prototype are synthetic/mock data. This prototype is built specifically for demonstration and operational simulation purposes. It does not use real customer data or actual financial transactions."
              : "Seluruh data transaksi, nama nasabah, nomor rekening, alamat IP, data logikal perangkat, dan visualisasi jaringan hubungan yang disajikan dalam purwarupa (prototype) FDS SAFER ini adalah data sintetis rekayasa buatan. Purwarupa ini dibuat khusus untuk keperluan demonstrasi dan simulasi operasional deteksi fraud industri keuangan digital Indonesia. Tidak menggunakan data nasabah riil atau transaksi finansial nyata dari institusi manapun."}
          </div>
        </div>
      </footer>
    </div>
  );
}
