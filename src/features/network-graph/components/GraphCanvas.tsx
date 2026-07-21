/**
 * Network Graph — Enterprise SVG Canvas Component
 * Inspired by Palantir Gotham, Neo4j Bloom, and Unit21.
 */
import { Loader2, Maximize2, Sparkles } from "lucide-react";
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
  const byId = (id: string) =>
    nodes.find((n) => n.id === id) || scenarioNodes.find((n) => n.id === id);

  return (
    <div className="relative flex-1 bg-slate-950/90 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
          <div className="mt-4 text-sm font-bold text-slate-100">Analyzing Network Topology (NetworkX)...</div>
          <p className="mt-1 text-xs text-slate-400">Running PageRank hub identification &amp; mule ring cluster layout</p>
        </div>
      )}

      {/* Interactive SVG Workspace Canvas */}
      <div
        ref={containerRef}
        className="relative h-full w-full touch-none select-none cursor-grab active:cursor-grabbing min-h-[500px]"
        style={{ height: isFullscreen ? "calc(100vh - 120px)" : 520 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Cyber Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        <svg viewBox="0 0 1000 520" className="absolute inset-0 h-full w-full">
          <defs>
            {/* Arrowhead Marker */}
            <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
            </marker>
            <marker id="arrow-flagged" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#ef4444" />
            </marker>

            {/* Glowing filters */}
            <filter id="glow-critical" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
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
                <g key={`edge-${i}`} className="transition-opacity duration-300">
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={isHighRiskEdge ? "#ef4444" : "#475569"}
                    strokeWidth={isHighRiskEdge ? 2 : 1.5}
                    strokeDasharray={isHighRiskEdge ? "4 2" : undefined}
                    markerEnd={isHighRiskEdge ? "url(#arrow-flagged)" : "url(#arrow)"}
                    className={isHighRiskEdge ? "animate-pulse" : undefined}
                  />

                  {e.label && (
                    <g className="cursor-pointer">
                      <rect
                        x={mx - 30}
                        y={my - 9}
                        width="60"
                        height="18"
                        fill="#0f172a"
                        stroke={isHighRiskEdge ? "#ef4444" : "#334155"}
                        strokeWidth="1"
                        rx="5"
                      />
                      <text
                        x={mx}
                        y={my + 3}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fill={isHighRiskEdge ? "#fca5a5" : "#94a3b8"}
                        className="select-none font-mono"
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
              const isSel = selected?.id === n.id;
              const isHov = hovered?.id === n.id;
              const ringColor = RISK_RING[n.risk];
              const isCritical = n.risk === "critical";

              return (
                <g
                  key={`node-${n.id}`}
                  className="cursor-pointer transition-transform duration-150"
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
                    opacity={isSel ? 0.4 : isHov ? 0.3 : isCritical ? 0.25 : 0.12}
                    filter={isCritical ? "url(#glow-critical)" : undefined}
                    className={isCritical ? "animate-pulse" : "transition-all duration-200"}
                  />

                  {/* Main Node Body */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={18}
                    fill="#0f172a"
                    stroke={isSel ? "#ffffff" : st.stroke}
                    strokeWidth={isSel ? 3 : 2}
                    className="transition-all duration-200"
                  />

                  {/* Node Icon */}
                  <text
                    x={n.x}
                    y={n.y + 5}
                    textAnchor="middle"
                    fontSize="13"
                    className="select-none pointer-events-none"
                  >
                    {st.icon}
                  </text>

                  {/* Node Label Badge */}
                  <g transform={`translate(${n.x}, ${n.y + 32})`}>
                    <rect
                      x="-45"
                      y="-8"
                      width="90"
                      height="16"
                      fill="#020617"
                      stroke={isSel ? "#ffffff" : "#1e293b"}
                      strokeWidth="1"
                      rx="4"
                      opacity="0.9"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="600"
                      fill={isSel ? "#ffffff" : "#cbd5e1"}
                      className="select-none font-sans"
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
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 backdrop-blur-md text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold border-r border-slate-800 pr-3">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Palantir Topology Legend
          </div>
          {Object.entries(NODE_STYLE).map(([type, st]) => (
            <div key={type} className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="text-xs">{st.icon}</span>
              <span>{st.label}</span>
            </div>
          ))}
        </div>

        {/* Hovered Node Quick Intelligence Tooltip */}
        {hovered && !selected && (
          <div
            className="absolute z-20 pointer-events-none rounded-lg border border-slate-700 bg-slate-900/90 p-3 shadow-xl backdrop-blur-md text-xs text-slate-200 min-w-[200px]"
            style={{
              left: Math.min(window.innerWidth - 250, Math.max(20, hovered.x * zoom + pan.x + 40)),
              top: Math.min(window.innerHeight - 200, Math.max(20, hovered.y * zoom + pan.y - 20)),
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
              <span className="font-bold text-slate-100">{hovered.label}</span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] uppercase font-bold ${
                  hovered.risk === "critical"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : hovered.risk === "high"
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {hovered.risk}
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-400">
              <div>Type: <span className="text-slate-200 capitalize">{hovered.type}</span></div>
              {hovered.details &&
                Object.entries(hovered.details).slice(0, 2).map(([k, v]) => (
                  <div key={k} className="truncate">
                    <span className="text-slate-400 capitalize">{k}:</span> <span className="text-slate-200">{v}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
