import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { Building2, Zap, ShieldCheck, CheckCircle2, Award, DollarSign } from "lucide-react";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "Business Model & Ecosystem Pricing · SAFER" },
      { name: "description", content: "Model bisnis B2B SaaS, skema harga tiering, dan strategi go-to-market SAFER FDS." },
    ],
  }),
  component: BusinessPage,
});

const PHASES = [
  {
    phase: "Fase 1 (Bulan 1-3)",
    icon: Zap,
    who: "Fintech Rintisan & E-Wallet",
    items: ["Tier-2 fintech & payment gateway", "B2B Freemium Shadow Mode (3 Bulan Gratis)", "Uji akurasi stream transaksi riil", "API-first integration"],
    model: "Tier Starter · Rp 5 Juta / bulan",
  },
  {
    phase: "Fase 2 (Bulan 4-6)",
    icon: Building2,
    who: "Fintech Menengah & Switcher",
    items: ["E-wallet berskala nasional", "Payment gateway menengah", "Dashboard investigasi penuh & XAI", "Sertifikasi ISO 27001"],
    model: "Tier Business · Rp 15 Juta / bulan",
  },
  {
    phase: "Fase 3 (Bulan 7-12)",
    icon: ShieldCheck,
    who: "Bank Umum & Regulator",
    items: ["Bank Umum BUKU 3 & 4", "Deployment On-Premise / Private Cloud", "Federated Graph Intelligence", "Kolaborasi regulasi BI & PPATK"],
    model: "Tier Enterprise · Rp 50 Juta / bulan",
  },
];

const PLANS = [
  {
    name: "Tier Starter",
    price: "Rp 5 Juta / bln",
    desc: "Untuk fintech rintisan & startup pembayaran yang sedang tumbuh.",
    features: [
      "Kuota hingga 500.000 transaksi / bulan",
      "Shared SaaS Cloud Deployment",
      "ML Risk Scoring V3 Engine",
      "Explainable AI (SHAP) audit reasoning",
      "Standard REST API Support (SLA 99.5%)",
    ],
    highlight: false,
  },
  {
    name: "Tier Business",
    price: "Rp 15 Juta / bln",
    desc: "Untuk e-wallet & payment gateway menengah (Paling Populer).",
    features: [
      "Kuota hingga 5.000.000 transaksi / bulan",
      "Full Monitoring Dashboard & Audit Queue",
      "Fraud Graph Intelligence (5-Tier Topology)",
      "Priority SLA 99.9% Support",
      "Offline Backtesting POC & Shadow Mode",
    ],
    highlight: true,
  },
  {
    name: "Tier Enterprise",
    price: "Rp 50 Juta / bln",
    desc: "Untuk Bank Umum BUKU 3/4 & lembaga keuangan berskala besar.",
    features: [
      "Volume transaksi kustom tak terbatas",
      "On-Premise / Private Cloud Enclave",
      "Custom ML Model Fine-Tuning & Pipeline",
      "Dedicated 24/7 SRE Support (SLA 99.95%)",
      "Custom Neo4j Graph Database Integration",
    ],
    highlight: false,
  },
];

function BusinessPage() {
  return (
    <AppShell title="Business Model & Ecosystem" subtitle="Skema harga B2B SaaS · Go-to-Market · Unit Economics">
      
      {/* ─── Market Metrics ─── */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { t: "Total Kerugian Scam Digital OJK", v: "Rp 7.3 Triliun", d: "311.597 kasus terlaporkan di Indonesia" },
          { t: "Estimasi ROI Klien (Tier Business)", v: "> 1.000% ROI", d: "Benefit Rp 3.12B/thn vs Cost Rp 280M/thn" },
          { t: "Impas Operasional (BEP)", v: "2 Business + 1 Enterprise", d: "Klien aktif impas fixed cost" },
        ].map((c) => (
          <div key={c.t} className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">{c.t}</div>
            <div className="num mt-1 text-2xl font-bold text-foreground">{c.v}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{c.d}</div>
          </div>
        ))}
      </div>

      {/* ─── Roadmap Expansion ─── */}
      <div className="mt-4 rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4 text-sm font-semibold">Strategi Penetrasi Pasar & Roadmap Adopsi</div>
        <div className="grid gap-px bg-border md:grid-cols-3">
          {PHASES.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.phase} className="bg-card p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">{p.phase}</div>
                <div className="mt-2 flex items-center gap-2 text-base font-semibold">
                  <Icon className="h-4 w-4 text-muted-foreground" /> {p.who}
                </div>
                <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  {p.items.map((i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> {i}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-border pt-3 text-xs font-medium text-primary">{p.model}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Official Pricing Plans (Tahap 2 & 3 Authorized Tiers) ─── */}
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`rounded-lg border bg-card p-6 flex flex-col justify-between ${
              p.highlight ? "border-primary ring-1 ring-primary/40 shadow-lg shadow-primary/10" : "border-border"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-foreground">{p.name}</div>
                {p.highlight && (
                  <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                    Paling Populer
                  </span>
                )}
              </div>
              <div className="num mt-2 text-2xl font-extrabold text-foreground">{p.price}</div>
              <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-emerald-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* ─── On-Premise & Add-on Banner ─── */}
      <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
            <ShieldCheck className="h-4 w-4" /> On-Premise Setup Fee: Rp 100 Juta (One-Time)
          </div>
          <p className="text-xs text-emerald-200/80">
            Khusus institusi perbankan & e-wallet skala besar yang membutuhkan *air-gapped deployment* atau *private cloud enclave* untuk kepatuhan UU PDP & kedaulatan data. Termasuk instalasi, kustomisasi pipeline ML, dan pelatihan tim analis.
          </p>
        </div>
      </div>

      {/* ─── Why Localized Matters ─── */}
      <div className="mt-4 rounded-lg border border-border bg-card p-6">
        <div className="text-sm font-semibold">Keunggulan Berkompetisi (*Competitive Moat*)</div>
        <div className="mt-3 grid gap-4 md:grid-cols-3 text-xs md:text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Transparansi Keputusan (Non Black-Box).</span> Vendor global hanya memberi skor angka. SAFER membongkar faktor risiko dengan SHAP XAI dalam terminologi SOP perbankan lokal yang *audit-ready* untuk BI & PPATK.
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Kontekstualisasi Fraud Indonesia.</span> Dilatih khusus untuk pola fraud lokal — smurfing BI-FAST, mule ring e-wallet, slot cashout ring, dan device farm — yang tidak dimiliki vendor generik barat.
          </p>

          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Retraining Offline Aman.</span> Pembaruan model berjalan offline pada lingkungan terisolasi untuk melindungi engine dari serangan *data poisoning*.
          </p>
        </div>
      </div>

      {/* ─── Professional Services & Support ─── */}
      <div className="mt-4 rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4 text-sm font-semibold">Layanan Profesional & Konsultasi Integrasi</div>
        <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Custom ML Models", d: "Model perilaku kustom yang dilatih pada histori pola fraud spesifik institusi Anda." },
            { t: "Integration Engineering", d: "Tim dedicated engineer untuk menjamin kelancaran integrasi API ke core banking / payment switch." },
            { t: "Analyst Training", d: "Pelatihan tim ops fraud untuk pengoperasian Fraud Graph Intelligence dan penanganan tiket investigasi." },
            { t: "Compliance Readiness", d: "Konsultasi kepatuhan teknis untuk memenuhi asesmen TIKMI Bank Indonesia & standar PBI." }
          ].map((s) => (
            <div key={s.t} className="bg-card p-5">
              <div className="text-sm font-semibold text-foreground">{s.t}</div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
