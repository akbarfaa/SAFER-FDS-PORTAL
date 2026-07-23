import { Activity, Zap } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function InvestorProblemSolution() {
  const { language } = useTranslation();
  const isEn = language === "en";

  return (
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
            <span>
              <b>High False Positive Rate (70-80%):</b>{" "}
              {isEn ? "Operations teams are overwhelmed by false alarms, draining investigation resources." : "Tim analis tenggelam dalam alarm palsu yang menguras waktu dan sumber daya operasional."}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
            <span>
              <b>Mule Ring & Gambling Laundering Blindness:</b>{" "}
              {isEn ? "Single-transaction analysis cannot uncover cross-account money laundering networks." : "Analisis per transaksi individual tidak dapat mendeteksi pencucian uang berantai lintas akun."}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
            <span>
              <b>Global Vendor Black-Box AI:</b>{" "}
              {isEn ? "Costly offshore systems fail to provide audit reasoning matching Indonesian banking SOPs." : "Sistem luar negeri mahal dan tidak dapat menjelaskan alasan audit dalam terminologi regulasi Indonesia."}
            </span>
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
          <b>Mandated Demand:</b>{" "}
          {isEn
            ? "PJPs must upgrade FDS or face regulatory sanctions. SAFER provides the fastest, most cost-effective local AI entry point."
            : "PJP tidak punya pilihan selain memperkuat FDS mereka. SAFER memberikan opsi tercepat, termurah, dan paling adaptif terhadap ekosistem lokal."}
        </div>
      </div>
    </div>
  );
}
