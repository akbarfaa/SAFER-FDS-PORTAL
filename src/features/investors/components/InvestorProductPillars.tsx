import { Database, Layers, Building2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function InvestorProductPillars() {
  const { language } = useTranslation();
  const isEn = language === "en";

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {isEn ? "Product Architecture & V3 Tech Superiority" : "Arsitektur Produk & Keunggulan Teknologi V3"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isEn ? "3 Core Pillars Verified Live on Tencent Cloud VPS Production" : "3 Pilar Utama FDS SAFER yang Diuji Faktual di VPS Produksi"}
          </p>
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
  );
}
