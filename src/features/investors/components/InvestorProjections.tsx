import { HelpCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function InvestorProjections() {
  const { language } = useTranslation();
  const isEn = language === "en";

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {isEn ? "Unit Economics & Financial Projections" : "Unit Economics & Proyeksi Keuangan"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isEn ? "Detailed Breakdown for Client ROI, Operational BEP, & Investor ROI" : "Proyeksi Rinci Klien ROI, Break-Even Point, & Startup Investor ROI"}
          </p>
        </div>
        <span className="self-start md:self-auto rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 font-semibold">
          B2B SaaS Pricing Tiering
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Client ROI Card */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-3">
          <div className="text-xs font-semibold text-primary uppercase tracking-wider">
            {isEn ? "Client ROI (Tier Business)" : "Proyeksi ROI Klien (Tier Business)"}
          </div>
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
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            {isEn ? "Operational Break-Even Point" : "Break-Even Point (BEP) Operasional"}
          </div>
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
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            {isEn ? "Investor ROI (Post-Shadow Mode)" : "Proyeksi ROI Investor (Pasca-Shadow)"}
          </div>
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

      {/* Disclaimer Box (Uses Theme Tokens) */}
      <div className="rounded-xl border border-border bg-card p-5 text-xs text-foreground space-y-1.5 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />{" "}
          {isEn ? "Financial Disclaimer & Projections Note:" : "Disclaimer Finansial & Proyeksi:"}
        </div>
        <p className="leading-relaxed text-xs text-muted-foreground">
          {isEn
            ? "All figures above are preliminary estimates and will be definitively recalculated after all fixed costs, variable costs, and initial contingency costs are finalized together with strategic investment partners."
            : "Seluruh angka di atas merupakan proyeksi estimasi awal berdasarkan benchmark pasar dan akan dihitung kembali secara definitif setelah struktur biaya tetap (fixed cost), biaya variabel (variable cost), serta alokasi dana tidak terduga (contingency cost) pada awal fase implementasi ditetapkan secara final bersama mitra investor."}
        </p>
      </div>
    </div>
  );
}
