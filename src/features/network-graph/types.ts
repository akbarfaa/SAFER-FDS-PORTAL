/**
 * Network Graph — Enterprise Type Definitions
 * Shared interfaces for graph nodes, edges, scenarios, and theme styling maps.
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

export const NODE_STYLE = {
  account: { fill: "var(--chart-1)", stroke: "var(--primary)", label: "Bank Account" },
  device: { fill: "var(--chart-2)", stroke: "var(--warning)", label: "Device Fingerprint" },
  merchant: { fill: "var(--chart-4)", stroke: "var(--destructive)", label: "Merchant" },
  ip: { fill: "var(--chart-5)", stroke: "var(--accent)", label: "IP Address" },
  crypto: { fill: "var(--chart-3)", stroke: "var(--critical)", label: "Crypto Wallet" },
} as const;

export const RISK_RING: Record<GraphNode["risk"], string> = {
  low: "var(--success)",
  medium: "var(--warning)",
  high: "var(--destructive)",
  critical: "var(--critical)",
};

export const RISK_BG: Record<GraphNode["risk"], string> = {
  low: "bg-success/15 text-success border-success/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  high: "bg-destructive/15 text-destructive border-destructive/30",
  critical: "bg-critical/15 text-critical border-critical/30",
};
