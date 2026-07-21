/**
 * Network Graph — Enterprise Type Definitions
 * Shared interfaces for graph nodes, edges, scenarios, and styling maps.
 */

export interface GraphNode {
  id: string;
  label: string;
  type: "account" | "device" | "merchant" | "ip" | "crypto";
  risk: "low" | "medium" | "high" | "critical";
  x: number;
  y: number;
  details?: Record<string, string>;
}

export interface GraphEdge {
  id?: string;
  from: string;
  to: string;
  label?: string;
  amount?: number;
  isFlagged?: boolean;
}

export interface GraphScenario {
  id: string;
  name: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  nodes: GraphNode[];
  edges: GraphEdge[];
  insights: string[];
}

export const NODE_STYLE: Record<GraphNode["type"], { fill: string; stroke: string; icon: string; label: string }> = {
  account: { fill: "#3b82f6", stroke: "#60a5fa", icon: "🏦", label: "Bank Account" },
  device: { fill: "#8b5cf6", stroke: "#a78bfa", icon: "📱", label: "Device Fingerprint" },
  merchant: { fill: "#f59e0b", stroke: "#fbbf24", icon: "🛒", label: "Merchant" },
  ip: { fill: "#06b6d4", stroke: "#22d3ee", icon: "🌐", label: "IP Address" },
  crypto: { fill: "#ec4899", stroke: "#f472b6", icon: "🪙", label: "Crypto Wallet" },
};

export const RISK_RING: Record<GraphNode["risk"], string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

export const RISK_BG: Record<GraphNode["risk"], string> = {
  low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  critical: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};
