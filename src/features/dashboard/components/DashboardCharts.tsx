/**
 * Dashboard Feature — Analytics Charts Component (Recharts)
 */
import { useMemo } from "react";
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

interface DashboardChartsProps {
  stats: any;
  t: (key: string) => string;
}

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--foreground)",
};

export function DashboardCharts({ stats, t }: DashboardChartsProps) {
  const riskMix = useMemo(() => [
    { name: "Low", value: stats.bySeverity.low, color: "var(--success)" },
    { name: "Medium", value: stats.bySeverity.medium, color: "var(--warning)" },
    { name: "High", value: stats.bySeverity.high, color: "var(--destructive)" },
    { name: "Critical", value: stats.bySeverity.critical, color: "var(--critical)" },
  ], [stats.bySeverity]);

  const railData = useMemo(() =>
    Object.entries(stats.byRail)
      .map(([rail, value]) => ({ rail, value }))
      .sort((a, b) => (b.value as number) - (a.value as number))
  , [stats.byRail]);

  if (stats.total === 0) return null;

  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-3">
      <div className="rounded-lg border border-border bg-card card-enter" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <div className="text-sm font-semibold">{t('dashboard.chart.riskDist')}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{t('dashboard.chart.riskDistSub')}</div>
          </div>
        </div>
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
      </div>

      <div className="xl:col-span-2 rounded-lg border border-border bg-card card-enter" style={{ animationDelay: "0.25s" }}>
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <div className="text-sm font-semibold">{t('dashboard.chart.railDist')}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{t('dashboard.chart.railDistSub')}</div>
          </div>
        </div>
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
      </div>
    </div>
  );
}
