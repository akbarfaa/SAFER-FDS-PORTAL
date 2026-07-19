import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { useState, useRef, useEffect, PointerEvent } from "react";
import { 
  Network as NetworkIcon, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize,
  RotateCcw,
  Check, 
  ExternalLink,
  Info,
  Search,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactionActions, useTransactions, type Transaction } from "@/lib/transaction-store";
import { createSpecificTransaction, type PaymentRail } from "@/lib/transaction-engine";
import { scoreTransaction } from "@/lib/risk-scoring";
import { generateTemplateReasoning } from "@/lib/ai-reasoning";
import { useTranslation } from "@/lib/i18n";
import { api } from "@/lib/api/api-client";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Fraud Graph · SAFER" },
      { name: "description", content: "Graph intelligence visualization of fraud networks and mule accounts." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NetworkPage,
});

interface Node {
  id: string;
  label: string;
  type: "account" | "device" | "merchant" | "ip";
  risk: "low" | "medium" | "high" | "critical";
  x: number;
  y: number;
  details?: Record<string, string>;
}

interface Edge {
  id?: string;
  from: string;
  to: string;
  label?: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  nodes: Node[];
  edges: Edge[];
  insights: string[];
}

// ─── Static Scenario Templates ──────────────────────────────────────────────
const STATIC_SCENARIOS: Scenario[] = [
  {
    id: "mule-ring",
    name: "Sindikat Rekening Bagong (Mule Ring)",
    description: "Aliran dana melingkar di mana beberapa rekening penampung mentransfer uang ke satu akun induk utama yang diakses dari satu perangkat fisik smartphone yang sama.",
    severity: "critical",
    nodes: [
      { id: "a1", label: "ACC-7821 (Utama)", type: "account", risk: "critical", x: 380, y: 220, details: { "Nama Pemilik": "Hendra Wijaya", "Bank": "BCA", "No. Rekening": "022839120", "Lokasi": "Jakarta Pusat", "Status": "Dalam Pemantauan" } },
      { id: "a2", label: "ACC-3219 (Mule)", type: "account", risk: "high", x: 200, y: 130, details: { "Nama Pemilik": "Andi Susanto", "Bank": "BNI", "No. Rekening": "018274932", "Lokasi": "Depok", "Status": "Mencurigakan" } },
      { id: "a3", label: "ACC-9912 (Mule)", type: "account", risk: "high", x: 200, y: 310, details: { "Nama Pemilik": "Siti Nurul", "Bank": "BRI", "No. Rekening": "074291843", "Lokasi": "Bekasi", "Status": "Mencurigakan" } },
      { id: "a4", label: "ACC-1188 (Mule)", type: "account", risk: "medium", x: 560, y: 130, details: { "Nama Pemilik": "Rizki Fajar", "Bank": "Mandiri", "No. Rekening": "100293848", "Lokasi": "Tangerang", "Status": "Tinjauan Ulang" } },
      { id: "a5", label: "ACC-4451 (Mule)", type: "account", risk: "medium", x: 560, y: 310, details: { "Nama Pemilik": "Dewi Lestari", "Bank": "CIMB Niaga", "No. Rekening": "053918239", "Lokasi": "Bogor", "Status": "Tinjauan Ulang" } },
      { id: "a6", label: "ACC-2207 (Target)", type: "account", risk: "low", x: 740, y: 220, details: { "Nama Pemilik": "Budi Hartono", "Bank": "Bank Jago", "No. Rekening": "502938192", "Lokasi": "Jakarta Selatan", "Status": "Aktif / Normal" } },
      { id: "d1", label: "DEV-AX91 (Shared)", type: "device", risk: "critical", x: 100, y: 220, details: { "Tipe Perangkat": "Xiaomi Redmi 12", "Fingerprint": "ax918f0a2e7c3b1", "Koneksi": "Telkomsel LTE", "Lokasi Terakhir": "Depok" } },
      { id: "d2", label: "DEV-KL44", type: "device", risk: "high", x: 380, y: 70, details: { "Tipe Perangkat": "Samsung Galaxy S22", "Fingerprint": "kl447b9d1e2a8f0", "Koneksi": "Biznet Home", "Lokasi Terakhir": "Jakarta Pusat" } },
      { id: "m1", label: "QRIS-Toko-Berkah", type: "merchant", risk: "high", x: 380, y: 370, details: { "Nama Merchant": "Toko Berkah Kelontong", "Kategori": "Retail / QRIS", "ID Merchant": "MID992810", "Kota": "Jakarta Pusat" } },
      { id: "m2", label: "QRIS-Sumber-Jaya", type: "merchant", risk: "medium", x: 700, y: 370, details: { "Nama Merchant": "Sumber Jaya Elektronik", "Kategori": "E-Commerce / QRIS", "ID Merchant": "MID881920", "Kota": "Bandung" } },
      { id: "i1", label: "IP 103.84.x.x", type: "ip", risk: "critical", x: 100, y: 70, details: { "Alamat IP": "103.84.221.18", "ISP": "Indosat Ooredoo", "Tipe": "Seluler / Dynamic", "Reputasi IP": "Buruk / Masuk Blacklist" } },
    ],
    edges: [
      { from: "a2", to: "a1", label: "Rp 24M" },
      { from: "a3", to: "a1", label: "Rp 18M" },
      { from: "a1", to: "a4", label: "Rp 30M" },
      { from: "a1", to: "a5", label: "Rp 22M" },
      { from: "a5", to: "a6", label: "Transfer" },
      { from: "d1", to: "a2" },
      { from: "d1", to: "a3" },
      { from: "d2", to: "a1" },
      { from: "d2", to: "a4" },
      { from: "i1", to: "d1" },
      { from: "a1", to: "m1" },
      { from: "a4", to: "m1" },
      { from: "a5", to: "m2" },
    ],
    insights: [
      "Indikasi Device Sharing: Rekening penampung ACC-3219 dan ACC-9912 diakses dari HP yang sama (DEV-AX91) secara bergantian dalam hitungan menit.",
      "Pola Fan-In / Fan-Out: Dana dari beberapa rekening kecil ditarik secara massal ke rekening utama ACC-7821 sebelum dialirkan ke merchant QRIS retail dalam jumlah besar.",
      "IP Address Berisiko Tinggi: Koneksi device menggunakan IP yang masuk dalam daftar pantauan sindikat pencucian uang OJK."
    ]
  },
  {
    id: "device-sharing",
    name: "Pertukaran Device Farm (Device Sharing)",
    description: "Satu perangkat fisik digunakan untuk login ke 5 akun nasabah yang berbeda secara berurutan dalam kurun waktu 2 jam — indikasi khas operasi robot atau sindikat pinjaman online fiktif.",
    severity: "high",
    nodes: [
      { id: "a1", label: "ACC-9011", type: "account", risk: "high", x: 280, y: 150, details: { "Nama Pemilik": "Dimas Saputra", "Bank": "BCA", "No. Rekening": "089123019", "Lokasi": "Surabaya", "Status": "Tinjauan Risiko" } },
      { id: "a2", label: "ACC-5044", type: "account", risk: "high", x: 200, y: 280, details: { "Nama Pemilik": "Maya Permata", "Bank": "BNI", "No. Rekening": "022910394", "Lokasi": "Surabaya", "Status": "Tinjauan Risiko" } },
      { id: "a3", label: "ACC-8812", type: "account", risk: "high", x: 380, y: 330, details: { "Nama Pemilik": "Aldo Wijaya", "Bank": "BRI", "No. Rekening": "073910382", "Lokasi": "Sidoarjo", "Status": "Tinjauan Risiko" } },
      { id: "a4", label: "ACC-2731", type: "account", risk: "medium", x: 440, y: 150, details: { "Nama Pemilik": "Agus Santoso", "Bank": "Mandiri", "No. Rekening": "100293123", "Lokasi": "Gresik", "Status": "Normal" } },
      { id: "a5", label: "ACC-1049", type: "account", risk: "medium", x: 540, y: 280, details: { "Nama Pemilik": "Lina Puspita", "Bank": "Bank Jago", "No. Rekening": "502910398", "Lokasi": "Surabaya", "Status": "Normal" } },
      { id: "d1", label: "DEV-OPPO-A5", type: "device", risk: "critical", x: 340, y: 230, details: { "Tipe Perangkat": "Oppo A5 2020", "Fingerprint": "opp5a20208c9d1", "Koneksi": "Tri Cellular", "Lokasi Terakhir": "Surabaya" } },
      { id: "i1", label: "IP 114.122.x.x", type: "ip", risk: "high", x: 100, y: 220, details: { "Alamat IP": "114.122.91.50", "ISP": "Hutchison 3", "Lokasi": "Surabaya", "Tipe": "Seluler" } },
      { id: "i2", label: "IP 180.244.x.x", type: "ip", risk: "medium", x: 620, y: 220, details: { "Alamat IP": "180.244.18.23", "ISP": "Telkomsel", "Lokasi": "Surabaya", "Tipe": "Seluler" } },
    ],
    edges: [
      { from: "d1", to: "a1", label: "Login 11:02" },
      { from: "d1", to: "a2", label: "Login 11:15" },
      { from: "d1", to: "a3", label: "Login 11:32" },
      { from: "d1", to: "a4", label: "Login 11:48" },
      { from: "d1", to: "a5", label: "Login 12:10" },
      { from: "i1", to: "d1" },
      { from: "i2", to: "d1" },
    ],
    insights: [
      "Deteksi Device Farm: Satu perangkat fisik (DEV-OPPO-A5) digunakan untuk mengakses 5 akun bank berbeda dalam kurun waktu kurang dari 2 jam.",
      "Konektivitas IP Seluler: Perangkat berpindah-pindah koneksi (Tri dan Telkomsel) demi menghindari deteksi firewall berbasis alamat IP statis.",
      "Pola Pendaftaran Sindikat: Seluruh akun dibuat dalam kurun waktu 14 hari yang sama, mengindikasikan serangan registrasi identitas palsu terkoordinasi."
    ]
  },
  {
    id: "slot-cashout",
    name: "Aliran Judi Online (Slot Cashout Ring)",
    description: "Kasus pengumpulan dana kilat (fan-in) dari berbagai akun individu dengan transaksi berfrekuensi tinggi, yang langsung dilarikan ke merchant terafiliasi perjudian dan bursa aset kripto.",
    severity: "critical",
    nodes: [
      { id: "a1", label: "ACC-1100", type: "account", risk: "low", x: 150, y: 100, details: { "Nama Pemilik": "Dimas Saputra", "Bank": "BCA", "No. Rekening": "022938190", "Lokasi": "Jakarta", "Status": "Normal" } },
      { id: "a2", label: "ACC-1101", type: "account", risk: "low", x: 120, y: 200, details: { "Nama Pemilik": "Wulan Dari", "Bank": "BNI", "No. Rekening": "019283912", "Lokasi": "Bandung", "Status": "Normal" } },
      { id: "a3", label: "ACC-1102", type: "account", risk: "medium", x: 150, y: 300, details: { "Nama Pemilik": "Bayu Wijaya", "Bank": "Mandiri", "No. Rekening": "100293129", "Lokasi": "Semarang", "Status": "Dalam Tinjauan" } },
      { id: "a4", label: "ACC-1103", type: "account", risk: "low", x: 560, y: 100, details: { "Nama Pemilik": "Sari Indah", "Bank": "CIMB Niaga", "No. Rekening": "053928192", "Lokasi": "Surabaya", "Status": "Normal" } },
      { id: "a5", label: "ACC-1104", type: "account", risk: "medium", x: 590, y: 200, details: { "Nama Pemilik": "Faisal Reza", "Bank": "Bank Jago", "No. Rekening": "502938198", "Lokasi": "Malang", "Status": "Dalam Tinjauan" } },
      { id: "a6", label: "ACC-1105", type: "account", risk: "low", x: 560, y: 300, details: { "Nama Pemilik": "Mega Utami", "Bank": "Nobu", "No. Rekening": "060293812", "Lokasi": "Medan", "Status": "Normal" } },
      { id: "a7", label: "ACC-9922 (Penampung)", type: "account", risk: "critical", x: 340, y: 200, details: { "Nama Pemilik": "OnlineBet Collection", "Bank": "BCA", "No. Rekening": "022938111", "Lokasi": "Medan", "Status": "Mencurigakan / High Risk" } },
      { id: "m1", label: "OnlineBet88", type: "merchant", risk: "critical", x: 340, y: 70, details: { "Nama Merchant": "OnlineBet88 Global", "Kategori": "Perjudian / Risky", "ID Merchant": "MID441029", "Lisensi": "None / Tidak Terdaftar" } },
      { id: "m2", label: "CryptoXchange ID", type: "merchant", risk: "critical", x: 340, y: 330, details: { "Nama Merchant": "CryptoXchange Indonesia", "Kategori": "Virtual Asset / Crypto", "ID Merchant": "MID119280", "Lokasi": "Jakarta Pusat" } },
    ],
    edges: [
      { from: "a1", to: "a7", label: "Rp 5.2M" },
      { from: "a2", to: "a7", label: "Rp 8.1M" },
      { from: "a3", to: "a7", label: "Rp 12.0M" },
      { from: "a4", to: "a7", label: "Rp 4.5M" },
      { from: "a5", to: "a7", label: "Rp 15.2M" },
      { from: "a6", to: "a7", label: "Rp 6.0M" },
      { from: "a7", to: "m1", label: "Rp 22.0M" },
      { from: "a7", to: "m2", label: "Rp 29.0M" },
    ],
    insights: [
      "Pengumpulan Dana Cepat (Fan-In): Puluhan transaksi kecil dari rekening pribadi mengalir deras ke rekening penampung ACC-9922 dalam interval waktu sangat rapat.",
      "Pelarian Dana (Fan-Out): Rekening penampung langsung mengosongkan saldo dengan mentransfer dana keluar ke merchant terafiliasi situs judi online dan bursa kripto luar negeri.",
      "Karakteristik Off-Hours: Transaksi didominasi terjadi pada jam tengah malam antara pukul 01:00 hingga 04:30 WIB."
    ]
  },
  {
    id: "live-fds",
    name: "Dynamic FDS Live Graph (NetworkX)",
    description: "Visualisasi real-time berbasis analisis graf NetworkX terhadap transaksi aktif yang tersimpan di basis data.",
    severity: "high",
    nodes: [],
    edges: [],
    insights: []
  }
];

const NODE_STYLE = {
  account: { fill: "var(--chart-1)", icon: "A", label: "Account" },
  device: { fill: "var(--chart-2)", icon: "D", label: "Device" },
  merchant: { fill: "var(--chart-4)", icon: "M", label: "Merchant" },
  ip: { fill: "var(--chart-5)", icon: "I", label: "IP" },
} as const;

const RISK_RING: Record<Node["risk"], string> = {
  low: "var(--success)",
  medium: "var(--warning)",
  high: "var(--destructive)",
  critical: "var(--critical)",
};

function NetworkPage() {
  const { t } = useTranslation();
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [scenarios, setScenarios] = useState<Scenario[]>(STATIC_SCENARIOS);
  const [loading, setLoading] = useState(false);

  const scenario = scenarios[activeScenarioIdx] || STATIC_SCENARIOS[0];

  const { injectTransactions, updateAuditStatusBulk } = useTransactionActions();
  const allTxs = useTransactions();
  
  // Dynamic state for active graph components
  const [dynamicNodes, setDynamicNodes] = useState<Node[]>([]);
  const [dynamicEdges, setDynamicEdges] = useState<Edge[]>([]);
  const [dynamicInsights, setDynamicInsights] = useState<string[]>([]);
  const [selected, setSelected] = useState<Node | null>(null);
  const [hovered, setHovered] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" } | null>(null);
  
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Load scenarios list from API (with local static fallback)
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const remoteScenarios = await api.getGraphScenarios();
        if (remoteScenarios && remoteScenarios.length > 0) {
          // Append the live analysis template if not present
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

  // Update visualizer layout and content based on selection
  useEffect(() => {
    const renderScenario = async () => {
      setSelected(null);
      setHovered(null);
      setLoading(true);

      try {
        // Map local store transactions to simple models for the API
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
          // Show full network
          if (res.nodes.length === 0) {
            filteredInsights = ["Tidak ditemukan data transaksi berisiko aktif di database untuk divisualisasikan."];
          }
        }

        if (useFallback) {
          // Standard static scenario
          setDynamicNodes(scenario.nodes);
          setDynamicEdges(scenario.edges);
          setDynamicInsights([
            "ℹ️ Menampilkan simulasi studi kasus (Belum terdeteksi di database live).",
            ...scenario.insights
          ]);
          if (scenario.nodes.length > 0) {
            setSelected(scenario.nodes[0]);
          }

          // Build and inject transactions for this scenario in local store (for demo audit lifecycle)
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
          if (filteredNodes.length > 0) {
            setSelected(filteredNodes[0]);
          }
        }
      } catch (err) {
        console.error("[NetworkGraph] Dynamic graph analysis failed:", err);
        // Fallback to static
        setDynamicNodes(scenario.nodes);
        setDynamicEdges(scenario.edges);
        setDynamicInsights(scenario.insights);
        setSelected(scenario.nodes[0] || null);
      } finally {
        setLoading(false);
      }

      setZoom(1);
      setPan({ x: 0, y: 0 });
    };

    renderScenario();
  }, [activeScenarioIdx, scenario, injectTransactions]);

  // Check if scenario is under investigation
  const scenarioTxIds = scenario.id === "live-fds" 
    ? dynamicEdges.filter(e => e.id).map(e => e.id!) 
    : scenario.edges.map((_, idx) => `TX-GRAPH-${scenario.id}-${idx}`);
  
  const relatedTxs = allTxs.filter(t => scenarioTxIds.includes(t.raw.id));
  const isInvestigated = relatedTxs.length > 0 && relatedTxs.every(t => t.auditStatus === "under_investigation" || t.auditStatus === "blocked");

  const showToast = (message: string, type: "success" | "warning" = "success") => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  };

  const byId = (id: string) => dynamicNodes.find((n) => n.id === id) || scenario.nodes.find((n) => n.id === id)!;

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === "circle" || (e.target as HTMLElement).tagName === "text") return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    showToast("Tampilan visualisasi direset ke pusat.");
  };

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

    // Update transactions status in backend and store
    updateAuditStatusBulk(scenarioTxIds, "under_investigation", `Tinjauan klaster dari FDS Graph: ${scenario.name}`);
    showToast(`Jaringan ${scenario.name} telah dimasukkan ke Antrean Audit untuk diinvestigasi.`, "success");
  };

  return (
    <AppShell title={t('network.title')} subtitle={t('network.subtitle')} hideLayout={isFullscreen}>
      
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-lg border border-border bg-card px-4 py-3 shadow-lg backdrop-blur"
          >
            {toast.type === "success" ? (
              <div className="grid h-6 w-6 place-items-center rounded-full bg-success/20 text-success">
                <Check className="h-3.5 w-3.5" />
              </div>
            ) : (
              <div className="grid h-6 w-6 place-items-center rounded-full bg-warning/20 text-warning">
                <Info className="h-3.5 w-3.5" />
              </div>
            )}
            <span className="text-xs font-semibold text-foreground">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`grid gap-4 transition-all duration-300 ${
        isFullscreen 
          ? "fixed inset-0 z-50 w-screen h-screen p-6 bg-background flex flex-row overflow-hidden gap-4" 
          : "lg:grid-cols-4"
      }`}>
        
        {/* Graph Render Area */}
        <div className={`rounded-lg border border-border bg-card overflow-hidden flex flex-col relative transition-all duration-300 ${
          isFullscreen 
            ? "flex-1 h-full" 
            : "lg:col-span-3"
        }`}>
          
          {/* Visual Header */}
          <div className="flex flex-wrap items-center justify-between border-b border-border px-5 py-3 bg-card relative z-10 gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <NetworkIcon className="h-4 w-4 text-primary" /> 
              <span>{scenario.name}</span>
              <span className={`ml-2 rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                isInvestigated 
                  ? "bg-warning/20 text-warning border border-warning/30" 
                  : scenario.severity === "critical"
                    ? "bg-critical/10 text-critical"
                    : "bg-destructive/10 text-destructive"
              }`}>
                {isInvestigated ? t('network.status.investigating') : scenario.severity}
              </span>
            </div>
            
            {/* Graph Toolbar */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="hidden md:inline text-[10px] text-muted-foreground mr-2 font-medium bg-muted/60 px-2 py-1 rounded">
                💡 Zoom: Scroll / Pinch | Pan: Drag Canvas
              </span>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`grid h-8 w-8 place-items-center rounded-md border border-border bg-surface hover:bg-accent transition-colors ${
                  isFullscreen ? "text-primary border-primary bg-primary/10" : ""
                }`}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Workspace"}
              >
                {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
              </button>
              
              <button
                onClick={resetView}
                className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface hover:bg-accent transition-colors"
                title="Reset Zoom & Pan"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              
              <button
                onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))}
                className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface hover:bg-accent transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              
              <button
                onClick={() => setZoom((z) => Math.min(2.2, z + 0.15))}
                className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface hover:bg-accent transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              
              <div className="h-4 w-px bg-border mx-1" />
              <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                Zoom: {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>

          {/* Loading Indicator for NetworkX computation */}
          {loading && (
            <div className="absolute inset-0 bg-card/65 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="mt-3 text-sm font-semibold text-foreground">Calculating Dynamic Node Relations...</div>
              <p className="mt-1 text-xs text-muted-foreground">Running layout spring embedding & PageRank hub identification</p>
            </div>
          )}

          {/* SVG Frame Canvas */}
          <div 
            ref={containerRef}
            className="relative bg-surface touch-none select-none cursor-grab active:cursor-grabbing flex-1" 
            style={{ height: isFullscreen ? "calc(100vh - 100px)" : 500 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <div className="absolute inset-0 bg-grid opacity-[0.25] pointer-events-none" />
            
            <svg 
              viewBox="0 0 820 440" 
              className="absolute inset-0 h-full w-full"
            >
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transformOrigin: "410px 220px" }}>
                
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
                  </marker>
                </defs>

                {/* Draw Edges */}
                {dynamicEdges.map((e, i) => {
                  const a = byId(e.from);
                  const b = byId(e.to);
                  if (!a || !b) return null;
                  const mx = (a.x + b.x) / 2;
                  const my = (a.y + b.y) / 2;
                  return (
                    <g key={`edge-${i}`} className="opacity-80">
                      <line
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke="var(--border)"
                        strokeWidth={1.5}
                        markerEnd="url(#arrow)"
                      />
                      {e.label && (
                        <g>
                          <rect 
                            x={mx - 22} 
                            y={my - 8} 
                            width="44" 
                            height="14" 
                            fill="var(--card)" 
                            stroke="var(--border)" 
                            strokeWidth="1" 
                            rx="4" 
                          />
                          <text 
                            x={mx} 
                            y={my + 2} 
                            textAnchor="middle" 
                            fontSize="8" 
                            fontWeight="600" 
                            fill="var(--muted-foreground)" 
                            className="num select-none"
                          >
                            {e.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Draw Nodes */}
                {dynamicNodes.map((n) => {
                  const st = NODE_STYLE[n.type];
                  const isSel = selected?.id === n.id;
                  const isHov = hovered?.id === n.id;
                  return (
                    <g 
                      key={`node-${n.id}`} 
                      className="cursor-pointer group" 
                      onClick={(e) => { e.stopPropagation(); setSelected(n); }}
                      onPointerEnter={() => setHovered(n)}
                      onPointerLeave={() => setHovered(null)}
                    >
                      <circle 
                        cx={n.x} 
                        cy={n.y} 
                        r={26} 
                        fill={RISK_RING[n.risk]} 
                        opacity={isSel ? 0.35 : isHov ? 0.22 : 0.08} 
                        className="transition-opacity duration-200" 
                      />
                      
                      <circle 
                        cx={n.x} 
                        cy={n.y} 
                        r={16} 
                        fill={st.fill} 
                        stroke={isSel ? "var(--foreground)" : "var(--card)"} 
                        strokeWidth={isSel ? 2.5 : 2} 
                        className="transition-all duration-200 shadow-sm"
                      />
                      
                      <text 
                        x={n.x} 
                        y={n.y + 4.5} 
                        textAnchor="middle" 
                        fontSize="11" 
                        fontWeight="800" 
                        fill="var(--card)"
                        className="select-none"
                      >
                        {st.icon}
                      </text>
                      
                      <text 
                        x={n.x} 
                        y={n.y + 36} 
                        textAnchor="middle" 
                        fontSize="9.5" 
                        fill={isSel ? "var(--foreground)" : "var(--muted-foreground)"} 
                        fontWeight={isSel ? "700" : "500"}
                        className="transition-colors duration-200 select-none bg-background/50"
                      >
                        {n.label.split(" ")[0]}
                      </text>
                    </g>
                  );
                })}

                {/* SVG-Nested Tooltip */}
                {hovered && (
                  <g 
                    transform={`translate(${hovered.x}, ${hovered.y - 32})`}
                    className="pointer-events-none transition-all duration-150 select-none z-30"
                  >
                    <rect 
                      x="-70" 
                      y="-36" 
                      width="140" 
                      height="40" 
                      rx="6" 
                      fill="var(--card)" 
                      stroke="var(--border)" 
                      strokeWidth="1.5" 
                    />
                    
                    <polygon points="-6,4 6,4 0,10" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                    <line x1="-5" y1="4" x2="5" y2="4" stroke="var(--card)" strokeWidth="2.5" />
                    
                    <text 
                      x="0" 
                      y="-22" 
                      textAnchor="middle" 
                      fontSize="9" 
                      fontWeight="700" 
                      fill="var(--foreground)"
                    >
                      {hovered.label}
                    </text>
                    
                    <text 
                      x="-60" 
                      y="-8" 
                      fontSize="7.5" 
                      fontWeight="bold"
                      fill="var(--muted-foreground)"
                    >
                      {NODE_STYLE[hovered.type].label.toUpperCase()}
                    </text>
                    
                    <text 
                      x="60" 
                      y="-8" 
                      textAnchor="end" 
                      fontSize="7.5" 
                      fontWeight="bold" 
                      fill={RISK_RING[hovered.risk]}
                    >
                      {hovered.risk.toUpperCase()} RISK
                    </text>
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

        {/* Sidebar Controls & Insights */}
        <div className={`space-y-4 ${
          isFullscreen 
            ? "w-[340px] shrink-0 h-full overflow-y-auto bg-card border border-border rounded-lg p-5 custom-scrollbar" 
            : ""
        }`}>
          
          {/* Scenario Selector Card */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-surface">
              {t('network.scenarios')}
            </div>
            <div className="p-3 space-y-2">
              {scenarios.map((sc, i) => {
                const scTxIds = sc.id === "live-fds"
                  ? dynamicEdges.filter(e => e.id).map(e => e.id!)
                  : sc.edges.map((_, idx) => `TX-GRAPH-${sc.id}-${idx}`);
                const scRelatedTxs = allTxs.filter(t => scTxIds.includes(t.raw.id));
                const isScInvestigated = scRelatedTxs.length > 0 && scRelatedTxs.every(t => t.auditStatus === "under_investigation" || t.auditStatus === "blocked");
                
                return (
                  <button
                    key={sc.id}
                    onClick={() => setActiveScenarioIdx(i)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex flex-col gap-1 active:scale-[0.98] ${
                      activeScenarioIdx === i
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border hover:bg-accent/60 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-foreground">{sc.name}</span>
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase ${
                        isScInvestigated
                          ? "bg-warning/20 text-warning"
                          : sc.severity === "critical"
                            ? "bg-critical/20 text-critical"
                            : "bg-destructive/20 text-destructive"
                      }`}>
                        {isScInvestigated ? t('network.status.investigating') : sc.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {sc.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Node Detail Card */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-surface">
              Detail Entitas Terpilih
            </div>
            {selected ? (
              <div className="space-y-3.5 p-5 text-xs">
                <div className="flex items-center gap-3">
                  <div 
                    className="grid h-8 w-8 place-items-center rounded-lg text-white font-black"
                    style={{ backgroundColor: NODE_STYLE[selected.type].fill }}
                  >
                    {NODE_STYLE[selected.type].icon}
                  </div>
                  <div>
                    <div className="font-mono text-sm font-bold text-foreground">{selected.label}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">
                      Tipe: {NODE_STYLE[selected.type].label}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border my-2" />

                {selected.details ? (
                  <div className="space-y-2">
                    {Object.entries(selected.details).map(([key, val]) => (
                      <div key={key} className="flex justify-between gap-4 text-xs">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-semibold text-foreground text-right">{val}</span>
                      </div>
                    ))}
                    <div className="flex justify-between gap-4 text-xs">
                      <span className="text-muted-foreground">Tingkat Risiko:</span>
                      <span 
                        className="font-bold uppercase" 
                        style={{ color: RISK_RING[selected.risk] }}
                      >
                        {selected.risk}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tingkat Risiko:</span>
                      <span className="font-bold uppercase" style={{ color: RISK_RING[selected.risk] }}>
                        {selected.risk}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-2 text-[10px] text-muted-foreground italic leading-relaxed border-t border-dashed border-border mt-3">
                  *Terhubung dengan {dynamicEdges.filter((e) => e.from === selected.id || e.to === selected.id).length} entitas lain dalam jaringan terindikasi fraud.
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button 
                    onClick={() => showToast(`Membuka berkas kasus investigasi untuk ${selected.label}...`, "warning")}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded bg-muted px-2.5 font-bold hover:bg-accent text-foreground transition-all"
                  >
                    <ExternalLink className="h-3 w-3" /> Rekam Jejak
                  </button>
                  <button
                    onClick={handleInvestigateCluster}
                    disabled={isInvestigated || scenarioTxIds.length === 0}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded bg-warning/10 border border-warning/20 hover:bg-warning/20 disabled:opacity-40 disabled:pointer-events-none text-warning font-bold transition-all shadow-sm"
                  >
                    <Search className="h-3.5 w-3.5" /> {isInvestigated ? t('network.btn.investigating') : t('network.btn.investigate')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 text-xs text-muted-foreground text-center">
                Pilih salah satu titik (node) pada graf untuk melihat detail analitik entitas.
              </div>
            )}
          </div>

          {/* Cluster Insights List */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-surface">
              Analisis Temuan Jaringan
            </div>
            <ul className="space-y-3 p-5 text-xs">
              {dynamicInsights.map((insight, idx) => (
                <li key={`insight-${idx}`} className="flex items-start gap-2.5 leading-relaxed">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    idx === 0 ? "bg-critical" : idx === 1 ? "bg-destructive" : "bg-warning"
                  }`} />
                  <span className="text-muted-foreground">
                    {insight}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>
    </AppShell>
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
