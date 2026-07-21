/**
 * Network Graph — Theme-Aware SVG Canvas Component
 * Fully integrated with SAFER design tokens & theme switcher (Light / Dark mode).
 */
import {
  Loader2,
  Sparkles,
  Landmark,
  Smartphone,
  ShoppingBag,
  Globe,
  Coins,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { GraphNode, GraphEdge } from "../types";
import { NODE_STYLE, RISK_RING } from "../types";

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selected: GraphNode | null;
  hovered: GraphNode | null;
  loading: boolean;
  zoom: number;
  pan: { x: number; y: number };
  isFullscreen: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  scenarioNodes: GraphNode[];
  onSelectNode: (node: GraphNode) => void;
  onHoverNode: (node: GraphNode | null) => void;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
}

const ICON_MAP = {
  account: Landmark,
  device: Smartphone,
  merchant: ShoppingBag,
  ip: Globe,
  crypto: Coins,
};

export function GraphCanvas({
  nodes,
  edges,
  selected,
  hovered,
  loading,
  zoom,
  pan,
  isFullscreen,
  containerRef,
  scenarioNodes,
  onSelectNode,
  onHoverNode,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: GraphCanvasProps) {
  const { t } = useTranslation();

  const byId = (id: string) =>
    nodes.find((n) => n.id === id) || scenarioNodes.find((n) => n.id === id);

  return (
    <div className="relative flex-1 h-full min-h-0 w-full bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-card/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="mt-3 text-sm font-semibold text-foreground">Calculating Network Topology...</div>
          <p className="mt-1 text-xs text-muted-foreground">Running PageRank hub identification &amp; cluster embedding</p>
        </div>
      )}

      {/* SVG Canvas Workspace */}
      <div
        ref={containerRef}
        className="relative flex-1 h-full min-h-0 w-full touch-none select-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-grid opacity-[0.25] pointer-events-none" />

        <svg viewBox="0 0 1000 520" className="absolute inset-0 h-full w-full">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
            </marker>
            <marker id="arrow-flagged" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--destructive)" />
            </marker>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transformOrigin: "500px 260px" }}>
            {/* Edges */}
            {edges.map((e, i) => {
              const a = byId(e.from);
              const b = byId(e.to);
              if (!a || !b) return null;

              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              const isHighRiskEdge = a.risk === "critical" || b.risk === "critical";

              return (
                <g key={`edge-${i}`} className="opacity-90">
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={isHighRiskEdge ? "var(--destructive)" : "var(--border)"}
                    strokeWidth={isHighRiskEdge ? 2 : 1.5}
                    strokeDasharray={isHighRiskEdge ? "4 2" : undefined}
                    markerEnd={isHighRiskEdge ? "url(#arrow-flagged)" : "url(#arrow)"}
                  />

                  {e.label && (
                    <g className="cursor-pointer">
                      <rect
                        x={mx - 30}
                        y={my - 9}
                        width="60"
                        height="18"
                        fill="var(--card)"
                        stroke={isHighRiskEdge ? "var(--destructive)" : "var(--border)"}
                        strokeWidth="1"
                        rx="4"
                      />
                      <text
                        x={mx}
                        y={my + 3}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fill={isHighRiskEdge ? "var(--destructive)" : "var(--muted-foreground)"}
                        className="select-none num"
                      >
                        {e.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const st = NODE_STYLE[n.type] || NODE_STYLE.account;
              const IconComp = ICON_MAP[n.type] || Landmark;
              const isSel = selected?.id === n.id;
              const isHov = hovered?.id === n.id;
              const ringColor = RISK_RING[n.risk];

              return (
                <g
                  key={`node-${n.id}`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode(n);
                  }}
                  onPointerEnter={() => onHoverNode(n)}
                  onPointerLeave={() => onHoverNode(null)}
                >
                  {/* Outer Risk Halo Ring */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isSel ? 32 : isHov ? 28 : 24}
                    fill={ringColor}
                    opacity={isSel ? 0.35 : isHov ? 0.25 : 0.12}
                    className="transition-all duration-200"
                  />

                  {/* Node Circle */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={18}
                    fill="var(--card)"
                    stroke={isSel ? "var(--primary)" : st.stroke}
                    strokeWidth={isSel ? 3 : 2}
                    className="transition-all duration-200"
                  />

                  {/* Lucide Icon rendered inside foreignObject */}
                  <foreignObject x={n.x - 10} y={n.y - 10} width="20" height="20" className="pointer-events-none">
                    <div className="h-full w-full flex items-center justify-center text-foreground">
                      <IconComp className="h-4 w-4 text-foreground" />
                    </div>
                  </foreignObject>

                  {/* Node Label Badge */}
                  <g transform={`translate(${n.x}, ${n.y + 32})`}>
                    <rect
                      x="-45"
                      y="-8"
                      width="90"
                      height="16"
                      fill="var(--card)"
                      stroke={isSel ? "var(--primary)" : "var(--border)"}
                      strokeWidth="1"
                      rx="4"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="600"
                      fill="var(--foreground)"
                      className="select-none"
                    >
                      {n.label.length > 14 ? `${n.label.slice(0, 12)}…` : n.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Top Legend HUD */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card/90 p-2.5 backdrop-blur-md text-xs shadow-md">
          <div className="flex items-center gap-1.5 font-semibold text-foreground border-r border-border pr-3">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Graph Entities
          </div>
          {(Object.entries(NODE_STYLE) as [keyof typeof NODE_STYLE, typeof NODE_STYLE[keyof typeof NODE_STYLE]][]).map(([type, st]) => {
            const IconComponent = ICON_MAP[type];
            return (
              <div key={type} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <IconComponent className="h-3.5 w-3.5 text-foreground" />
                <span>{st.label}</span>
              </div>
            );
          })}
        </div>

        {/* Hovered Node Tooltip */}
        {hovered && !selected && (
          <div
            className="absolute z-20 pointer-events-none rounded-lg border border-border bg-popover p-3 shadow-xl backdrop-blur-md text-xs text-popover-foreground min-w-[200px]"
            style={{
              left: Math.min(window.innerWidth - 250, Math.max(20, hovered.x * zoom + pan.x + 40)),
              top: Math.min(window.innerHeight - 200, Math.max(20, hovered.y * zoom + pan.y - 20)),
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-border pb-1.5 mb-2">
              <span className="font-bold text-foreground">{hovered.label}</span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] uppercase font-bold ${
                  hovered.risk === "critical"
                    ? "bg-destructive/15 text-destructive"
                    : hovered.risk === "high"
                      ? "bg-warning/15 text-warning"
                      : "bg-success/15 text-success"
                }`}
              >
                {hovered.risk}
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-muted-foreground">
              <div>Type: <span className="text-foreground capitalize">{hovered.type}</span></div>
              {hovered.details &&
                Object.entries(hovered.details).slice(0, 2).map(([k, v]) => (
                  <div key={k} className="truncate">
                    <span className="text-muted-foreground capitalize">{k}:</span> <span className="text-foreground">{v}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
