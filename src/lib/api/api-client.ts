/**
 * SAFER — API Client
 *
 * Client library to communicate with the FastAPI backend services.
 * Integrates with Vite development proxy and production unified gateway.
 */

// In production: VITE_API_URL points to Render.com backend (e.g. https://safer-api.onrender.com/api)
// In development: Vite proxy forwards /api to localhost:8000
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export interface TransactionResponse {
  id: string;
  timestamp: string;
  sender_name: string;
  sender_account: string;
  sender_bank: string;
  sender_city: string;
  sender_province: string;
  sender_lat: number;
  sender_lng: number;
  receiver_name: string;
  receiver_account: string;
  receiver_bank: string;
  receiver_city: string;
  receiver_province: string;
  receiver_lat: number;
  receiver_lng: number;
  amount: number;
  payment_rail: string;
  ewallet_provider: string;
  merchant: string;
  merchant_category: string;
  channel: string;
  device_type: string;
  device_brand: string;
  device_fingerprint: string;
  ip_address: string;
  is_new_device: boolean;
  account_age_days: number;
  is_velocity_anomaly: boolean;
  is_geo_mismatch: boolean;
  is_off_hours: boolean;
  is_high_value_for_rail: boolean;
  is_suspicious_ip: boolean;
  is_risky_merchant: boolean;
  is_new_account: boolean;
  has_failed_attempts: boolean;
  is_device_mismatch: boolean;
  is_sim_swap: boolean;
  is_unusual_beneficiary: boolean;
  velocity_count: number;
  geo_distance_km: number;
  risk_score: number;
  severity: "low" | "medium" | "high" | "critical";
  fraud_probability: number;
  xgb_probability: number;
  lgb_probability: number;
  ai_reasoning: string;
  shap_values: string; // JSON string
  primary_risk_factors: string; // JSON string
  suggested_action: string;
  audit_status: string;
  audit_notes: string;
  audited_by: string | null;
  audited_at: string | null;
  created_at: string | null;
}

export interface DashboardStats {
  total_transactions: number;
  total_amount: number;
  flagged_count: number;
  flagged_amount: number;
  blocked_count: number;
  pending_review: number;
  by_severity: Record<string, number>;
  by_audit_status: Record<string, number>;
  by_rail: Record<string, number>;
}

export interface RiskDistribution {
  buckets: Array<{ range: string; count: number }>;
}

export interface RailDistribution {
  rails: Array<{ rail: string; count: number }>;
}

export interface TrendData {
  points: Array<{ time: string; total: number; flagged: number }>;
}

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

export interface GraphAnalysisResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  insights: string[];
}

// ─── API Requests ──────────────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error [${response.status}]: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Transactions
  getTransactions: async (params?: {
    page?: number;
    page_size?: number;
    severity?: string;
    audit_status?: string;
    rail?: string;
  }): Promise<{ items: TransactionResponse[]; total: number; page: number; page_size: number }> => {
    const query = new URLSearchParams();
    if (params) {
      if (params.page) query.append("page", params.page.toString());
      if (params.page_size) query.append("page_size", params.page_size.toString());
      if (params.severity) query.append("severity", params.severity);
      if (params.audit_status) query.append("audit_status", params.audit_status);
      if (params.rail) query.append("rail", params.rail);
    }
    const queryString = query.toString();
    return request(`/transactions${queryString ? `?${queryString}` : ""}`);
  },

  getTransaction: async (id: string): Promise<TransactionResponse> => {
    return request(`/transactions/${id}`);
  },

  updateAuditStatus: async (
    id: string,
    status: string,
    notes: string,
    changedBy = "Analyst Demo"
  ): Promise<TransactionResponse> => {
    return request(`/transactions/${id}/audit`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes, changed_by: changedBy }),
    });
  },

  getAuditHistory: async (id: string): Promise<any[]> => {
    return request(`/transactions/${id}/audit-history`);
  },

  generateBatch: async (count: number, fraudRatio: number): Promise<TransactionResponse[]> => {
    return request(`/transactions/batch`, {
      method: "POST",
      body: JSON.stringify({ count, fraud_ratio: fraudRatio }),
    });
  },

  simulateTransaction: async (txData: any): Promise<any> => {
    return request(`/transactions/simulate`, {
      method: "POST",
      body: JSON.stringify(txData),
    });
  },

  // Analytics
  getDashboardStats: async (): Promise<DashboardStats> => {
    return request(`/analytics/dashboard`);
  },

  getRiskDistribution: async (): Promise<RiskDistribution> => {
    return request(`/analytics/risk-distribution`);
  },

  getRailDistribution: async (): Promise<RailDistribution> => {
    return request(`/analytics/rail-distribution`);
  },

  getTrendData: async (): Promise<TrendData> => {
    return request(`/analytics/trend`);
  },

  // Graph Analytics
  getGraphScenarios: async (): Promise<GraphScenario[]> => {
    return request(`/graph/scenarios`);
  },

  analyzeGraph: async (transactions: any[]): Promise<GraphAnalysisResult> => {
    return request(`/graph/analyze`, {
      method: "POST",
      body: JSON.stringify({ transactions }),
    });
  },

  investigateCluster: async (
    transactionIds: string[],
    notes: string,
    changedBy = "Analyst Demo (Graph)"
  ): Promise<any> => {
    return request(`/graph/investigate`, {
      method: "POST",
      body: JSON.stringify({ transaction_ids: transactionIds, notes, changed_by: changedBy }),
    });
  },
};
