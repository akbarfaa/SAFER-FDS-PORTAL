import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { formatIDR, severityStyles } from "@/lib/safer-data";
import { useEffect, useState, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  AlertTriangle,
  ShieldCheck,
  Eye,
  Activity,
  Play,
  Pause,
  Zap,
  Target,
  Filter,
} from "lucide-react";
import {
  useTransactions,
  useTransactionActions,
  AUDIT_STATUS_META,
  type AuditStatus,
  type Transaction,
} from "@/lib/transaction-store";
import { TransactionDetail } from "@/components/safer/TransactionDetail";
import { AuditStatusBadge } from "@/components/safer/AuditStatusBadge";
import type { PaymentRail } from "@/lib/transaction-engine";
import type { Severity } from "@/lib/safer-data";
import { useTranslation } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Monitoring · SAFER" },
      { name: "description", content: "Real-time fraud monitoring dashboard for Indonesian financial institutions." },
    ],
  }),
  component: DashboardPage,
});

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--foreground)",
};

function DashboardPage() {
  const { t } = useTranslation();
  const txs = useTransactions();
  const actions = useTransactionActions();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isAutoOn, setIsAutoOn] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [railFilter, setRailFilter] = useState<PaymentRail | "all">("all");
  const [auditFilter, setAuditFilter] = useState<AuditStatus | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Toggle auto-generate
  const toggleAuto = () => {
    if (isAutoOn) {
      actions.stopAutoGenerate();
    } else {
      actions.startAutoGenerate();
    }
    setIsAutoOn(!isAutoOn);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => { actions.stopAutoGenerate(); };
  }, [actions]);

  // Filtered transactions
  const filtered = useMemo(() => {
    return txs.filter(tx => {
      if (severityFilter !== "all" && tx.scoring.severity !== severityFilter) return false;
      if (railFilter !== "all" && tx.raw.rail !== railFilter) return false;
      if (auditFilter !== "all" && tx.auditStatus !== auditFilter) return false;
      return true;
    });
  }, [txs, severityFilter, railFilter, auditFilter]);

  // Live stats
  const stats = actions.stats;

  // Chart data from live transactions
  const riskMix = useMemo(() => [
    { name: "Low", value: stats.bySeverity.low, color: "var(--success)" },
    { name: "Medium", value: stats.bySeverity.medium, color: "var(--warning)" },
    { name: "High", value: stats.bySeverity.high, color: "var(--destructive)" },
    { name: "Critical", value: stats.bySeverity.critical, color: "var(--critical)" },
  ], [stats.bySeverity]);

  const railData = useMemo(() =>
    Object.entries(stats.byRail)
      .map(([rail, value]) => ({ rail, value }))
      .sort((a, b) => b.value - a.value)
  , [stats.byRail]);

  // Keep selected tx in sync with store updates
  useEffect(() => {
    if (selectedTx) {
      const updated = txs.find(t => t.raw.id === selectedTx.raw.id);
      if (updated) setSelectedTx(updated);
    }
  }, [txs, selectedTx]);

  return (
    <AppShell title="Fraud Monitoring" subtitle="Live · jakarta-1 cluster">
      {/* ── Control Bar ─────────────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={toggleAuto}
          className={`inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors ${
            isAutoOn
              ? "bg-success text-white hover:bg-success/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isAutoOn ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {isAutoOn ? t('dashboard.btn.pauseStream') : t('dashboard.btn.startStream')}
        </button>
        <button
          onClick={() => actions.generateBatch()}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-4 text-sm transition-colors hover:bg-accent"
        >
          <Zap className="h-3.5 w-3.5 text-warning" /> {t('dashboard.btn.genBatch')}
        </button>
        <button
          onClick={() => actions.generateBatch(1, true)}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-destructive/30 bg-card px-4 text-sm text-destructive transition-colors hover:bg-destructive/10"
        >
          <Target className="h-3.5 w-3.5" /> {t('dashboard.btn.scenario')}
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs transition-colors ${
              showFilters ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"
            }`}
          >
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
          {isAutoOn && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> Streaming
            </div>
          )}
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────────── */}
      {showFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3">
          <div>
            <label className="mb-1 block text-[10px] font-medium text-muted-foreground uppercase">{t('dashboard.filter.severity')}</label>
            <div className="flex gap-1">
              {(["all", "low", "medium", "high", "critical"] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`rounded px-2 py-1 text-[11px] transition-colors ${
                    severityFilter === sev
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-accent"
                  }`}
                >
                  {sev === "all" ? "All" : sev.charAt(0).toUpperCase() + sev.slice(1)}
                  {sev !== "all" && <span className="ml-1 num">{stats.bySeverity[sev]}</span>}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium text-muted-foreground uppercase">{t('dashboard.filter.rail')}</label>
            <select
              value={railFilter}
              onChange={(e) => setRailFilter(e.target.value as PaymentRail | "all")}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value="all">{t('dashboard.filter.all')}</option>
              {["QRIS", "BI-FAST", "RTGS", "SKN", "E-Wallet", "Virtual Account", "Kartu Debit", "Kartu Kredit", "Transfer"].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium text-muted-foreground uppercase">{t('dashboard.filter.auditStatus')}</label>
            <select
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value as AuditStatus | "all")}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value="all">{t('dashboard.filter.all')}</option>
              {Object.entries(AUDIT_STATUS_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>
          {(severityFilter !== "all" || railFilter !== "all" || auditFilter !== "all") && (
            <button
              onClick={() => { setSeverityFilter("all"); setRailFilter("all"); setAuditFilter("all"); }}
              className="ml-auto text-xs text-primary hover:underline"
            >
              {t('dashboard.filter.clear')}
            </button>
          )}
        </div>
      )}

      {/* ── KPI Cards ───────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={Activity} label={t('dashboard.kpi.total')} value={stats.total.toLocaleString()} delta={`${stats.byRail["QRIS"] || 0} QRIS · ${stats.byRail["BI-FAST"] || 0} BI-FAST`} tone="text-success" delay="0s" />
        <Kpi icon={AlertTriangle} label={t('dashboard.kpi.flagged')} value={stats.flaggedCount.toLocaleString()} delta={`${((stats.flaggedCount / Math.max(1, stats.total)) * 100).toFixed(1)}% rate`} tone="text-warning" delay="0.05s" />
        <Kpi icon={ShieldCheck} label={t('dashboard.kpi.blocked')} value={formatIDR(stats.bySeverity.critical > 0 ? txs.filter(t => t.scoring.severity === "critical").reduce((s, t) => s + t.raw.amount, 0) : 0)} delta="auto-blocked" tone="text-primary" delay="0.1s" />
        <Kpi icon={Eye} label={t('dashboard.kpi.pending')} value={stats.pendingReview.toLocaleString()} delta={`${stats.byAudit.escalated} escalated`} tone="text-success" delay="0.15s" />
      </div>

      {/* ── Charts Row ──────────────────────────────────────────────── */}
      {stats.total > 0 && (
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <Card className="card-enter" style={{ animationDelay: "0.2s" }}>
            <CardHeader title={t('dashboard.chart.riskDist')} subtitle={t('dashboard.chart.riskDistSub')} />
            <div className="h-64 px-2 pb-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskMix} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {riskMix.map((e, i) => (
                      <Cell key={i} fill={e.color} stroke="var(--card)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="xl:col-span-2 card-enter" style={{ animationDelay: "0.25s" }}>
            <CardHeader title={t('dashboard.chart.railDist')} subtitle={t('dashboard.chart.railDistSub')} />
            <div className="h-64 px-2 pb-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={railData} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="rail" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--accent)" }} />
                  <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* ── Empty State ─────────────────────────────────────────────── */}
      {stats.total === 0 && (
        <div className="mt-8 grid place-items-center rounded-xl border border-dashed border-border bg-card p-16 text-center">
          <div>
            <Activity className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <div className="mt-4 text-lg font-semibold">{t('dashboard.empty.title')}</div>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground" dangerouslySetInnerHTML={{__html: t('dashboard.empty.desc')}} />
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={toggleAuto}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Play className="h-4 w-4" /> {t('dashboard.btn.startStream')}
              </button>
              <button
                onClick={() => actions.generateBatch(5)}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-5 text-sm hover:bg-accent"
              >
                <Zap className="h-4 w-4" /> {t('dashboard.btn.genBatch')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Live Transaction Table ──────────────────────────────────── */}
      {filtered.length > 0 && (
        <Card className="mt-4 card-enter" style={{ animationDelay: "0.3s" }}>
          <CardHeader
            title={`Live Transaction Stream`}
            subtitle={`${filtered.length} of ${stats.total} transactions${severityFilter !== "all" || railFilter !== "all" || auditFilter !== "all" ? " (filtered)" : ""}`}
            action={
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/audit";
                  link.click();
                }}
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                Open audit queue <ArrowUpRight className="h-3 w-3" />
              </button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-y border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">{t('dashboard.col.time')}</th>
                  <th className="px-4 py-2.5 text-left font-medium">{t('dashboard.col.txId')}</th>
                  <th className="px-4 py-2.5 text-left font-medium">{t('dashboard.col.sender')}</th>
                  <th className="px-4 py-2.5 text-left font-medium">{t('dashboard.col.receiver')}</th>
                  <th className="px-4 py-2.5 text-left font-medium">Rail</th>
                  <th className="px-4 py-2.5 text-left font-medium">City</th>
                  <th className="px-4 py-2.5 text-right font-medium">{t('dashboard.col.amount')}</th>
                  <th className="px-4 py-2.5 text-right font-medium">Score</th>
                  <th className="px-4 py-2.5 text-right font-medium">{t('dashboard.col.severity')}</th>
                  <th className="px-4 py-2.5 text-right font-medium">{t('dashboard.col.audit')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 50).map((t, i) => {
                  const sv = severityStyles[t.scoring.severity];
                  const auditMeta = AUDIT_STATUS_META[t.auditStatus];
                  return (
                    <tr
                      key={t.raw.id}
                      onClick={() => setSelectedTx(t)}
                      className={`border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-primary/5 ${i < 3 && txs[0]?.raw.id === filtered[0]?.raw.id ? "animate-in fade-in slide-in-from-top-2 duration-500" : ""}`}
                      style={i < 3 ? { animationDelay: `${i * 100}ms` } : undefined}
                    >
                      <td className="px-4 py-2.5 text-xs text-muted-foreground num whitespace-nowrap">
                        {t.raw.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs">{t.raw.id}</td>
                      <td className="px-4 py-2.5 max-w-[140px] truncate">{t.raw.senderName}</td>
                      <td className="px-4 py-2.5 text-muted-foreground max-w-[140px] truncate">{t.raw.merchant}</td>
                      <td className="px-4 py-2.5"><span className="rounded bg-accent px-1.5 py-0.5 text-[10px]">{t.raw.rail}</span></td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">{t.raw.senderCity}</td>
                      <td className="px-4 py-2.5 text-right num whitespace-nowrap">{formatIDR(t.raw.amount)}</td>
                      <td className="px-4 py-2.5 text-right num font-medium">{t.scoring.score}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${sv.bg} ${sv.text}`}>{sv.label}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex justify-end">
                          <AuditStatusBadge status={t.auditStatus} showIconOnly />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length > 50 && (
              <div className="border-t border-border px-4 py-2.5 text-center text-xs text-muted-foreground">
                Showing 50 of {filtered.length} transactions. Use filters to narrow down.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ── Transaction Detail Drawer ───────────────────────────────── */}
      {selectedTx && (
        <TransactionDetail
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </AppShell>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  delta,
  tone,
  delay = "0s",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  tone: string;
  delay?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 card-enter" style={{ animationDelay: delay }}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <Icon className={`h-4 w-4 ${tone}`} />
      </div>
      <div className="num mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{delta}</div>
    </div>
  );
}

function Card({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`rounded-lg border border-border bg-card ${className}`} style={style}>{children}</div>;
}

function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
      <div>
        <div className="text-sm font-semibold">{title}</div>
        {subtitle && <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}
