import { ShieldCheck, TrendingUp, Building2, DollarSign } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function InvestorStats() {
  const { language } = useTranslation();
  const isEn = language === "en";

  const STATS = [
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
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {STATS.map((stat, i) => {
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
  );
}
