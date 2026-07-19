/**
 * Network Graph — Sidebar Component
 * Right panel: scenario selector, entity detail panel, and cluster insights.
 */
import { ExternalLink, Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { GraphNode, GraphEdge, GraphScenario } from "../types";
import { NODE_STYLE, RISK_RING } from "../types";
import type { Transaction } from "@/lib/transaction-store";

interface GraphSidebarProps {
  scenarios: GraphScenario[];
  activeScenarioIdx: number;
  selected: GraphNode | null;
  dynamicEdges: GraphEdge[];
  dynamicInsights: string[];
  isInvestigated: boolean;
  isFullscreen: boolean;
  scenarioTxIds: string[];
  allTxs: Transaction[];
  onSelectScenario: (idx: number) => void;
  onInvestigate: () => void;
  onShowToast: (msg: string, type: "success" | "warning") => void;
}

export function GraphSidebar({
  scenarios, activeScenarioIdx, selected, dynamicEdges, dynamicInsights,
  isInvestigated, isFullscreen, scenarioTxIds, allTxs,
  onSelectScenario, onInvestigate, onShowToast,
}: GraphSidebarProps) {
  const { t } = useTranslation();

  return (
    <div className={`space-y-4 ${
      isFullscreen
        ? "w-[340px] shrink-0 h-full overflow-y-auto bg-card border border-border rounded-lg p-5 custom-scrollbar"
        : ""
    }`}>
      {/* Scenario Selector */}
      <ScenarioSelector
        scenarios={scenarios}
        activeIdx={activeScenarioIdx}
        allTxs={allTxs}
        dynamicEdges={dynamicEdges}
        onSelect={onSelectScenario}
        t={t}
      />

      {/* Entity Detail */}
      <EntityDetail
        selected={selected}
        dynamicEdges={dynamicEdges}
        isInvestigated={isInvestigated}
        scenarioTxIds={scenarioTxIds}
        onInvestigate={onInvestigate}
        onShowToast={onShowToast}
        t={t}
      />

      {/* Cluster Insights */}
      <InsightsList insights={dynamicInsights} />
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function ScenarioSelector({ scenarios, activeIdx, allTxs, dynamicEdges, onSelect, t }: {
  scenarios: GraphScenario[];
  activeIdx: number;
  allTxs: Transaction[];
  dynamicEdges: GraphEdge[];
  onSelect: (i: number) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-surface">
        {t('network.scenarios')}
      </div>
      <div className="p-3 space-y-2">
        {scenarios.map((sc, i) => {
          const scTxIds = sc.id === "live-fds"
            ? dynamicEdges.filter(e => e.id).map(e => e.id!)
            : sc.edges.map((_, idx) => `TX-GRAPH-${sc.id}-${idx}`);
          const scRelatedTxs = allTxs.filter(t => scTxIds.includes(t.raw.id));
          const isScInvestigated = scRelatedTxs.length > 0 && scRelatedTxs.every(t => t.auditStatus === "under_investigation" || t.auditStatus === "blocked");

          return (
            <button
              key={sc.id}
              onClick={() => onSelect(i)}
              className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex flex-col gap-1 active:scale-[0.98] ${
                activeIdx === i
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border hover:bg-accent/60 text-muted-foreground"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-foreground">{sc.name}</span>
                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase ${
                  isScInvestigated
                    ? "bg-warning/20 text-warning"
                    : sc.severity === "critical"
                      ? "bg-critical/20 text-critical"
                      : "bg-destructive/20 text-destructive"
                }`}>
                  {isScInvestigated ? t('network.status.investigating') : sc.severity}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                {sc.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EntityDetail({ selected, dynamicEdges, isInvestigated, scenarioTxIds, onInvestigate, onShowToast, t }: {
  selected: GraphNode | null;
  dynamicEdges: GraphEdge[];
  isInvestigated: boolean;
  scenarioTxIds: string[];
  onInvestigate: () => void;
  onShowToast: (msg: string, type: "success" | "warning") => void;
  t: (key: string) => string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-surface">
        Detail Entitas Terpilih
      </div>
      {selected ? (
        <div className="space-y-3.5 p-5 text-xs">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg text-white font-black" style={{ backgroundColor: NODE_STYLE[selected.type].fill }}>
              {NODE_STYLE[selected.type].icon}
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-foreground">{selected.label}</div>
              <div className="text-[10px] text-muted-foreground capitalize">Tipe: {NODE_STYLE[selected.type].label}</div>
            </div>
          </div>

          <div className="h-px bg-border my-2" />

          {selected.details ? (
            <div className="space-y-2">
              {Object.entries(selected.details).map(([key, val]) => (
                <div key={key} className="flex justify-between gap-4 text-xs">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-semibold text-foreground text-right">{val}</span>
                </div>
              ))}
              <div className="flex justify-between gap-4 text-xs">
                <span className="text-muted-foreground">Tingkat Risiko:</span>
                <span className="font-bold uppercase" style={{ color: RISK_RING[selected.risk] }}>{selected.risk}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tingkat Risiko:</span>
                <span className="font-bold uppercase" style={{ color: RISK_RING[selected.risk] }}>{selected.risk}</span>
              </div>
            </div>
          )}

          <div className="pt-2 text-[10px] text-muted-foreground italic leading-relaxed border-t border-dashed border-border mt-3">
            *Terhubung dengan {dynamicEdges.filter((e) => e.from === selected.id || e.to === selected.id).length} entitas lain dalam jaringan terindikasi fraud.
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => onShowToast(`Membuka berkas kasus investigasi untuk ${selected.label}...`, "warning")}
              className="inline-flex h-8 items-center justify-center gap-1 rounded bg-muted px-2.5 font-bold hover:bg-accent text-foreground transition-all"
            >
              <ExternalLink className="h-3 w-3" /> Rekam Jejak
            </button>
            <button
              onClick={onInvestigate}
              disabled={isInvestigated || scenarioTxIds.length === 0}
              className="inline-flex h-8 items-center justify-center gap-1 rounded bg-warning/10 border border-warning/20 hover:bg-warning/20 disabled:opacity-40 disabled:pointer-events-none text-warning font-bold transition-all shadow-sm"
            >
              <Search className="h-3.5 w-3.5" /> {isInvestigated ? t('network.btn.investigating') : t('network.btn.investigate')}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 text-xs text-muted-foreground text-center">
          Pilih salah satu titik (node) pada graf untuk melihat detail analitik entitas.
        </div>
      )}
    </div>
  );
}

function InsightsList({ insights }: { insights: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-surface">
        Analisis Temuan Jaringan
      </div>
      <ul className="space-y-3 p-5 text-xs">
        {insights.map((insight, idx) => (
          <li key={`insight-${idx}`} className="flex items-start gap-2.5 leading-relaxed">
            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
              idx === 0 ? "bg-critical" : idx === 1 ? "bg-destructive" : "bg-warning"
            }`} />
            <span className="text-muted-foreground">{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
