/**
 * Resources & Insights Center Route — Thin Orchestrator
 * Composes resources components from @/features/resources.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Logo } from "@/components/safer/Logo";
import { ThemeToggle } from "@/components/safer/ThemeToggle";
import { LanguageToggle } from "@/components/safer/LanguageToggle";
import { ArticleList, ArticleReader, ARTICLES } from "@/features/resources";
import { useTranslation } from "@/lib/i18n";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources & Insights Center · SAFER" },
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
    <div className="min-h-screen w-full bg-surface text-foreground flex flex-col font-sans">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Logo />

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              {isEn ? "Home" : "Beranda"}
            </Link>
            <Link to="/compliance" className="text-muted-foreground hover:text-foreground transition-colors">
              {isEn ? "Compliance" : "Kepatuhan"}
            </Link>
            <Link to="/developer" className="text-muted-foreground hover:text-foreground transition-colors">
              {isEn ? "API Sandbox" : "API Sandbox"}
            </Link>
            <span className="text-primary font-semibold border-b-2 border-primary py-5">
              {isEn ? "Resources & Insights" : "Edukasi & Insights"}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-600/10 transition-colors hover:bg-indigo-500"
            >
              {isEn ? "Open Analyst Console" : "Buka Konsol Analis"}
            </Link>

            <div className="flex items-center gap-2 border-l border-border pl-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 md:px-6 py-8 md:py-12">
        <div className="rounded-xl border border-border bg-card p-6 mb-8 shadow-sm">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" /> 
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

      <footer className="bg-background border-t border-border mt-auto">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 space-y-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <Logo />
              <p className="mt-3 max-w-md text-xs text-muted-foreground">
                SAFER — Smart AI Fraud &amp; Economic Risk Intelligence. Built for Indonesia&apos;s digital financial ecosystem.
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} SAFER. Prototype for demonstration purposes.
            </div>
          </div>
          <div className="rounded-lg border border-warning/20 bg-warning/5 p-4 text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-warning">
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
