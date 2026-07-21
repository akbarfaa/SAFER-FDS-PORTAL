/**
 * Network Graph — Theme-Aware Sidebar Inspector & Scenario Selector
 */
import {
  ShieldAlert,
  Network,
  AlertOctagon,
  CheckCircle2,
  Lock,
  FileSearch,
  Landmark,
  Smartphone,
  ShoppingBag,
  Globe,
  Coins,
} from "lucide-react";
import type { GraphScenario, GraphNode, GraphEdge } from "../types";
import { RISK_BG, NODE_STYLE } from "../types";

interface GraphSidebarProps {
  scenarios: GraphScenario[];
  activeScenarioIdx: number;
  selected: GraphNode | null;
  dynamicEdges: GraphEdge[];
  dynamicInsights: string[];
  isInvestigated: boolean;
  isFullscreen: boolean;
  scenarioTxIds: string[];
  allTxs: any[];
  onSelectScenario: (idx: number) => void;
  onInvestigate: () => void;
  onShowToast: (msg: string, type?: "success" | "warning") => void;
}

const ICON_MAP = {
  account: Landmark,
  device: Smartphone,
  merchant: ShoppingBag,
  ip: Globe,
  crypto: Coins,
};

export function GraphSidebar({
  scenarios,
  activeScenarioIdx,
  selected,
  dynamicEdges,
  dynamicInsights,
  isInvestigated,
  isFullscreen,
  scenarioTxIds,
  allTxs,
  onSelectScenario,
  onInvestigate,
  onShowToast,
}: GraphSidebarProps) {
  const activeScenario = scenarios[activeScenarioIdx] || scenarios[0];

  return (
    <div className="w-full lg:w-80 space-y-4 shrink-0">
      {/* Active Node Detail Inspector Card */}
      {selected ? (
        <div className="rounded-lg border border-primary/40 bg-card p-5 shadow-lg animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              {(() => {
                const IconComp = ICON_MAP[selected.type] || Landmark;
                return <IconComp className="h-5 w-5 text-primary" />;
              })()}
              <div>
                <h4 className="text-sm font-bold text-foreground">{selected.label}</h4>
                <div className="text-[10px] text-muted-foreground font-mono uppercase">{selected.id}</div>
              </div>
            </div>
            <span className={`rounded border px-2 py-0.5 text-[10px] uppercase font-bold ${RISK_BG[selected.risk]}`}>
              {selected.risk}
            </span>
          </div>

          {selected.details && (
            <div className="mt-3 space-y-2 rounded-md border border-border bg-surface p-3 text-xs">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Entity Metadata</div>
              {Object.entries(selected.details).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2 text-foreground">
                  <span className="capitalize text-muted-foreground">{k}:</span>
                  <span className="font-mono truncate max-w-[140px]">{v}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 space-y-2">
            <button
              onClick={() => onShowToast(`Entity ${selected.id} has been flagged & held for fraud review.`, "success")}
              className="w-full inline-flex h-9 items-center justify-center gap-2 rounded-md bg-destructive px-3 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors shadow"
            >
              <Lock className="h-3.5 w-3.5" /> Freeze Entity &amp; Hold Funds
            </button>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/audit";
                link.click();
              }}
              className="w-full inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
            >
              <FileSearch className="h-3.5 w-3.5 text-primary" /> Open in Audit Queue
            </button>
          </div>
        </div>
      ) : (
        /* Scenario Selector Card */
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
            <Network className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Investigasi Skenario Fraud</h3>
          </div>

          <div className="space-y-2.5">
            {scenarios.map((sc, idx) => {
              const isActive = idx === activeScenarioIdx;
              return (
                <button
                  key={sc.id}
                  onClick={() => onSelectScenario(idx)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 ${
                    isActive
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-surface hover:bg-accent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{sc.name}</span>
                    <span className={`rounded border px-1.5 py-0.5 text-[9px] uppercase font-bold ${RISK_BG[sc.severity]}`}>
                      {sc.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {sc.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-border">
            <button
              onClick={onInvestigate}
              disabled={isInvestigated}
              className={`w-full inline-flex h-9 items-center justify-center gap-2 rounded-md text-xs font-semibold transition-all ${
                isInvestigated
                  ? "bg-accent text-muted-foreground border border-border cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              {isInvestigated ? "Klaster Sudah Dimasukkan Audit" : "Eskalasi Klaster ke Tim Audit"}
            </button>
          </div>
        </div>
      )}

      {/* Cluster Intelligence Insights Card */}
      {dynamicInsights && dynamicInsights.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-3">
            <AlertOctagon className="h-4 w-4 text-warning" />
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Intelijen Klaster</h4>
          </div>
          <div className="space-y-2">
            {dynamicInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="leading-relaxed text-foreground">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
