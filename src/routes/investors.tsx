import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Zap, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  ArrowUpRight, 
  Mail, 
  MessageSquare, 
  FileText, 
  HelpCircle,
  X,
  Send,
  Loader2,
  Award,
  Sparkles,
  Database,
  Layers,
  Activity,
  Globe,
  ArrowRight,
  Compass
} from "lucide-react";
import { Logo } from "@/components/safer/Logo";
import { ThemeToggle } from "@/components/safer/ThemeToggle";
import { LanguageToggle } from "@/components/safer/LanguageToggle";
import { useTranslation } from "@/lib/i18n";

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "Investor & Growth Relations Portal · SAFER FDS" },
      { 
        name: "description", 
        content: "Halaman Hubungan Investor SAFER — Proyeksi finansial, model bisnis B2B SaaS, unit economics, dan peluang pendanaan pre-seed FDS pembayaran digital Indonesia." 
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
  const [formData, setFormData] = useState({
    name: "",
    firm: "",
    email: "",
    phone: "",
    interest_type: "Pre-Seed Investment",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch("https://api.safer.web.id/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: `${formData.firm} (Investor Inquiry: ${formData.interest_type})`,
          position: "Investor / Strategic Partner",
          interest_model: `Investor Inquiry: ${formData.interest_type} - ${formData.message}`,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send inquiry");
      }
      setSubmitted(true);
    } catch (err) {
      alert(isEn ? "Failed to send inquiry. Please try again later." : "Terjadi kesalahan saat mengirim formulir. Silakan coba kembali.");
    } finally {
      setSubmitting(false);
    }
  };

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
          {/* ─── 1 CTA BESAR: JELAJAHI PRODUK / LANDING PAGE ─── */}
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
        
        {/* ─── SPECIAL HERO BANNER WITH EXPLORE CTA ─── */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-card via-card/90 to-primary/15 p-6 md:p-10 shadow-2xl">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-5">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-4 w-4" /> {isEn ? "Executive Pitching Brief · PIDI x DIGDAYA 2026 Hackathon" : "Standalone Pitching Executive Summary · Hackathon PIDI x DIGDAYA 2026"}
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
                onClick={() => setIsConsultModalOpen(true)}
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

        {/* ─── Top Stats Highlights ─── */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { 
              label: isEn ? "Target Fraud Losses Saved" : "Target Fraud Losses Saved", 
              val: "Rp 7.3 Trillion", 
              desc: isEn ? "311,597 OJK Reported Scam Cases" : "311.597 Kasus Scam OJK", 
              icon: ShieldCheck, 
              color: "text-amber-400" 
            },
            { 
              label: isEn ? "Projected Investor ROI (Yr 1)" : "Proyeksi Investor ROI (Yr 1)", 
              val: "455% ROI", 
              desc: isEn ? "Post 3-Month Free Shadow Mode" : "Pasca-Shadow Mode 3 Bulan", 
              icon: TrendingUp, 
              color: "text-emerald-400" 
            },
            { 
              label: isEn ? "Operational Break-Even" : "Operational Break-Even", 
              val: "2 Business + 1 Enterprise", 
              desc: isEn ? "Active Clients to Cover Fixed Costs" : "Klien Aktif Impas", 
              icon: Building2, 
              color: "text-cyan-400" 
            },
            { 
              label: isEn ? "Pre-Seed Investment Ask" : "Pre-Seed Ask", 
              val: "Rp 150 Million", 
              desc: isEn ? "Servers & ISO 27001 Certification" : "Server & Sertifikasi ISO 27001", 
              icon: DollarSign, 
              color: "text-purple-400" 
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-md shadow-sm hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{stat.label}</span>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="mt-2 text-xl md:text-2xl font-bold text-foreground">{stat.val}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.desc}</div>
              </div>
            );
          })}
        </div>

        {/* ─── 1. Problem & Mandated Market ─── */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-rose-400">
              <Activity className="h-4 w-4" /> {isEn ? "Core Industry Pain Points" : "Masalah Utama Industri (Pain Points)"}
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {isEn ? "Legacy Static Rule-Based FDS Fails Modern Syndicates" : "Sistem Rule-Based Lama Kaku & Tidak Audit-Ready"}
            </h3>
            <ul className="space-y-3 text-xs md:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><b>High False Positive Rate (70-80%):</b> {isEn ? "Operations teams are overwhelmed by false alarms, draining investigation resources." : "Tim analis tenggelam dalam alarm palsu yang menguras waktu dan sumber daya operasional."}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><b>Mule Ring & Gambling Laundering Blindness:</b> {isEn ? "Single-transaction analysis cannot uncover cross-account money laundering networks." : "Analisis per transaksi individual tidak dapat mendeteksi pencucian uang berantai lintas akun."}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><b>Global Vendor Black-Box AI:</b> {isEn ? "Costly offshore systems fail to provide audit reasoning matching Indonesian banking SOPs." : "Sistem luar negeri mahal dan tidak dapat menjelaskan alasan audit dalam terminologi regulasi Indonesia."}</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-400">
              <Zap className="h-4 w-4" /> {isEn ? "Solution & Mandated Market Drive" : "Solusi & Mandated Market Drive"}
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {isEn ? "Bank Indonesia PBI No. 10/2025 Forces Integrated FDS Adopsi" : "PBI No. 10/2025 Memaksa Adopsi FDS Terintegrasi"}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {isEn 
                ? "Bank Indonesia officially mandates all Payment Service Providers (PJP) to operate an integrated anti-fraud infrastructure. SAFER acts as a compliant auxiliary AI layer governed by Human-in-the-Loop principles."
                : "Bank Indonesia secara resmi mewajibkan seluruh Penyelenggara Jasa Pembayaran (PJP) memiliki infrastruktur penanganan fraud otomatis. SAFER memposisikan diri sebagai penyedia teknologi penunjang yang patuh regulasi dengan prinsip Human-in-the-Loop."}
            </p>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300">
              <b>Mandated Demand:</b> {isEn ? "PJPs must upgrade FDS or face regulatory sanctions. SAFER provides the fastest, most cost-effective local AI entry point." : "PJP tidak punya pilihan selain memperkuat FDS mereka. SAFER memberikan opsi tercepat, termurah, dan paling adaptif terhadap ekosistem lokal."}
            </div>
          </div>
        </div>

        {/* ─── 2. Product Pillars & Architecture ─── */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{isEn ? "Product Architecture & V3 Tech Superiority" : "Arsitektur Produk & Keunggulan Teknologi V3"}</h2>
              <p className="text-xs text-muted-foreground">{isEn ? "3 Core Pillars Verified Live on Tencent Cloud VPS Production" : "3 Pilar Utama FDS SAFER yang Diuji Faktual di VPS Produksi"}</p>
            </div>
            <span className="self-start md:self-auto rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary font-mono">
              Model Ensemble V3 · 500K Synthetic Dataset
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-primary text-sm">
                <Database className="h-4 w-4" /> 1. ML Scoring Engine V3
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isEn 
                  ? "XGBoost + LightGBM ensemble processing 33 features (including cyclical hour hour_sin & hour_cos and financial ratio features)."
                  : "Ensemble XGBoost + LightGBM memproses 33 fitur (termasuk fitur siklikal jam hour_sin & hour_cos serta rasio finansial)."}
              </p>
              <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg">
                Accuracy: 99.94% | Recall: 99.44% | FPR: 0.008%
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-purple-400 text-sm">
                <Layers className="h-4 w-4" /> 2. Explainable AI (SHAP)
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isEn 
                  ? "Translates marginal feature contributions into concise audit reasoning tailored for Indonesian banking SOPs without black-box opacity."
                  : "Menerjemahkan kontribusi marjinal fitur menjadi penjelasan ringkas berbasis terminologi SOP perbankan Indonesia tanpa sifat black-box."}
              </p>
              <div className="text-[11px] font-mono text-purple-300 bg-purple-500/10 p-2.5 rounded-lg">
                Human-in-the-Loop · Ready for BI & PPATK Audit
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-cyan-400 text-sm">
                <Building2 className="h-4 w-4" /> 3. Graph Intelligence
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isEn 
                  ? "NetworkX maps 5-tier topology (IP → Device → Sender → Receiver → Merchant) uncovering money laundering & mule accounts."
                  : "NetworkX memetakan topologi hierarki 5 tingkat (IP → Device → Sender → Receiver → Merchant) untuk mengungkap pencucian uang & Mule Ring."}
              </p>
              <div className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 p-2.5 rounded-lg">
                100% Recall on 8 Local Fraud Patterns
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3. Unit Economics & Financial Projections ─── */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{isEn ? "Unit Economics & Financial Projections" : "Unit Economics & Proyeksi Keuangan"}</h2>
              <p className="text-xs text-muted-foreground">{isEn ? "Detailed Breakdown for Client ROI, Operational BEP, & Investor ROI" : "Proyeksi Rinci Klien ROI, Break-Even Point, & Startup Investor ROI"}</p>
            </div>
            <span className="self-start md:self-auto rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 font-semibold">
              B2B SaaS Pricing Tiering
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Client ROI Card */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-3">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider">{isEn ? "Client ROI (Tier Business)" : "Proyeksi ROI Klien (Tier Business)"}</div>
              <div className="text-2xl font-extrabold text-foreground">&gt; 1,000% ROI</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isEn 
                  ? "Assumes Rp 500M/mo fraud loss. Savings Rp 3B/yr + staff efficiency Rp 120M/yr = Benefit Rp 3.12B vs Investment Rp 280M."
                  : "Asumsi fraud Rp 500 Juta/bln. Hemat fraud Rp 3 Miliar/thn + efisiensi staf Rp 120 Juta/thn = Benefit Rp 3,12 Miliar vs Biaya Rp 280 Juta."}
              </p>
              <div className="text-xs font-semibold text-emerald-400 pt-2 border-t border-border">
                {isEn ? "Client Payback Period: < 2 Months" : "Payback Period Klien: < 2 Bulan"}
              </div>
            </div>

            {/* BEP Card */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-6 space-y-3">
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{isEn ? "Operational Break-Even Point" : "Break-Even Point (BEP) Operasional"}</div>
              <div className="text-2xl font-extrabold text-foreground">2 Business + 1 Enterprise</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isEn 
                  ? "Monthly operational break-even is achieved rapidly with just 2 Tier Business and 1 Tier Enterprise active clients."
                  : "Impas operasional bulanan SAFER tercapai secara cepat hanya dengan 2 klien Tier Business dan 1 klien Tier Enterprise aktif secara bersamaan."}
              </p>
              <div className="text-xs font-semibold text-cyan-300 pt-2 border-t border-border">
                {isEn ? "Fixed Operational Cost: ~Rp 130M / yr" : "Fixed Cost Operasional Saja: ~Rp 130 Juta/thn"}
              </div>
            </div>

            {/* Investor ROI Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-3">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{isEn ? "Investor ROI (Post-Shadow Mode)" : "Proyeksi ROI Investor (Pasca-Shadow)"}</div>
              <div className="text-2xl font-extrabold text-foreground">455% ROI (4.55x)</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isEn 
                  ? "Post 3-month free Shadow Mode (Months 1-3). 5 paid Tier Business clients for 9 months = Gross Rev Rp 675M vs Exp Rp 220M → Net Profit Rp 455M."
                  : "Pasca-Shadow Mode 3 bulan gratis (Bulan 1–3). 5 klien Tier Business berbayar 9 bulan = Gross Rev Rp 675 Juta vs Exp Rp 220 Juta → Net Profit Rp 455 Juta."}
              </p>
              <div className="text-xs font-semibold text-emerald-300 pt-2 border-t border-border">
                {isEn ? "Investor Payback (Rp 100M): Month 6" : "Payback Modal Investor (Rp 100M): Bulan Ke-6"}
              </div>
            </div>
          </div>

          {/* Revenue Tier Table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">{isEn ? "Tier Name" : "Tier Skema"}</th>
                  <th className="px-4 py-3.5">{isEn ? "Target Segment" : "Target Segmen"}</th>
                  <th className="px-4 py-3.5">{isEn ? "Volume Quota / Mo" : "Volume Kuota / Bulan"}</th>
                  <th className="px-4 py-3.5">{isEn ? "Subscription Price" : "Harga Langganan"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                <tr>
                  <td className="px-4 py-3.5 font-semibold text-primary">Tier Starter</td>
                  <td className="px-4 py-3.5">{isEn ? "Early-stage Fintech / Payment Gateways" : "Fintech Rintisan / Payment Gateway Awal"}</td>
                  <td className="px-4 py-3.5">&lt; 500,000 Transactions</td>
                  <td className="px-4 py-3.5 font-mono">Rp 5 Million / Mo ($330)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3.5 font-semibold text-cyan-400">Tier Business</td>
                  <td className="px-4 py-3.5">{isEn ? "Mid-tier E-wallets & Payment Switches" : "Fintech Menengah / E-Wallet & Payment Switch"}</td>
                  <td className="px-4 py-3.5">&lt; 5,000,000 Transactions</td>
                  <td className="px-4 py-3.5 font-mono">Rp 15 Million / Mo ($1,000)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3.5 font-semibold text-purple-400">Tier Enterprise</td>
                  <td className="px-4 py-3.5">{isEn ? "Tier-1 Enterprise Banks & Regulators" : "Bank Umum BUKU 3 & 4 / Lembaga Keuangan Besar"}</td>
                  <td className="px-4 py-3.5">{isEn ? "Custom Unlimited Volume" : "Volume Kustom Tak Terbatas"}</td>
                  <td className="px-4 py-3.5 font-mono">Rp 50 Million / Mo ($3,300)</td>
                </tr>
                <tr className="bg-accent/30">
                  <td className="px-4 py-3.5 font-semibold text-emerald-400">On-Premise Setup Fee</td>
                  <td className="px-4 py-3.5">{isEn ? "Data Residency & Air-Gapped Deployments" : "Kepatuhan Data Residency / Air-Gapped Environment"}</td>
                  <td className="px-4 py-3.5">{isEn ? "Installation, Pipeline Custom & Training" : "Instalasi, Kustom Model & Training Analis"}</td>
                  <td className="px-4 py-3.5 font-mono">Rp 100 Million ($6,600 One-time)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Disclaimer Box */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-xs text-amber-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm">
              <HelpCircle className="h-4 w-4" /> {isEn ? "Financial Disclaimer & Projections Note:" : "Disclaimer Finansial & Proyeksi:"}
            </div>
            <p className="leading-relaxed text-xs text-amber-200/90">
              {isEn 
                ? "All figures above are preliminary estimates and will be definitively recalculated after all fixed costs, variable costs, and initial contingency costs are finalized together with strategic investment partners."
                : "Seluruh angka di atas merupakan proyeksi estimasi awal berdasarkan benchmark pasar dan akan dihitung kembali secara definitif setelah struktur biaya tetap (fixed cost), biaya variabel (variable cost), serta alokasi dana tidak terduga (contingency cost) pada awal fase implementasi ditetapkan secara final bersama mitra investor."}
            </p>
          </div>
        </div>

        {/* ─── 4. Team Capability & Governance ─── */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-bold text-foreground">{isEn ? "Team Capability & Organizational Expansion" : "Kapabilitas Tim & Rencana Ekspansi Organisasi"}</h2>
            <p className="text-xs text-muted-foreground">{isEn ? "Informatics Students, Universitas Trilogi — NIIT Certified Software Engineers (CEP CCIT FTUI)" : "Mahasiswa Teknik Informatika Univ. Trilogi Tersertifikasi Software Engineer NIIT (CEP CCIT FTUI)"}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
              <div className="font-bold text-foreground text-sm">Akbar Fadhila</div>
              <div className="text-xs font-semibold text-primary">Product, AI & Project Manager Lead</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isEn
                  ? "Architects end-to-end AI pipelines, 4 FastAPI microservices, V3 models (.ubj & .txt on Tencent Cloud VPS), and manages project execution (Shadow Mode to Auto Intervention), 6-12 mo roadmap, and modular deployment."
                  : "Merancang arsitektur end-to-end, FastAPI 4 microservices, model V3 (.ubj & .txt di VPS Tencent Cloud), serta mengelola alur manajemen proyek (Shadow Mode hingga Auto Intervention), roadmap 6–12 bulan, dan deployment modular."}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
              <div className="font-bold text-foreground text-sm">Neyla Lian Syatifa</div>
              <div className="text-xs font-semibold text-purple-400">UX Design & Business Domain Lead</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isEn 
                  ? "Designs dashboard system, investigation workflows, Fraud Graph, and usability testing. Leads BI/OJK/PPATK compliance, Human-in-the-Loop alignment, B2B SaaS monetization, and ASPI association outreach."
                  : "Merancang sistem desain dashboard, alur investigasi, Fraud Graph, dan pengujian usability. Memimpin kepatuhan regulasi (BI, OJK, PPATK) berbasis human-in-the-loop, skema B2B SaaS, dan asosiasi ASPI."}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
              <div className="font-bold text-foreground text-sm">Amadeus Christiano</div>
              <div className="text-xs font-semibold text-cyan-400">Frontend & Client Demo Lead</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isEn 
                  ? "Develops React/TypeScript UI (0 build errors), Monitoring Dashboard, Audit Queue, Risk Simulator, Fraud Graph, ensures intuitive analyst UX, and leads technical client demonstrations."
                  : "Mengembangkan komponen React/TypeScript (0 error build), Monitoring Dashboard, Audit Queue, Risk Simulator, dan Fraud Graph, memastikan UX ramah analis, serta memimpin demonstrasi teknis ke calon klien."}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card/80 p-5 space-y-2 text-xs">
            <div className="font-bold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> {isEn ? "Team Expansion Plan & Advisory Mentorship:" : "Rencana Ekspansi Tim & Pendampingan Ahli:"}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {isEn 
                ? "Looking ahead, the development team will expand from 3 to 5 members (adding 1 DevOps Engineer and 1 Fullstack Engineer) accompanied by Business Advisory Mentors and Banking Regulatory Legal Mentors."
                : "Ke depan, tim developer akan diperluas dari 3 menjadi 5 orang (menambah 1 DevOps Engineer dan 1 Fullstack Engineer) dengan pendampingan Mentor Bisnis untuk skala komersial dan Mentor Hukum Regulasi Perbankan."}
            </p>
          </div>
        </div>

        {/* ─── 5. Investment Ask & CTA Banner ─── */}
        <div className="rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-purple-500/10 p-8 md:p-12 text-center space-y-5 shadow-2xl">
          <Award className="h-12 w-12 text-primary mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{isEn ? "Interested in Strategic Discussions or Investment?" : "Tertarik Berdiskusi atau Berinvestasi di SAFER?"}</h2>
          <p className="max-w-2xl mx-auto text-xs md:text-sm text-muted-foreground leading-relaxed">
            {isEn 
              ? "We welcome discussions for Pre-Seed funding (Rp 150 Million), pilot project partnerships, or business advisory. Reach out directly to SAFER founders."
              : "Kami membuka pintu diskusi untuk pendanaan Pre-Seed (Rp 150 Juta), kemitraan strategis pilot project, maupun advisori bisnis. Hubungi tim pendiri SAFER secara langsung."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={() => setIsConsultModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-xl hover:bg-primary/90 transition-all hover:scale-105"
            >
              <Send className="h-4 w-4" /> {isEn ? "Investor Inquiry Form" : "Formulir Konsultasi Investor"}
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
            >
              <Globe className="h-4 w-4 text-muted-foreground" /> {isEn ? "Return to SAFER Main Landing Portal" : "Masuk ke Portal Landing Page Utama SAFER"}
            </Link>
          </div>
        </div>

      </main>

      {/* ─── STANDALONE FOOTER ─── */}
      <footer className="border-t border-border bg-card/40 py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} SAFER FDS Team — Universitas Trilogi. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-foreground">{isEn ? "Main Portal" : "Portal Utama"}</Link>
            <Link to="/dashboard" className="hover:text-foreground">Dashboard Demo</Link>
            <a href="https://api.safer.web.id/docs" target="_blank" rel="noreferrer" className="hover:text-foreground">API Docs</a>
          </div>
        </div>
      </footer>

      {/* ─── Investor Consultation Modal ─── */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-primary/40 bg-card shadow-2xl p-6 md:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => { setIsConsultModalOpen(false); setSubmitted(false); }} 
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {!submitted ? (
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <div className="text-center pb-2">
                  <TrendingUp className="h-10 w-10 text-primary mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-foreground">{isEn ? "SAFER Investor Inquiry Form" : "Konsultasi & Inquiry Investor SAFER"}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {isEn 
                      ? "Submit your investment interest or strategic partnership query. Our team will respond within 24 hours."
                      : "Sampaikan minat investasi atau kemitraan strategis Anda. Tim kami akan merespons dalam 1x24 jam."}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-muted-foreground uppercase mb-1">{isEn ? "Full Name" : "Nama Lengkap"}</label>
                    <input 
                      type="text" 
                      required
                      placeholder={isEn ? "Your Name" : "Nama Anda"}
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground uppercase mb-1">{isEn ? "Company / Firm / Fund Name" : "Perusahaan / Venture Capital / Angel Fund"}</label>
                    <input 
                      type="text" 
                      required
                      placeholder={isEn ? "Firm Name" : "Nama Firma / Dana Investasi"}
                      value={formData.firm}
                      onChange={e => setFormData({ ...formData, firm: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-muted-foreground uppercase mb-1">{isEn ? "Professional Email" : "Email Profesional"}</label>
                      <input 
                        type="email" 
                        required
                        placeholder="investor@firm.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-muted-foreground uppercase mb-1">{isEn ? "WhatsApp / Phone" : "Nomor WhatsApp / HP"}</label>
                      <input 
                        type="text" 
                        placeholder="+62 812 xxxx xxxx"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground uppercase mb-1">{isEn ? "Interest Category" : "Kategori Minat Diskusi"}</label>
                    <select
                      value={formData.interest_type}
                      onChange={e => setFormData({ ...formData, interest_type: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="Pre-Seed Investment">{isEn ? "Pre-Seed Investment (Rp 150 Million)" : "Pre-Seed Investment (Pendanaan Rp 150 Juta)"}</option>
                      <option value="Pilot Project Partnership">{isEn ? "Pilot Project Partnership (Shadow Mode)" : "Kemitraan Pilot Project (Shadow Mode)"}</option>
                      <option value="Business Advisory">{isEn ? "Business & Regulatory Advisory" : "Advisori Bisnis & Regulasi"}</option>
                      <option value="General Inquiry">{isEn ? "General Inquiry" : "Pertanyaan Umum"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground uppercase mb-1">{isEn ? "Message / Note" : "Pesan / Catatan Tambahan"}</label>
                    <textarea 
                      rows={3}
                      placeholder={isEn ? "Briefly describe your discussion focus or investment thesis..." : "Jelaskan secara ringkas fokus diskusi atau kriteria investasi Anda..."}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> {isEn ? "Sending..." : "Mengirim Pesan..."}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> {isEn ? "Submit Consultation Inquiry" : "Kirim Formulir Konsultasi"}
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-foreground">{isEn ? "Inquiry Sent Successfully!" : "Formulir Berhasil Terkirim!"}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isEn 
                    ? "Thank you for your interest in SAFER FDS. Your inquiry has been routed directly to the founding team (Akbar Fadhila & Team). We will reach back within 24 hours."
                    : "Terima kasih atas minat Anda pada SAFER FDS. Pesan Anda telah diteruskan langsung ke tim pendiri (Akbar Fadhila & Tim). Kami akan menghubungi Anda kembali dalam waktu maksimal 1x24 jam."}
                </p>
                <button
                  onClick={() => { setIsConsultModalOpen(false); setSubmitted(false); }}
                  className="rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground"
                >
                  {isEn ? "Close Window" : "Tutup Halaman"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
