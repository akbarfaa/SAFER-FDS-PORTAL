/**
 * Network Graph — Data Fetching Hook
 * Handles API calls, scenario switching, dynamic data loading, and fallback logic.
 */
import { useState, useEffect } from "react";
import { useTransactionActions, useTransactions, type Transaction } from "@/lib/transaction-store";
import { createSpecificTransaction, type PaymentRail } from "@/lib/transaction-engine";
import { scoreTransaction } from "@/lib/risk-scoring";
import { generateTemplateReasoning } from "@/lib/ai-reasoning";
import { api } from "@/lib/api/api-client";
import type { GraphNode, GraphEdge, GraphScenario } from "../types";
import { STATIC_SCENARIOS } from "../constants";

export function useGraphData() {
  const { injectTransactions, updateAuditStatusBulk } = useTransactionActions();
  const allTxs = useTransactions();

  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [scenarios, setScenarios] = useState<GraphScenario[]>(STATIC_SCENARIOS);
  const [loading, setLoading] = useState(false);
  const [dynamicNodes, setDynamicNodes] = useState<GraphNode[]>([]);
  const [dynamicEdges, setDynamicEdges] = useState<GraphEdge[]>([]);
  const [dynamicInsights, setDynamicInsights] = useState<string[]>([]);
  const [selected, setSelected] = useState<GraphNode | null>(null);

  const scenario = scenarios[activeScenarioIdx] || STATIC_SCENARIOS[0];

  // Load scenarios list from API (with local static fallback)
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const remoteScenarios = await api.getGraphScenarios();
        if (remoteScenarios && remoteScenarios.length > 0) {
          const hasLive = remoteScenarios.some(s => s.id === "live-fds");
          const list = hasLive ? remoteScenarios : [...remoteScenarios, STATIC_SCENARIOS[3]];
          setScenarios(list);
        }
      } catch (err) {
        console.warn("[NetworkGraph] API scenarios not loaded. Using local fallbacks.", err);
      }
    };
    fetchScenarios();
  }, []);

  // Render scenario: fetch dynamic data or fall back to static templates
  useEffect(() => {
    const renderScenario = async () => {
      setSelected(null);
      setLoading(true);

      try {
        const payload = allTxs.map(t => ({
          id: t.raw.id,
          amount: t.raw.amount,
          payment_rail: t.raw.rail,
          severity: t.scoring.severity,
          sender_account: t.raw.senderAccount,
          sender_name: t.raw.senderName,
          sender_bank: t.raw.senderBank,
          sender_city: t.raw.senderCity,
          receiver_account: t.raw.receiverAccount,
          receiver_name: t.raw.receiverName,
          receiver_bank: t.raw.receiverBank,
          receiver_city: t.raw.receiverCity,
          merchant: t.raw.merchant,
          merchant_category: t.raw.merchantCategory,
          device_brand: t.raw.deviceBrand,
          device_type: t.raw.deviceType,
          device_fingerprint: t.raw.deviceFingerprint,
          ip_address: t.raw.ipAddress,
        }));

        const res = await api.analyzeGraph(payload);

        let filteredNodes = [...res.nodes];
        let filteredEdges = [...res.edges];
        let filteredInsights = [...res.insights];
        let useFallback = false;

        if (scenario.id === "mule-ring") {
          const collectors = res.nodes.filter(n => n.details?.["Status"] === "MULE RING COLLECTOR");
          if (collectors.length > 0) {
            const collectorIds = new Set(collectors.map(c => c.id));
            const neighborIds = new Set<string>();
            res.edges.forEach(e => {
              if (collectorIds.has(e.from)) neighborIds.add(e.to);
              if (collectorIds.has(e.to)) neighborIds.add(e.from);
            });
            const keepIds = new Set([...collectorIds, ...neighborIds]);
            filteredNodes = res.nodes.filter(n => keepIds.has(n.id));
            filteredEdges = res.edges.filter(e => keepIds.has(e.from) && keepIds.has(e.to));
            filteredInsights = [
              "🔴 LIVE NETWORK: Terdeteksi jaringan rekening penampung (Mule Ring) aktif di database.",
              ...res.insights.filter(ins => ins.includes("Mule") || ins.includes("Fan-In"))
            ];
          } else {
            useFallback = true;
          }
        } else if (scenario.id === "device-sharing") {
          const deviceHubs = res.nodes.filter(n => n.details?.["Status"] === "DEVICE FARM HUB");
          if (deviceHubs.length > 0) {
            const hubIds = new Set(deviceHubs.map(h => h.id));
            const neighborIds = new Set<string>();
            res.edges.forEach(e => {
              if (hubIds.has(e.from)) neighborIds.add(e.to);
              if (hubIds.has(e.to)) neighborIds.add(e.from);
            });
            const keepIds = new Set([...hubIds, ...neighborIds]);
            filteredNodes = res.nodes.filter(n => keepIds.has(n.id));
            filteredEdges = res.edges.filter(e => keepIds.has(e.from) && keepIds.has(e.to));
            filteredInsights = [
              "🔴 LIVE NETWORK: Terdeteksi perangkat bersama (Device Sharing Hub) aktif di database.",
              ...res.insights.filter(ins => ins.includes("Device") || ins.includes("Sharing"))
            ];
          } else {
            useFallback = true;
          }
        } else if (scenario.id === "slot-cashout") {
          const gamblingMerchants = res.nodes.filter(n => n.type === "merchant" && (n.details?.["Kategori"] === "Gambling" || n.details?.["Kategori"] === "Virtual Asset / Crypto" || n.risk === "critical"));
          if (gamblingMerchants.length > 0) {
            const merchIds = new Set(gamblingMerchants.map(m => m.id));
            const neighborIds = new Set<string>();
            res.edges.forEach(e => {
              if (merchIds.has(e.from)) neighborIds.add(e.to);
              if (merchIds.has(e.to)) neighborIds.add(e.from);
            });
            const keepIds = new Set([...merchIds, ...neighborIds]);
            filteredNodes = res.nodes.filter(n => keepIds.has(n.id));
            filteredEdges = res.edges.filter(e => keepIds.has(e.from) && keepIds.has(e.to));
            filteredInsights = [
              "🔴 LIVE NETWORK: Terdeteksi pencucian uang judi online / cashout merchant kripto.",
              ...res.insights.filter(ins => ins.includes("Judi") || ins.includes("Slot") || ins.includes("Merchant"))
            ];
          } else {
            useFallback = true;
          }
        } else if (scenario.id === "live-fds") {
          if (res.nodes.length === 0) {
            filteredInsights = ["Tidak ditemukan data transaksi berisiko aktif di database untuk divisualisasikan."];
          }
        }

        if (useFallback) {
          setDynamicNodes(scenario.nodes);
          setDynamicEdges(scenario.edges);
          setDynamicInsights([
            "ℹ️ Menampilkan simulasi studi kasus (Belum terdeteksi di database live).",
            ...scenario.insights
          ]);
          if (scenario.nodes.length > 0) setSelected(scenario.nodes[0]);

          // Build and inject demo transactions for audit lifecycle
          const scenarioTxs: Transaction[] = [];
          const baseDate = new Date();

          scenario.edges.forEach((edge, idx) => {
            const fromNode = scenario.nodes.find(n => n.id === edge.from);
            const toNode = scenario.nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return;

            let amount = 1000000;
            if (edge.label?.includes("Rp")) {
              const val = edge.label.replace(/[^0-9.]/g, "");
              if (val) amount = parseFloat(val) * 1000000;
            }

            const raw = createSpecificTransaction({
              id: `TX-GRAPH-${scenario.id}-${idx}`,
              timestamp: new Date(baseDate.getTime() - (idx * 60000)),
              senderName: fromNode.type === "account" ? fromNode.details?.["Nama Pemilik"] || fromNode.label : "System Device",
              senderAccount: fromNode.details?.["No. Rekening"] || "DEV-000",
              receiverName: toNode.type === "account" ? toNode.details?.["Nama Pemilik"] || toNode.label : toNode.label,
              receiverAccount: toNode.details?.["No. Rekening"] || "MCH-000",
              amount,
              rail: "Transfer" as PaymentRail,
              merchantCategory: toNode.type === "merchant" ? toNode.details?.["Kategori"] || "Retail" : "Transfer",
            });

            const scoring = scoreTransaction(raw);
            if (scenario.severity === "critical" || scenario.severity === "high") {
              scoring.severity = scenario.severity;
              scoring.score = scoring.severity === "critical" ? 95 : 85;
            }

            scenarioTxs.push({
              raw,
              scoring,
              aiReasoning: generateTemplateReasoning(raw, scoring),
              isReasoningLoading: false,
              auditStatus: "pending_review",
              auditNotes: `Auto-generated from Graph Scenario: ${scenario.name}`,
              auditedBy: null,
              auditedAt: null,
              auditHistory: [],
              createdAt: new Date(),
            });
          });

          injectTransactions(scenarioTxs);
        } else {
          setDynamicNodes(filteredNodes);
          setDynamicEdges(filteredEdges);
          setDynamicInsights(filteredInsights);
          if (filteredNodes.length > 0) setSelected(filteredNodes[0]);
        }
      } catch (err) {
        console.error("[NetworkGraph] Dynamic graph analysis failed:", err);
        setDynamicNodes(scenario.nodes);
        setDynamicEdges(scenario.edges);
        setDynamicInsights(scenario.insights);
        setSelected(scenario.nodes[0] || null);
      } finally {
        setLoading(false);
      }
    };

    renderScenario();
  }, [activeScenarioIdx, scenario, injectTransactions]);

  // Scenario transaction IDs for audit status tracking
  const scenarioTxIds = scenario.id === "live-fds"
    ? dynamicEdges.filter(e => e.id).map(e => e.id!)
    : scenario.edges.map((_, idx) => `TX-GRAPH-${scenario.id}-${idx}`);

  const relatedTxs = allTxs.filter(t => scenarioTxIds.includes(t.raw.id));
  const isInvestigated = relatedTxs.length > 0 && relatedTxs.every(t => t.auditStatus === "under_investigation" || t.auditStatus === "blocked");

  const handleInvestigateCluster = () => {
    const updated = dynamicNodes.map(node => ({
      ...node,
      details: {
        ...node.details,
        "Status": "DALAM INVESTIGASI",
        "Tindakan": "Diteruskan ke Tim Audit"
      }
    }));
    setDynamicNodes(updated);

    if (selected) {
      const freshSelected = updated.find(n => n.id === selected.id);
      if (freshSelected) setSelected(freshSelected);
    }

    updateAuditStatusBulk(scenarioTxIds, "under_investigation", `Tinjauan klaster dari FDS Graph: ${scenario.name}`);
  };

  return {
    // State
    scenario,
    scenarios,
    activeScenarioIdx,
    loading,
    dynamicNodes,
    dynamicEdges,
    dynamicInsights,
    selected,
    isInvestigated,
    scenarioTxIds,
    allTxs,
    // Actions
    setActiveScenarioIdx,
    setSelected,
    handleInvestigateCluster,
  };
}
