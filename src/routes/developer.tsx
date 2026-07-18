import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { useState } from "react";
import { Code, Terminal, Check, Copy, Play, AlertTriangle, Cpu, FileText, Info, Key } from "lucide-react";
import { api } from "@/lib/api/api-client";
import { LeadRegistrationModal } from "@/components/safer/LeadRegistrationModal";

export const Route = createFileRoute("/developer")({
  head: () => ({
    meta: [
      { title: "Developer Hub & API Sandbox Integration · SAFER" },
      {
        name: "description",
        content:
          "Explore the SAFER FDS Developer Hub. Test stateless real-time fraud scoring API calls (/transactions/simulate) and copy ready-to-use cURL, Node.js, and Python integration boilerplate code snippets.",
      },
      {
        name: "keywords",
        content:
          "api sandbox, fds api, documentation developer bank, nodejs axios fraud api, python requests curl fds, integration boilerplate, openapi schema transactions",
      },
    ],
  }),
  component: DeveloperSandboxPage,
});

function DeveloperSandboxPage() {
  const [activeTab, setActiveTab] = useState<"curl" | "node" | "python">("curl");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Credentials & Modal State
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Playground Form State
  const [amount, setAmount] = useState(2500000);
  const [paymentRail, setPaymentRail] = useState("BI-FAST");
  const [senderName, setSenderName] = useState("Eko Nugroho");
  const [receiverName, setReceiverName] = useState("Wahyu Safitri");
  const [senderBank, setSenderBank] = useState("Jago");
  const [receiverBank, setReceiverBank] = useState("Jago");
  
  // Anomalies Flags
  const [isNewDevice, setIsNewDevice] = useState(false);
  const [isGeoMismatch, setIsGeoMismatch] = useState(false);
  const [isOffHours, setIsOffHours] = useState(false);
  const [hasFailedAttempts, setHasFailedAttempts] = useState(false);
  const [isVelocityAnomaly, setIsVelocityAnomaly] = useState(false);
  const [isRiskyMerchant, setIsRiskyMerchant] = useState(false);
  
  // API Response State
  const [apiResponse, setApiResponse] = useState<any>(null);

  // Construct request payload
  const getPayload = () => ({
    amount,
    payment_rail: paymentRail,
    sender_name: senderName,
    sender_account: "5844853373",
    sender_bank: senderBank,
    sender_city: isGeoMismatch ? "Tangerang" : "Jakarta Selatan",
    sender_province: "Banten",
    sender_lat: -6.214,
    sender_lng: 106.845,
    receiver_name: receiverName,
    receiver_account: "5713932979",
    receiver_bank: receiverBank,
    receiver_city: "Jakarta Selatan",
    receiver_province: "DKI Jakarta",
    receiver_lat: -6.214,
    receiver_lng: 106.845,
    is_new_device: isNewDevice ? 1 : 0,
    is_geo_mismatch: isGeoMismatch ? 1 : 0,
    is_off_hours: isOffHours ? 1 : 0,
    has_failed_attempts: hasFailedAttempts ? 1 : 0,
    is_velocity_anomaly: isVelocityAnomaly ? 1 : 0,
    is_risky_merchant: isRiskyMerchant ? 1 : 0,
    is_device_mismatch: isNewDevice ? 1 : 0,
    is_suspicious_ip: 0,
    is_new_account: 0,
    is_sim_swap: 0,
    is_unusual_beneficiary: 0,
    velocity_count: isVelocityAnomaly ? 12 : 1,
    geo_distance_km: isGeoMismatch ? 1250.0 : 0.0,
    ewallet_provider: "None",
    channel: "Mobile Banking",
    device_type: "Smartphone",
    device_brand: "Samsung",
    device_fingerprint: "fp_90218392",
    ip_address: "182.16.22.91",
    account_age_days: 365,
  });

  const handleCopyCode = () => {
    let codeText = "";
    if (activeTab === "curl") {
      codeText = `curl -X POST https://api.safer.web.id/transactions/simulate \\
  -H "Content-Type: application/json" \\
  ${clientId ? `-H "X-Client-ID: ${clientId}" \\\n  -H "X-Client-Secret: ${clientSecret}" \\\n  ` : ""}-d '${JSON.stringify(getPayload(), null, 2)}'`;
    } else if (activeTab === "node") {
      codeText = `const axios = require('axios');

const payload = ${JSON.stringify(getPayload(), null, 2)};
const headers = {
  'Content-Type': 'application/json'${clientId ? `,\n  'X-Client-ID': '${clientId}',\n  'X-Client-Secret': '${clientSecret}'` : ""}
};

axios.post('https://api.safer.web.id/transactions/simulate', payload, { headers })
  .then(response => {
    console.log('Risk Score:', response.data.risk_score);
    console.log('Severity:', response.data.severity);
    console.log('Reasoning:', response.data.ai_reasoning);
  })
  .catch(error => console.error('Error scoring:', error));`;
    } else if (activeTab === "python") {
      codeText = `import requests

payload = ${JSON.stringify(getPayload(), null, 2)}
headers = {
    'Content-Type': 'application/json'${clientId ? `,\n    'X-Client-ID': '${clientId}',\n    'X-Client-Secret': '${clientSecret}'` : ""}
}

response = requests.post(
    'https://api.safer.web.id/transactions/simulate',
    json=payload,
    headers=headers
)

if response.status_code == 200:
    data = response.json()
    print(f"Risk Score: {data['risk_score']}")
    print(f"Severity: {data['severity']}")
    print(f"Reasoning: {data['ai_reasoning']}")`;
    }

    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = async () => {
    setLoading(true);
    setApiResponse(null);
    try {
      const payload = getPayload();
      const headers: Record<string, string> = {};
      if (clientId) headers["X-Client-ID"] = clientId;
      if (clientSecret) headers["X-Client-Secret"] = clientSecret;
      
      const res = await api.simulateTransaction(payload, headers);
      setApiResponse(res);
    } catch (err: any) {
      setApiResponse({
        error: "Failed to connect to API Gateway",
        message: err?.message || "Check your network or server status.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Developer API Sandbox" subtitle="API integration · code generators · playground">
      
      {/* ─── Compliance Disclaimer banner ─── */}
      <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 mb-6">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-warning">Compliance Disclaimer (UU PDP & Data Residency)</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Semua request yang dikirimkan melalui Sandbox API ini <strong>hanya boleh menggunakan data dummy / palsu</strong>. Jangan pernah mengirimkan data nasabah riil atau data pribadi (PII) ke lingkungan sandbox publik. 
              Untuk penggunaan produksi dengan data transaksi riil nasabah, sistem SAFER FDS dipasang secara <strong>On-Premise / Private Cloud Enclave</strong> di dalam jaringan intranet tertutup bank Anda untuk menjamin kepatuhan penuh terhadap regulasi UU PDP.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* ─── Left Column: API Docs & Code Boilerplate ─── */}
        <div className="space-y-6">
          
          {/* Endpoint Docs */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> API Specifications
            </h3>
            
            <div className="mt-4 space-y-4">
              {/* Endpoint block */}
              <div className="border border-border rounded-md overflow-hidden">
                <div className="bg-muted/30 px-3 py-2 flex items-center gap-2 border-b border-border">
                  <span className="bg-indigo-600/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">POST</span>
                  <code className="text-xs font-mono text-foreground font-semibold">/transactions/simulate</code>
                </div>
                <div className="p-3 text-xs text-muted-foreground leading-relaxed">
                  Menilai skor risiko fraud transaksi digital secara <strong>stateless</strong> (tanpa menyimpan data ke database). Digunakan untuk integrasi uji coba awal tim IT bank.
                </div>
              </div>

              {/* Endpoint block 2 */}
              <div className="border border-border rounded-md overflow-hidden">
                <div className="bg-muted/30 px-3 py-2 flex items-center gap-2 border-b border-border">
                  <span className="bg-success/20 text-success text-[10px] font-bold px-2 py-0.5 rounded uppercase">POST</span>
                  <code className="text-xs font-mono text-foreground font-semibold">/transactions</code>
                </div>
                <div className="p-3 text-xs text-muted-foreground leading-relaxed">
                  Menilai skor risiko transaksi dan <strong>menyimpannya secara permanen</strong> di database FDS. Transaksi yang mencurigakan otomatis memicu alert merah di dashboard analis.
                </div>
              </div>
            </div>
          </div>

          {/* Code Generator Tab Block */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" /> Integration Boilerplate
              </h3>
              <button 
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1 transition-colors bg-muted/10 hover:bg-muted/30"
              >
                {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy Code"}
              </button>
            </div>
            
            {/* Tabs Navigation */}
            <div className="bg-muted/20 border-b border-border flex text-xs">
              {(["curl", "node", "python"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-[1px] ${
                    activeTab === tab 
                      ? "border-primary text-primary bg-card" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "curl" ? "cURL" : tab === "node" ? "Node.js (Axios)" : "Python (Requests)"}
                </button>
              ))}
            </div>

            {/* Code Pre Viewer */}
            <div className="p-4 bg-[#090d16] overflow-x-auto max-h-[350px]">
              <pre className="text-xs font-mono text-indigo-200 leading-relaxed">
                {activeTab === "curl" && (
                  `curl -X POST https://api.safer.web.id/transactions/simulate \\
  -H "Content-Type: application/json" \\
  ${clientId ? `-H "X-Client-ID: ${clientId}" \\\n  -H "X-Client-Secret: ${clientSecret}" \\\n  ` : ""}-d '${JSON.stringify(getPayload(), null, 2)}'`
                )}
                {activeTab === "node" && (
                  `const axios = require('axios');
 
const payload = ${JSON.stringify(getPayload(), null, 2)};
const headers = {
  'Content-Type': 'application/json'${clientId ? `,\n  'X-Client-ID': '${clientId}',\n  'X-Client-Secret': '${clientSecret}'` : ""}
};
 
axios.post('https://api.safer.web.id/transactions/simulate', payload, { headers })
  .then(response => {
    console.log('Risk Score:', response.data.risk_score);
    console.log('Severity:', response.data.severity);
    console.log('Reasoning:', response.data.ai_reasoning);
  })
  .catch(error => console.error('Error scoring:', error));`
                )}
                {activeTab === "python" && (
                  `import requests
 
payload = ${JSON.stringify(getPayload(), null, 2)}
headers = {
    'Content-Type': 'application/json'${clientId ? `,\n    'X-Client-ID': '${clientId}',\n    'X-Client-Secret': '${clientSecret}'` : ""}
}
 
response = requests.post(
    'https://api.safer.web.id/transactions/simulate',
    json=payload,
    headers=headers
)
 
if response.status_code == 200:
    data = response.json()
    print(f"Risk Score: {data['risk_score']}")
    print(f"Severity: {data['severity']}")
    print(f"Reasoning: {data['ai_reasoning']}")`
                )}
              </pre>
            </div>
          </div>
        </div>
 
        {/* ─── Right Column: Interactive Sandbox Playground ─── */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-base font-semibold flex items-center gap-2 border-b border-border pb-4">
              <Terminal className="h-4 w-4 text-warning" /> Interactive Sandbox Playground
            </h3>

            {/* API Credentials Setup */}
            <div className="mt-4 p-4 rounded-lg border border-border bg-surface/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <Key className="h-3.5 w-3.5 text-primary" /> Kredensial API Partner (Opsional)
                </h4>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                  clientId && clientSecret ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                }`}>
                  {clientId && clientSecret ? "Partner Mode" : "Anonymous Mode"}
                </span>
              </div>
              
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase mb-1">X-Client-ID</label>
                  <input
                    type="text"
                    placeholder="sfr_client_xxxx"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase mb-1">X-Client-Secret</label>
                  <input
                    type="password"
                    placeholder="sfr_secret_xxxx"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-1.5 border-t border-border/50 text-[11px] text-muted-foreground">
                <span>Belum punya kredensial sandbox?</span>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="font-semibold text-primary hover:underline"
                >
                  Registrasi Instan Di Sini &rarr;
                </button>
              </div>
            </div>
            
            {/* Input Form Fields */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-muted-foreground font-medium">Amount (Rupiah)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium">Payment Rail</label>
                <select 
                  value={paymentRail}
                  onChange={(e) => setPaymentRail(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {["BI-FAST", "QRIS", "E-Wallet", "Kartu Debit", "Virtual Account", "RTGS", "SKN"].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium">Sender Name</label>
                <input 
                  type="text" 
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium">Receiver Name</label>
                <input 
                  type="text" 
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium">Sender Bank</label>
                <input 
                  type="text" 
                  value={senderBank}
                  onChange={(e) => setSenderBank(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium">Receiver Bank</label>
                <input 
                  type="text" 
                  value={receiverBank}
                  onChange={(e) => setReceiverBank(e.target.value)}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                />
              </div>
            </div>

            {/* Toggle Switch Anomalies (2 columns) */}
            <div className="mt-6 border-t border-border pt-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Simulate Anomaly Flags</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { id: "device", label: "New Device Swap", state: isNewDevice, set: setIsNewDevice },
                  { id: "geo", label: "Geo Location Mismatch", state: isGeoMismatch, set: setIsGeoMismatch },
                  { id: "hours", label: "Off-Hours Transfer", state: isOffHours, set: setIsOffHours },
                  { id: "pin", label: "Failed Pin/OTP Attempts", state: hasFailedAttempts, set: setHasFailedAttempts },
                  { id: "vel", label: "Velocity Count Anomaly", state: isVelocityAnomaly, set: setIsVelocityAnomaly },
                  { id: "merch", label: "Risky Merchant (Crypto/Gambling)", state: isRiskyMerchant, set: setIsRiskyMerchant },
                ].map(flag => (
                  <label key={flag.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted/10 p-1.5 rounded transition-colors">
                    <input 
                      type="checkbox" 
                      checked={flag.state}
                      onChange={(e) => flag.set(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-background"
                    />
                    <span className="text-xs text-muted-foreground font-medium select-none">{flag.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit execution button */}
            <div className="mt-6">
              <button
                onClick={handleExecute}
                disabled={loading}
                className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50 shadow-md shadow-indigo-600/20"
              >
                {loading ? <Cpu className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-white" />}
                {loading ? "Processing Sandbox Inference..." : "Send Sandbox API Request"}
              </button>
            </div>

            {/* Sandbox Response Viewer */}
            <div className="mt-6 border-t border-border pt-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">API Server Response</h4>
              {apiResponse ? (
                <div className="space-y-4">
                  {/* Results summary indicators */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded border border-border bg-muted/20 p-2 text-center">
                      <div className="text-[10px] text-muted-foreground font-semibold uppercase">Risk Score</div>
                      <div className={`num text-xl font-bold mt-0.5 ${
                        apiResponse.risk_score >= 80 ? "text-destructive" : apiResponse.risk_score >= 35 ? "text-warning" : "text-success"
                      }`}>
                        {apiResponse.risk_score ?? "0"}/100
                      </div>
                    </div>
                    <div className="rounded border border-border bg-muted/20 p-2 text-center">
                      <div className="text-[10px] text-muted-foreground font-semibold uppercase">Severity</div>
                      <div className={`text-xs font-bold mt-1.5 uppercase ${
                        apiResponse.severity === "critical" ? "text-destructive" : apiResponse.severity === "high" || apiResponse.severity === "medium" ? "text-warning" : "text-success"
                      }`}>
                        {apiResponse.severity ?? "LOW"}
                      </div>
                    </div>
                    <div className="rounded border border-border bg-muted/20 p-2 text-center">
                      <div className="text-[10px] text-muted-foreground font-semibold uppercase">Decision</div>
                      <div className="text-[10px] font-bold mt-1.5 text-foreground leading-tight">
                        {apiResponse.risk_score >= 80 ? "BLOCK TRANSACTION" : apiResponse.risk_score >= 35 ? "PENDING REVIEW" : "ALLOW TRANSACTION"}
                      </div>
                    </div>
                  </div>

                  {/* AI Narrative block */}
                  <div className="rounded border border-border bg-muted/30 p-3">
                    <div className="flex gap-2 items-start">
                      <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-foreground">AI Narrative Reasoning:</span>{" "}
                        {apiResponse.ai_reasoning || "No explanation returned."}
                      </div>
                    </div>
                  </div>

                  {/* Full JSON viewer */}
                  <div className="rounded border border-border bg-[#090d16] p-3 max-h-[220px] overflow-y-auto">
                    <pre className="text-[10px] font-mono text-emerald-400">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="rounded border border-border border-dashed p-8 text-center text-xs text-muted-foreground">
                  Lakukan konfigurasi form di atas lalu klik tombol kirim untuk melihat respon API secara langsung.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <LeadRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AppShell>
  );
}
