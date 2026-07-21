/**
 * Network Graph — Interactive Toolbar Component
 */
import { ZoomIn, ZoomOut, RotateCcw, Maximize, Minimize, RefreshCw } from "lucide-react";
import { RISK_BG } from "../types";

interface GraphToolbarProps {
  scenarioName?: string;
  scenarioSeverity?: "low" | "medium" | "high" | "critical";
  isInvestigated?: boolean;
  zoom: number;
  isFullscreen: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleFullscreen: () => void;
  onRefreshLayout?: () => void;
}

export function GraphToolbar({
  scenarioName,
  scenarioSeverity,
  isInvestigated,
  zoom,
  isFullscreen,
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleFullscreen,
  onRefreshLayout,
}: GraphToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-5 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {scenarioName && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-100">{scenarioName}</span>
            {scenarioSeverity && (
              <span className={`rounded border px-1.5 py-0.5 text-[9px] uppercase font-bold ${RISK_BG[scenarioSeverity]}`}>
                {scenarioSeverity}
              </span>
            )}
          </div>
        )}
        {isInvestigated && (
          <span className="rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold">
            In Audit Queue
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/80 p-1 shadow-lg">
        <button
          onClick={onZoomIn}
          className="grid h-7 w-7 place-items-center rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>

        <span className="num px-1 text-[11px] text-slate-400 font-mono select-none">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={onZoomOut}
          className="grid h-7 w-7 place-items-center rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>

        <div className="h-3.5 w-px bg-slate-800 mx-1" />

        <button
          onClick={onResetView}
          className="grid h-7 w-7 place-items-center rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title="Reset Viewpoint"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {onRefreshLayout && (
          <button
            onClick={onRefreshLayout}
            className="grid h-7 w-7 place-items-center rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Re-run Spring Embedding Layout"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}

        <div className="h-3.5 w-px bg-slate-800 mx-1" />

        <button
          onClick={onToggleFullscreen}
          className="grid h-7 w-7 place-items-center rounded text-indigo-400 hover:bg-indigo-500/20 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Workspace"}
        >
          {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
