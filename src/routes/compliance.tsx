import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { Lock, ShieldCheck, FileText, KeyRound, EyeOff, Users, GitBranch, Server } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export const Route = createFileRoute("/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance, Security & UU PDP Governance · SAFER" },
      {
        name: "description",
        content:
          "Compliance-by-design controls aligned with Indonesia's UU PDP Nomor 27 Tahun 2022, OJK POJK 11 IT risk requirements, and Bank Indonesia anti-fraud directives. Featuring PII anonymization, mTLS, and encrypted audit trails.",
      },
      {
        name: "keywords",
        content:
          "kepatuhan uu pdp, pojk 11 ojk, pelindungan data pribadi perbankan, enkripsi data perbankan, anti-fraud reporting bank indonesia, mtls api security, data residency indonesia",
      },
    ],
  }),
  component: CompliancePage,
});

function CompliancePage() {
  const { language } = useTranslation();
  const isEn = language === "en";

  const CONTROLS = [
    { 
      icon: Lock, 
      t: isEn ? "SHA-256 PII Hashing & AES-256" : "Enkripsi AES-256 & SHA-256 Hashing PII", 
      d: isEn ? "Identifiable information hashed before reaching AI scoring engine; data at rest encrypted." : "Informasi identitas di-hash SHA-256 sebelum diproses AI; data tersimpan dienkripsi AES-256." 
    },
    { 
      icon: KeyRound, 
      t: isEn ? "Role-based access (RBAC)" : "Akses Berbasis Peran (RBAC)", 
      d: isEn ? "Granular roles for analyst, supervisor, auditor and admin with separation of duties." : "Akses bertingkat untuk analis, supervisor, auditor, dan admin dengan pemisahan wewenang." 
    },
    { 
      icon: FileText, 
      t: isEn ? "Immutable audit logs" : "Jejak Audit Tak Terkoyak (Immutable)", 
      d: isEn ? "Tamper-evident logging of every model decision and analyst action for PPATK/BI audit." : "Pencatatan setiap keputusan model & aksi analis yang siap diaudit PPATK & Bank Indonesia." 
    },
    { 
      icon: EyeOff, 
      t: isEn ? "Offline Backtesting Anonymization" : "Anonimisasi Offline Backtesting POC", 
      d: isEn ? "Historical client test data must be PII-masked before evaluation pipelines run." : "Data uji historis mitra wajib di-anonimkan (PII Masked) sebelum dievaluasi." 
    },
    { 
      icon: Server, 
      t: isEn ? "B2B API Authentication" : "Autentikasi API B2B (X-Client)", 
      d: isEn ? "Secure B2B authentication via X-Client-ID & X-Client-Secret headers with rate limiting." : "Autentikasi B2B aman menggunakan header X-Client-ID & X-Client-Secret." 
    },
    { 
      icon: Users, 
      t: isEn ? "Human-in-the-Loop Governance" : "Tata Kelola Human-in-the-Loop", 
      d: isEn ? "AI acts as CoPilot; final execution authority remains with financial institution analysts." : "AI berfungsi sebagai CoPilot; wewenang keputusan akhir di tangan analis institusi." 
    },
    { 
      icon: GitBranch, 
      t: isEn ? "Compliance-by-design" : "Kepatuhan Berbasis Desain (UU PDP)", 
      d: isEn ? "Built natively for UU PDP No. 27/2022, PBI No. 10/2025 and OJK POJK 11 directives." : "Dirancang selaras dengan UU PDP No. 27/2022, PBI No. 10/2025, dan OJK POJK 11." 
    },
    { 
      icon: ShieldCheck, 
      t: isEn ? "Incident Response Runbooks" : "Manajemen Insiden & Tanggap Darurat", 
      d: isEn ? "Documented runbooks with regulator-ready incident packets generated under 4 hours." : "Prosedur tanggap darurat terdokumentasi dengan laporan insiden siap kirim ke regulator." 
    },
  ];

  const MATURITY = [
    { area: isEn ? "Data Protection (UU PDP No. 27/2022)" : "Perlindungan Data Pribadi (UU PDP)", level: 96 },
    { area: isEn ? "Bank Indonesia PBI No. 10/2025" : "Kepatuhan FDS Bank Indonesia (PBI 10/2025)", level: 94 },
    { area: isEn ? "OJK POJK 11 IT Risk Management" : "Manajemen Risiko TI (OJK POJK 11)", level: 90 },
    { area: isEn ? "ISO 27001 Security Controls" : "Kontrol Keamanan ISO 27001", level: 92 },
    { area: isEn ? "Explainable AI (SHAP) Governance" : "Tata Kelola Model Explainable AI (SHAP)", level: 95 },
  ];

  return (
    <AppShell 
      title={isEn ? "Compliance & Governance Center" : "Pusat Kepatuhan & Tata Kelola Reguler"} 
      subtitle={isEn ? "Governance · audit readiness · security controls" : "Tata kelola · kesiapan audit BI & PPATK · kontrol keamanan"}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { 
            t: isEn ? "Active Security Controls" : "Kontrol Keamanan Aktif", 
            v: "47", 
            d: isEn ? "across 8 control families" : "tersebar di 8 rumpun kontrol" 
          },
          { 
            t: isEn ? "Data Residency & Hashing" : "Status Kedaulatan & Hashing Data", 
            v: "SHA-256", 
            d: isEn ? "PII masked before AI pipeline" : "PII di-hash sebelum masuk engine AI" 
          },
          { 
            t: isEn ? "Audit Reporting SLA" : "SLA Laporan Audit Regulator", 
            v: "< 4 Jam", 
            d: isEn ? "regulator-ready incident packets" : "paket data siap kirim ke BI/PPATK" 
          },
        ].map((k) => (
          <div key={k.t} className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">{k.t}</div>
            <div className="num mt-1 text-2xl font-bold text-foreground">{k.v}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{k.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4 text-sm font-semibold">
            {isEn ? "Operational Security & Compliance Controls" : "Kontrol Operasional Keamanan & Kepatuhan"}
          </div>
          <div className="grid gap-px bg-border md:grid-cols-2">
            {CONTROLS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.t} className="bg-card p-5">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-sm font-semibold">{c.t}</div>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.d}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4 text-sm font-semibold">
            {isEn ? "Regulatory Readiness Maturity" : "Tingkat Kematangan Kepatuhan Regulasi"}
          </div>
          <div className="space-y-4 p-5">
            {MATURITY.map((m) => (
              <div key={m.area}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{m.area}</span>
                  <span className="num text-muted-foreground font-mono">{m.level}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${m.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Indonesian Regulatory Alignment Box ─── */}
      <div className="mt-4 rounded-lg border border-border bg-card p-6 space-y-3">
        <div className="text-sm font-semibold text-foreground">
          {isEn ? "Indonesian Banking & Regulator Alignment" : "Kesesuaian dengan Regulasi Perbankan Indonesia"}
        </div>
        <div className="grid gap-4 md:grid-cols-3 text-xs md:text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">{isEn ? "UU PDP No. 27/2022:" : "UU PDP No. 27/2022:"}</span> {isEn 
              ? "Strict PII data minimization & hashing SHA-256 before AI processing ensures zero PII leaks." 
              : "Prinsip minimisasi data PII dan pengacakan SHA-256 sebelum diproses engine AI menjamin kedaulatan data nasabah."}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">{isEn ? "PBI No. 10/2025:" : "PBI No. 10/2025:"}</span> {isEn 
              ? "Mandatory FDS integration for PJP payment switches with real-time scoring under 50ms." 
              : "Kewajiban FDS terintegrasi bagi PJP dengan kecepatan inferensi real-time di bawah 50ms."}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">{isEn ? "FATF & PPATK Reporting:" : "Standar FATF & PPATK:"}</span> {isEn 
              ? "SHAP Explainable AI rationale provides clear evidence trail for suspicious transaction reporting." 
              : "Penjelasan SHAP Explainable AI menyediakan jejak audit jelas untuk penyusunan Lapor Transaksi Keuangan Mencurigakan (LTKM)."}
          </p>
        </div>
      </div>
    </AppShell>
  );
}
