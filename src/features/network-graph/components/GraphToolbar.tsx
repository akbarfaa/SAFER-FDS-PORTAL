/**
 * Network Graph — Toolbar Component
 * Controls for zoom, reset, and fullscreen toggle.
 */
import { Network as NetworkIcon, ZoomIn, ZoomOut, Maximize, Minimize, RotateCcw } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface GraphToolbarProps {
  scenarioName: string;
  scenarioSeverity: string;
  isInvestigated: boolean;
  isFullscreen: boolean;
  zoom: number;
  onToggleFullscreen: () => void;
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function GraphToolbar({
  scenarioName, scenarioSeverity, isInvestigated, isFullscreen, zoom,
  onToggleFullscreen, onResetView, onZoomIn, onZoomOut,
}: GraphToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between border-b border-border px-5 py-3 bg-card relative z-10 gap-2">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <NetworkIcon className="h-4 w-4 text-primary" />
        <span>{scenarioName}</span>
        <span className={`ml-2 rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
          isInvestigated
            ? "bg-warning/20 text-warning border border-warning/30"
            : scenarioSeverity === "critical"
              ? "bg-critical/10 text-critical"
              : "bg-destructive/10 text-destructive"
        }`}>
          {isInvestigated ? t('network.status.investigating') : scenarioSeverity}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        <span className="hidden md:inline text-[10px] text-muted-foreground mr-2 font-medium bg-muted/60 px-2 py-1 rounded">
          💡 Zoom: Scroll / Pinch | Pan: Drag Canvas
        </span>

        <button onClick={onToggleFullscreen} className={`grid h-8 w-8 place-items-center rounded-md border border-border bg-surface hover:bg-accent transition-colors ${isFullscreen ? "text-primary border-primary bg-primary/10" : ""}`} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Workspace"}>
          {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
        </button>

        <button onClick={onResetView} className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface hover:bg-accent transition-colors" title="Reset Zoom & Pan">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        <button onClick={onZoomOut} className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface hover:bg-accent transition-colors" title="Zoom Out">
          <ZoomOut className="h-3.5 w-3.5" />
        </button>

        <button onClick={onZoomIn} className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface hover:bg-accent transition-colors" title="Zoom In">
          <ZoomIn className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />
        <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
          Zoom: {Math.round(zoom * 100)}%
        </span>
      </div>
    </div>
  );
}
