import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { Building2, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "Business Model & Ecosystem Pricing · SAFER" },
      { name: "description", content: "Go-to-market roadmap, B2B SaaS tiering pricing, and ecosystem strategy for SAFER fraud intelligence." },
    ],
  }),
  component: BusinessPage,
});

function BusinessPage() {
  const { language } = useTranslation();
  const isEn = language === "en";

  const PHASES = [
    {
      phase: isEn ? "Phase 1" : "Fase 1",
      icon: Zap,
      who: isEn ? "Fintech & E-Wallet" : "Fintech & E-Wallet",
      items: isEn 
        ? ["Tier-2 fintechs", "Payment gateway providers", "Digital lending platforms", "E-wallet services"]
        : ["Fintech rintisan & menengah", "Penyedia payment gateway", "Platform pinjaman digital", "Layanan e-wallet"],
      model: isEn ? "B2B SaaS Freemium · 3-Month Shadow Mode" : "B2B SaaS Freemium · Shadow Mode 3 Bulan",
    },
    {
      phase: isEn ? "Phase 2" : "Fase 2",
      icon: Building2,
      who: isEn ? "Regional Banks & BPR" : "Bank Regional & BPR",
      items: isEn 
        ? ["Regional development banks", "Digital BPR institutions", "Payment processors", "Full investigation suite"]
        : ["Bank Pembangunan Daerah", "BPR Digital & Syariah", "Processor pembayaran", "Modul investigasi & XAI penuh"],
      model: isEn ? "Tier Business · Rp 15 M / month ($1,000)" : "Tier Business · Rp 15 Juta / bulan",
    },
    {
      phase: isEn ? "Phase 3" : "Fase 3",
      icon: ShieldCheck,
      who: isEn ? "Enterprise Banks & Regulators" : "Bank Enterprise & Regulator",
      items: isEn 
        ? ["Tier-1 enterprise banks", "On-premise / private cloud", "Regulator data alliances", "Consortium intel sharing"]
        : ["Bank Umum BUKU 3 & 4", "Deployment On-Premise / Private Cloud", "Kolaborasi regulasi BI & PPATK", "Berbagi intelijen konsorsium"],
      model: isEn ? "Tier Enterprise · Rp 50 M / month ($3,300)" : "Tier Enterprise · Rp 50 Juta / bulan",
    },
  ];

  const PLANS = [
    {
      name: "Tier Starter",
      price: isEn ? "Rp 5 M / mo" : "Rp 5 Juta / bln",
      desc: isEn ? "For early-stage fintechs & emerging payment platforms." : "Untuk fintech rintisan & startup pembayaran yang sedang tumbuh.",
      features: isEn
        ? [
            "Up to 500,000 transactions / month",
            "Shared SaaS Cloud Deployment",
            "ML Risk Scoring V3 Engine",
            "Explainable AI (SHAP) audit reasoning",
            "Standard REST API Support (SLA 99.5%)",
          ]
        : [
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
      price: isEn ? "Rp 15 M / mo" : "Rp 15 Juta / bln",
      desc: isEn ? "For mid-tier e-wallets & payment switches (Most Popular)." : "Untuk e-wallet & payment gateway menengah (Paling Populer).",
      features: isEn
        ? [
            "Up to 5,000,000 transactions / month",
            "Full Monitoring Dashboard & Audit Queue",
            "Fraud Graph Intelligence (5-Tier Topology)",
            "Priority SLA 99.9% Support",
            "Offline Backtesting POC & Shadow Mode",
          ]
        : [
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
      price: isEn ? "Rp 50 M / mo" : "Rp 50 Juta / bln",
      desc: isEn ? "For Tier-1 enterprise banks & large financial institutions." : "Untuk Bank Umum BUKU 3/4 & lembaga keuangan berskala besar.",
      features: isEn
        ? [
            "Custom unlimited transaction throughput",
            "On-Premise or Private Cloud Enclave",
            "Custom ML Model Fine-Tuning & Pipeline",
            "Dedicated 24/7 SRE Support (SLA 99.95%)",
            "Custom Neo4j Graph Database Integration",
          ]
        : [
            "Volume transaksi kustom tak terbatas",
            "On-Premise / Private Cloud Enclave",
            "Custom ML Model Fine-Tuning & Pipeline",
            "Dedicated 24/7 SRE Support (SLA 99.95%)",
            "Custom Neo4j Graph Database Integration",
          ],
      highlight: false,
    },
  ];

  return (
    <AppShell 
      title={isEn ? "Business Model & Ecosystem" : "Business Model & Ekosistem"} 
      subtitle={isEn ? "Go-to-market roadmap · B2B SaaS pricing tiers · Unit economics" : "Skema harga B2B SaaS · Roadmap adopsi pasar · Unit economics"}
    >
      
      {/* ─── Market Metrics ─── */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { 
            t: isEn ? "OJK Digital Scam Losses" : "Total Kerugian Scam Digital OJK", 
            v: "Rp 7.3 Trillion", 
            d: isEn ? "311,597 reported cases in Indonesia" : "311.597 kasus terlaporkan di Indonesia" 
          },
          { 
            t: isEn ? "Client ROI (Tier Business)" : "Estimasi ROI Klien (Tier Business)", 
            v: "> 1,000% ROI", 
            d: isEn ? "Benefit Rp 3.12B/yr vs Cost Rp 280M/yr" : "Benefit Rp 3.12B/thn vs Cost Rp 280M/thn" 
          },
          { 
            t: isEn ? "Operational Break-Even (BEP)" : "Impas Operasional (BEP)", 
            v: "2 Business + 1 Enterprise", 
            d: isEn ? "Active clients to cover fixed costs" : "Klien aktif impas fixed cost" 
          },
        ].map((c) => (
          <div key={c.t} className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">{c.t}</div>
            <div className="num mt-1 text-2xl font-bold text-foreground">{c.v}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{c.d}</div>
          </div>
        ))}
      </div>

      {/* ─── Roadmap Expansion (PHASES) ─── */}
      <div className="mt-4 rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4 text-sm font-semibold">
          {isEn ? "Market Expansion Roadmap (Phases)" : "Strategi Penetrasi Pasar & Roadmap Adopsi (Fase)"}
        </div>
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

      {/* ─── Official Pricing Plans (PLANS) ─── */}
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
                    {isEn ? "Most Popular" : "Paling Populer"}
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

      {/* ─── On-Premise Setup Fee Banner ─── */}
      <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
            <ShieldCheck className="h-4 w-4" /> {isEn ? "On-Premise Setup Fee: Rp 100 Million ($6,600 One-Time)" : "On-Premise Setup Fee: Rp 100 Juta (Satu Kali)"}
          </div>
          <p className="text-xs text-emerald-200/80">
            {isEn 
              ? "For enterprise banks & large financial institutions requiring air-gapped deployments or private cloud enclaves for UU PDP data sovereignty. Includes installation, custom ML pipelines, and analyst team training."
              : "Khusus institusi perbankan & e-wallet skala besar yang membutuhkan air-gapped deployment atau private cloud enclave untuk kepatuhan UU PDP & kedaulatan data. Termasuk instalasi, kustomisasi pipeline ML, dan pelatihan tim analis."}
          </p>
        </div>
      </div>

      {/* ─── Competitive Moat ─── */}
      <div className="mt-4 rounded-lg border border-border bg-card p-6">
        <div className="text-sm font-semibold">{isEn ? "Competitive Moat & Local Differentiation" : "Keunggulan Berkompetisi (Competitive Moat)"}</div>
        <div className="mt-3 grid gap-4 md:grid-cols-3 text-xs md:text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">{isEn ? "Audit-Ready Transparency." : "Transparansi Keputusan (Non Black-Box)."}</span> {isEn 
              ? "Global vendors operate as black boxes. SAFER reveals exact risk factors via SHAP XAI in localized Indonesian banking SOP terminology."
              : "Vendor global hanya memberi skor angka. SAFER membongkar faktor risiko dengan SHAP XAI dalam terminologi SOP perbankan lokal yang audit-ready untuk BI & PPATK."}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">{isEn ? "Indonesian Fraud Typology." : "Kontekstualisasi Fraud Indonesia."}</span> {isEn
              ? "Trained specifically for local fraud patterns — BI-FAST smurfing, e-wallet mule rings, slot cashout rings, and device farms."
              : "Dilatih khusus untuk pola fraud lokal — smurfing BI-FAST, mule ring e-wallet, slot cashout ring, dan device farm — yang tidak dimiliki vendor generik barat."}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">{isEn ? "Secure Offline Retraining." : "Retraining Offline Aman."}</span> {isEn
              ? "Model retraining runs offline in isolated environments to protect AI scoring engines against data poisoning attacks."
              : "Pembaruan model berjalan offline pada lingkungan terisolasi untuk melindungi engine dari serangan data poisoning."}
          </p>
        </div>
      </div>

      {/* ─── Professional Services ─── */}
      <div className="mt-4 rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4 text-sm font-semibold">{isEn ? "Professional Services & Advisory" : "Layanan Profesional & Konsultasi Integrasi"}</div>
        <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              t: isEn ? "Custom ML Models" : "Custom ML Models", 
              d: isEn ? "Tailored behavioral models trained on your specific historical fraud patterns." : "Model perilaku kustom yang dilatih pada histori pola fraud spesifik institusi Anda." 
            },
            { 
              t: isEn ? "Integration Engineering" : "Integration Engineering", 
              d: isEn ? "Dedicated engineers ensuring seamless API integration with your core banking." : "Tim dedicated engineer untuk menjamin kelancaran integrasi API ke core banking / payment switch." 
            },
            { 
              t: isEn ? "Analyst Training" : "Analyst Training", 
              d: isEn ? "On-site or remote workshops training your fraud ops team on graph intelligence." : "Pelatihan tim ops fraud untuk pengoperasian Fraud Graph Intelligence dan penanganan tiket investigasi." 
            },
            { 
              t: isEn ? "Compliance Readiness" : "Compliance Readiness", 
              d: isEn ? "Regulatory consulting for Bank Indonesia PBI 10/2025 and TIKMI assessment." : "Konsultasi kepatuhan teknis untuk memenuhi asesmen TIKMI Bank Indonesia & standar PBI." 
            }
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
