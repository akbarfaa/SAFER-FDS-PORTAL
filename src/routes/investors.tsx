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
      alert("Terjadi kesalahan saat mengirim formulir. Silakan coba kembali atau hubungi tim via WhatsApp/Email.");
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
            <Sparkles className="h-3 w-3" /> Investor & Growth Relations
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* ─── 1 CTA BESAR: JELAJAHI PRODUK / LANDING PAGE ─── */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 px-4 py-2 text-xs md:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-[1.02] transition-all"
          >
            <Compass className="h-4 w-4" />
            <span>Jelajahi Portal Utama SAFER</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="hidden md:flex items-center gap-2 border-l border-border pl-3">
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
                <ShieldCheck className="h-4 w-4" /> Standalone Pitching Executive Summary · Hackathon PIDI x DIGDAYA 2026
              </div>

              {/* Top Banner Secondary Link to Product */}
              <Link 
                to="/dashboard"
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
              >
                Langsung Coba Real-Time Dashboard <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <h1 className="text-2xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              Membangun Ketahanan Ekonomi Digital Indonesia Melalui <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400">AI Fraud Intelligence</span>
            </h1>

            <p className="max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed">
              SAFER adalah <i>B2B SaaS AI Analytics Layer</i> berkinerja tinggi untuk institusi Penyelenggara Jasa Pembayaran (PJP) — bank BUKU 3/4 dan fintech Indonesia. Memadukan ML Scoring V3 real-time (&lt;50ms), SHAP Explainable AI, dan Graph Intelligence untuk mengamankan transaksi QRIS & BI-FAST.
            </p>

            {/* CTA GRID BANNER */}
            <div className="pt-4 grid gap-4 sm:flex sm:items-center">
              <button
                onClick={() => setIsConsultModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-xl hover:bg-primary/90 transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="h-4 w-4" /> Hubungi & Konsultasi Tim SAFER <ArrowUpRight className="h-4 w-4" />
              </button>
              
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-card/90 px-6 py-3.5 text-sm font-bold text-foreground hover:bg-primary/10 hover:border-primary transition-all"
              >
                <Globe className="h-4 w-4 text-primary" /> Ingin Menjelajahi Produk & Portal Landing Page Dulu? <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Top Stats Highlights ─── */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Target Fraud Losses Saved", val: "Rp 7.3 Triliun", desc: "311.597 Kasus Scam OJK", icon: ShieldCheck, color: "text-amber-400" },
            { label: "Proyeksi Investor ROI (Yr 1)", val: "455% ROI", desc: "Pasca-Shadow Mode 3 Bulan", icon: TrendingUp, color: "text-emerald-400" },
            { label: "Operational Break-Even", val: "2 Business + 1 Enterprise", desc: "Klien Aktif Impas", icon: Building2, color: "text-cyan-400" },
            { label: "Pre-Seed Ask", val: "Rp 150 Juta", desc: "Server & Sertifikasi ISO 27001", icon: DollarSign, color: "text-purple-400" },
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
              <Activity className="h-4 w-4" /> Masalah Utama Industri (Pain Points)
            </div>
            <h3 className="text-lg font-bold text-foreground">Sistem Rule-Based Lama Kaku & Tidak Audit-Ready</h3>
            <ul className="space-y-3 text-xs md:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><b>High False Positive Rate (70-80%):</b> Tim analis tenggelam dalam alarm palsu yang menguras waktu dan sumber daya operasional.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><b>Kebutaan Sindikat Mule Ring & Slot Cashout:</b> Analisis per transaksi individual tidak dapat mendeteksi pencucian uang berantai lintas akun.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><b>Vendor Global Black-Box AI:</b> Sistem luar negeri mahal dan tidak dapat menjelaskan alasan audit dalam terminologi regulasi Indonesia.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-400">
              <Zap className="h-4 w-4" /> Solusi & Mandated Market Drive
            </div>
            <h3 className="text-lg font-bold text-foreground">PBI No. 10/2025 Memaksa Adopsi FDS Terintegrasi</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Bank Indonesia secara resmi mewajibkan seluruh Penyelenggara Jasa Pembayaran (PJP) memiliki infrastruktur penanganan fraud otomatis. SAFER memposisikan diri sebagai penyedia teknologi penunjang yang patuh regulasi dengan prinsip <b>Human-in-the-Loop</b>.
            </p>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300">
              <b>Mandated Demand:</b> PJP tidak punya pilihan selain memperkuat FDS mereka. SAFER memberikan opsi tercepat, termurah, dan paling adaptif terhadap ekosistem lokal.
            </div>
          </div>
        </div>

        {/* ─── 2. Product Pillars & Architecture ─── */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Arsitektur Produk & Keunggulan Teknologi V3</h2>
              <p className="text-xs text-muted-foreground">3 Pilar Utama FDS SAFER yang Diuji Faktual di VPS Produksi</p>
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
                Ensemble XGBoost + LightGBM memproses 33 fitur (termasuk fitur siklikal jam <code className="text-xs">hour_sin</code> & <code className="text-xs">hour_cos</code> serta rasio finansial).
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
                Menerjemahkan kontribusi marjinal fitur menjadi penjelasan ringkas berbasis terminologi SOP perbankan Indonesia tanpa sifat <i>black-box</i>.
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
                NetworkX memetakan topologi hierarki 5 tingkat (IP → Device → Sender → Receiver → Merchant) untuk mengungkap pencucian uang & Mule Ring.
              </p>
              <div className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 p-2.5 rounded-lg">
                100% Recall pada 8 Skenario Fraud Khas Indonesia
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3. Unit Economics & Financial Projections ─── */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Unit Economics & Proyeksi Keuangan</h2>
              <p className="text-xs text-muted-foreground">Proyeksi Rinci Klien ROI, Break-Even Point, & Startup Investor ROI</p>
            </div>
            <span className="self-start md:self-auto rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 font-semibold">
              B2B SaaS Pricing Tiering
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Client ROI Card */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-3">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider">Proyeksi ROI Klien (Tier Business)</div>
              <div className="text-2xl font-extrabold text-foreground">&gt; 1.000% ROI</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Asumsi fraud Rp 500 Juta/bln. Hemat fraud Rp 3 Miliar/thn + efisiensi staf Rp 120 Juta/thn = Benefit Rp 3,12 Miliar vs Biaya Rp 280 Juta.
              </p>
              <div className="text-xs font-semibold text-emerald-400 pt-2 border-t border-border">
                Payback Period Klien: &lt; 2 Bulan
              </div>
            </div>

            {/* BEP Card */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-6 space-y-3">
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Break-Even Point (BEP) Operasional</div>
              <div className="text-2xl font-extrabold text-foreground">2 Business + 1 Enterprise</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Impas operasional bulanan SAFER tercapai secara cepat hanya dengan 2 klien Tier Business dan 1 klien Tier Enterprise aktif secara bersamaan.
              </p>
              <div className="text-xs font-semibold text-cyan-300 pt-2 border-t border-border">
                Fixed Cost Operasional Saja: ~Rp 130 Juta/thn
              </div>
            </div>

            {/* Investor ROI Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-3">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Proyeksi ROI Investor (Pasca-Shadow)</div>
              <div className="text-2xl font-extrabold text-foreground">455% ROI (4.55x)</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pasca-Shadow Mode 3 bulan gratis (Bulan 1–3). 5 klien Tier Business berbayar 9 bulan = Gross Rev Rp 675 Juta vs Exp Rp 220 Juta → <b>Net Profit Rp 455 Juta</b>.
              </p>
              <div className="text-xs font-semibold text-emerald-300 pt-2 border-t border-border">
                Payback Modal Investor (Rp 100M): Bulan Ke-6
              </div>
            </div>
          </div>

          {/* Revenue Tier Table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Tier Skema</th>
                  <th className="px-4 py-3.5">Target Segmen</th>
                  <th className="px-4 py-3.5">Volume Kuota / Bulan</th>
                  <th className="px-4 py-3.5">Harga Langganan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                <tr>
                  <td className="px-4 py-3.5 font-semibold text-primary">Tier Starter</td>
                  <td className="px-4 py-3.5">Fintech Rintisan / Payment Gateway Awal</td>
                  <td className="px-4 py-3.5">&lt; 500 Ribu Transaksi</td>
                  <td className="px-4 py-3.5 font-mono">Rp 5 Juta / Bulan</td>
                </tr>
                <tr>
                  <td className="px-4 py-3.5 font-semibold text-cyan-400">Tier Business</td>
                  <td className="px-4 py-3.5">Fintech Menengah / E-Wallet & Payment Switch</td>
                  <td className="px-4 py-3.5">&lt; 5 Juta Transaksi</td>
                  <td className="px-4 py-3.5 font-mono">Rp 15 Juta / Bulan</td>
                </tr>
                <tr>
                  <td className="px-4 py-3.5 font-semibold text-purple-400">Tier Enterprise</td>
                  <td className="px-4 py-3.5">Bank Umum BUKU 3 & 4 / Lembaga Keuangan Besar</td>
                  <td className="px-4 py-3.5">Volume Kustom Tak Terbatas</td>
                  <td className="px-4 py-3.5 font-mono">Rp 50 Juta / Bulan</td>
                </tr>
                <tr className="bg-accent/30">
                  <td className="px-4 py-3.5 font-semibold text-emerald-400">On-Premise Setup Fee</td>
                  <td className="px-4 py-3.5">Kepatuhan Data Residency / Air-Gapped Environment</td>
                  <td className="px-4 py-3.5">Instalasi, Kustom Model & Training Analis</td>
                  <td className="px-4 py-3.5 font-mono">Rp 100 Juta (One-time)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Disclaimer Box */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-xs text-amber-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm">
              <HelpCircle className="h-4 w-4" /> Disclaimer Finansial & Proyeksi:
            </div>
            <p className="leading-relaxed text-xs text-amber-200/90">
              Seluruh angka di atas merupakan proyeksi estimasi awal berdasarkan benchmark pasar dan akan dihitung kembali secara definitif setelah struktur biaya tetap (fixed cost), biaya variabel (variable cost), serta alokasi dana tidak terduga (contingency cost) pada awal fase implementasi ditetapkan secara final bersama mitra investor.
            </p>
          </div>
        </div>

        {/* ─── 4. Team Capability & Governance ─── */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-bold text-foreground">Kapabilitas Tim & Rencana Ekspansi Organisasi</h2>
            <p className="text-xs text-muted-foreground">Mahasiswa Teknik Informatika Univ. Trilogi Tersertifikasi Software Engineer NIIT (CEP CCIT FTUI)</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
              <div className="font-bold text-foreground text-sm">Akbar Fadhila</div>
              <div className="text-xs font-semibold text-primary">Product, AI & Project Manager Lead</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Merancang arsitektur end-to-end, FastAPI 4 microservices, model V3 (<code className="text-[10px]">.ubj</code> & <code className="text-[10px]">.txt</code> di VPS Tencent Cloud), serta mengelola alur manajemen proyek (Shadow Mode hingga Auto Intervention), roadmap 6–12 bulan, dan deployment modular.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
              <div className="font-bold text-foreground text-sm">Neyla Lian Syatifa</div>
              <div className="text-xs font-semibold text-purple-400">UX Design & Business Domain Lead</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Merancang sistem desain dashboard, alur investigasi, Fraud Graph, dan pengujian usability. Memimpin kepatuhan regulasi (BI, OJK, PPATK) berbasis human-in-the-loop, skema B2B SaaS, dan asosiasi ASPI.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
              <div className="font-bold text-foreground text-sm">Amadeus Christiano</div>
              <div className="text-xs font-semibold text-cyan-400">Frontend & Client Demo Lead</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mengembangkan komponen React/TypeScript (0 error build), Monitoring Dashboard, Audit Queue, Risk Simulator, dan Fraud Graph, memastikan UX ramah analis, serta memimpin demonstrasi teknis ke calon klien.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card/80 p-5 space-y-2 text-xs">
            <div className="font-bold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Rencana Ekspansi Tim & Pendampingan Ahli:
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Ke depan, tim developer akan diperluas dari 3 menjadi 5 orang (menambah <b>1 DevOps Engineer</b> dan <b>1 Fullstack Engineer</b>) dengan pendampingan <b>Mentor Bisnis</b> untuk skala komersial dan <b>Mentor Hukum Regulasi Perbankan</b>.
            </p>
          </div>
        </div>

        {/* ─── 5. Investment Ask & CTA Banner ─── */}
        <div className="rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-purple-500/10 p-8 md:p-12 text-center space-y-5 shadow-2xl">
          <Award className="h-12 w-12 text-primary mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Tertarik Berdiskusi atau Berinvestasi di SAFER?</h2>
          <p className="max-w-2xl mx-auto text-xs md:text-sm text-muted-foreground leading-relaxed">
            Kami membuka pintu diskusi untuk pendanaan Pre-Seed (Rp 150 Juta), kemitraan strategis pilot project, maupun advisori bisnis. Hubungi tim pendiri SAFER secara langsung.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={() => setIsConsultModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-xl hover:bg-primary/90 transition-all hover:scale-105"
            >
              <Send className="h-4 w-4" /> Formulir Konsultasi Investor
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
            >
              <Globe className="h-4 w-4 text-muted-foreground" /> Masuk ke Portal Landing Page Utama SAFER
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
            <Link to="/" className="hover:text-foreground">Portal Utama</Link>
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
                  <h3 className="text-xl font-bold text-foreground">Konsultasi & Inquiry Investor SAFER</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Sampaikan minat investasi atau kemitraan strategis Anda. Tim kami akan merespons dalam 1x24 jam.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-muted-foreground uppercase mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Nama Anda"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground uppercase mb-1">Perusahaan / Venture Capital / Angel Fund</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Nama Firma / Dana Investasi"
                      value={formData.firm}
                      onChange={e => setFormData({ ...formData, firm: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-muted-foreground uppercase mb-1">Email Profesional</label>
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
                      <label className="block font-semibold text-muted-foreground uppercase mb-1">Nomor WhatsApp / HP</label>
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
                    <label className="block font-semibold text-muted-foreground uppercase mb-1">Kategori Minat Diskusi</label>
                    <select
                      value={formData.interest_type}
                      onChange={e => setFormData({ ...formData, interest_type: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="Pre-Seed Investment">Pre-Seed Investment (Pendanaan Rp 150 Juta)</option>
                      <option value="Pilot Project Partnership">Kemitraan Pilot Project (Shadow Mode)</option>
                      <option value="Business Advisory">Advisori Bisnis & Regulasi</option>
                      <option value="General Inquiry">Pertanyaan Umum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground uppercase mb-1">Pesan / Catatan Tambahan</label>
                    <textarea 
                      rows={3}
                      placeholder="Jelaskan secara ringkas fokus diskusi atau kriteria investasi Anda..."
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
                      <Loader2 className="h-4 w-4 animate-spin" /> Mengirim Pesan...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Kirim Formulir Konsultasi
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-foreground">Formulir Berhasil Terkirim!</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Terima kasih atas minat Anda pada SAFER FDS. Pesan Anda telah diteruskan langsung ke tim pendiri (Akbar Fadhila & Tim). Kami akan menghubungi Anda kembali dalam waktu maksimal 1x24 jam.
                </p>
                <button
                  onClick={() => { setIsConsultModalOpen(false); setSubmitted(false); }}
                  className="rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground"
                >
                  Tutup Halaman
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
