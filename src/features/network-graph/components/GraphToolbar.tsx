/**
 * Network Graph — Theme-Aware Toolbar Component
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
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-5 py-3 text-card-foreground">
      <div className="flex items-center gap-3">
        {scenarioName && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">{scenarioName}</span>
            {scenarioSeverity && (
              <span className={`rounded border px-1.5 py-0.5 text-[9px] uppercase font-bold ${RISK_BG[scenarioSeverity]}`}>
                {scenarioSeverity}
              </span>
            )}
          </div>
        )}
        {isInvestigated && (
          <span className="rounded bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-semibold">
            In Audit Queue
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface p-1 shadow-sm">
        <button
          onClick={onZoomIn}
          className="grid h-7 w-7 place-items-center rounded text-foreground hover:bg-accent transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>

        <span className="num px-1 text-[11px] text-muted-foreground font-mono select-none">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={onZoomOut}
          className="grid h-7 w-7 place-items-center rounded text-foreground hover:bg-accent transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>

        <div className="h-3.5 w-px bg-border mx-1" />

        <button
          onClick={onResetView}
          className="grid h-7 w-7 place-items-center rounded text-foreground hover:bg-accent transition-colors"
          title="Reset Viewpoint"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {onRefreshLayout && (
          <button
            onClick={onRefreshLayout}
            className="grid h-7 w-7 place-items-center rounded text-foreground hover:bg-accent transition-colors"
            title="Re-run Spring Embedding Layout"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}

        <div className="h-3.5 w-px bg-border mx-1" />

        <button
          onClick={onToggleFullscreen}
          className="grid h-7 w-7 place-items-center rounded text-primary hover:bg-primary/10 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Workspace"}
        >
          {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
