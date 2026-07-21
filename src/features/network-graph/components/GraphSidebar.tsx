/**
 * Network Graph — Sidebar Inspector & Scenario Selector
 */
import { ShieldAlert, Network, AlertOctagon, CheckCircle2, Lock, FileSearch, ArrowUpRight } from "lucide-react";
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
        <div className="rounded-xl border border-indigo-500/40 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{NODE_STYLE[selected.type]?.icon || "🏦"}</span>
              <div>
                <h4 className="text-sm font-bold text-slate-100">{selected.label}</h4>
                <div className="text-[10px] text-slate-400 font-mono uppercase">{selected.id}</div>
              </div>
            </div>
            <span className={`rounded border px-2 py-0.5 text-[10px] uppercase font-bold ${RISK_BG[selected.risk]}`}>
              {selected.risk}
            </span>
          </div>

          {selected.details && (
            <div className="mt-3 space-y-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-500">Entity Metadata</div>
              {Object.entries(selected.details).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2 text-slate-300">
                  <span className="capitalize text-slate-400">{k}:</span>
                  <span className="font-mono text-slate-200 truncate max-w-[140px]">{v}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 space-y-2">
            <button
              onClick={() => onShowToast(`Entity ${selected.id} has been flagged & held for fraud review.`, "success")}
              className="w-full inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-rose-600 px-3 text-xs font-semibold text-white hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/20"
            >
              <Lock className="h-3.5 w-3.5" /> Freeze Entity &amp; Hold Funds
            </button>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/audit";
                link.click();
              }}
              className="w-full inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <FileSearch className="h-3.5 w-3.5 text-indigo-400" /> Open in Audit Queue
            </button>
          </div>
        </div>
      ) : (
        /* Scenario Selector Card */
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
            <Network className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">Investigasi Skenario Fraud</h3>
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
                      ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                      : "border-slate-800 bg-slate-950/40 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{sc.name}</span>
                    <span className={`rounded border px-1.5 py-0.5 text-[9px] uppercase font-bold ${RISK_BG[sc.severity]}`}>
                      {sc.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {sc.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={onInvestigate}
              disabled={isInvestigated}
              className={`w-full inline-flex h-9 items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-all ${
                isInvestigated
                  ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/25"
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
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
            <AlertOctagon className="h-4 w-4 text-amber-400" />
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Intelijen Klaster</h4>
          </div>
          <div className="space-y-2">
            {dynamicInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
                <span className="leading-relaxed">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
