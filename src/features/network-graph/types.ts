/**
 * Network Graph — Type Definitions
 * Shared interfaces for graph nodes, edges, and scenarios.
 */

export interface GraphNode {
  id: string;
  label: string;
  type: "account" | "device" | "merchant" | "ip";
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
  account: { fill: "var(--chart-1)", icon: "A", label: "Account" },
  device: { fill: "var(--chart-2)", icon: "D", label: "Device" },
  merchant: { fill: "var(--chart-4)", icon: "M", label: "Merchant" },
  ip: { fill: "var(--chart-5)", icon: "I", label: "IP" },
} as const;

export const RISK_RING: Record<GraphNode["risk"], string> = {
  low: "var(--success)",
  medium: "var(--warning)",
  high: "var(--destructive)",
  critical: "var(--critical)",
};
