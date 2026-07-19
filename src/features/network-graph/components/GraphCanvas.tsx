/**
 * Network Graph — SVG Canvas Component
 * Renders the interactive graph with nodes, edges, tooltips, and legends.
 */
import { Info, Loader2 } from "lucide-react";
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

export function GraphCanvas({
  nodes, edges, selected, hovered, loading,
  zoom, pan, isFullscreen, containerRef, scenarioNodes,
  onSelectNode, onHoverNode, onPointerDown, onPointerMove, onPointerUp,
}: GraphCanvasProps) {
  const { t } = useTranslation();

  const byId = (id: string) =>
    nodes.find((n) => n.id === id) || scenarioNodes.find((n) => n.id === id)!;

  return (
    <div className="relative flex-1">
      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 bg-card/65 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="mt-3 text-sm font-semibold text-foreground">Calculating Dynamic Node Relations...</div>
          <p className="mt-1 text-xs text-muted-foreground">Running layout spring embedding &amp; PageRank hub identification</p>
        </div>
      )}

      {/* SVG Frame Canvas */}
      <div
        ref={containerRef}
        className="relative bg-surface touch-none select-none cursor-grab active:cursor-grabbing h-full"
        style={{ height: isFullscreen ? "calc(100vh - 100px)" : 500 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className="absolute inset-0 bg-grid opacity-[0.25] pointer-events-none" />

        <svg viewBox="0 0 820 440" className="absolute inset-0 h-full w-full">
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transformOrigin: "410px 220px" }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((e, i) => {
              const a = byId(e.from);
              const b = byId(e.to);
              if (!a || !b) return null;
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              return (
                <g key={`edge-${i}`} className="opacity-80">
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#arrow)" />
                  {e.label && (
                    <g>
                      <rect x={mx - 22} y={my - 8} width="44" height="14" fill="var(--card)" stroke="var(--border)" strokeWidth="1" rx="4" />
                      <text x={mx} y={my + 2} textAnchor="middle" fontSize="8" fontWeight="600" fill="var(--muted-foreground)" className="num select-none">
                        {e.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const st = NODE_STYLE[n.type];
              const isSel = selected?.id === n.id;
              const isHov = hovered?.id === n.id;
              return (
                <g key={`node-${n.id}`} className="cursor-pointer group" onClick={(e) => { e.stopPropagation(); onSelectNode(n); }} onPointerEnter={() => onHoverNode(n)} onPointerLeave={() => onHoverNode(null)}>
                  <circle cx={n.x} cy={n.y} r={26} fill={RISK_RING[n.risk]} opacity={isSel ? 0.35 : isHov ? 0.22 : 0.08} className="transition-opacity duration-200" />
                  <circle cx={n.x} cy={n.y} r={16} fill={st.fill} stroke={isSel ? "var(--foreground)" : "var(--card)"} strokeWidth={isSel ? 2.5 : 2} className="transition-all duration-200 shadow-sm" />
                  <text x={n.x} y={n.y + 4.5} textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--card)" className="select-none">{st.icon}</text>
                  <text x={n.x} y={n.y + 36} textAnchor="middle" fontSize="9.5" fill={isSel ? "var(--foreground)" : "var(--muted-foreground)"} fontWeight={isSel ? "700" : "500"} className="transition-colors duration-200 select-none bg-background/50">
                    {n.label.split(" ")[0]}
                  </text>
                </g>
              );
            })}

            {/* SVG Tooltip */}
            {hovered && (
              <g transform={`translate(${hovered.x}, ${hovered.y - 32})`} className="pointer-events-none transition-all duration-150 select-none z-30">
                <rect x="-70" y="-36" width="140" height="40" rx="6" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
                <polygon points="-6,4 6,4 0,10" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                <line x1="-5" y1="4" x2="5" y2="4" stroke="var(--card)" strokeWidth="2.5" />
                <text x="0" y="-22" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--foreground)">{hovered.label}</text>
                <text x="-60" y="-8" fontSize="7.5" fontWeight="bold" fill="var(--muted-foreground)">{NODE_STYLE[hovered.type].label.toUpperCase()}</text>
                <text x="60" y="-8" textAnchor="end" fontSize="7.5" fontWeight="bold" fill={RISK_RING[hovered.risk]}>{hovered.risk.toUpperCase()} RISK</text>
              </g>
            )}
          </g>
        </svg>

        {/* Bottom Legend */}
        <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card/90 px-3 py-1.5 text-[10px] font-semibold backdrop-blur select-none z-10">
          <Legend swatch="var(--chart-1)" label="A: Rekening / Akun" />
          <Legend swatch="var(--chart-2)" label="D: Perangkat / Device" />
          <Legend swatch="var(--chart-4)" label="M: Merchant / Toko" />
          <Legend swatch="var(--chart-5)" label="I: Alamat IP" />
        </div>

        <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1 text-[10px] text-muted-foreground backdrop-blur select-none">
          <Info className="h-3.5 w-3.5" /> {t('network.help.pan')} · {t('network.help.zoom')}
        </div>
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: swatch }} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}
