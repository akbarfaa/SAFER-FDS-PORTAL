/**
 * Developer Hub Route — Thin Orchestrator
 * Composes developer components from @/features/developer.
 */
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { api } from "@/lib/api/api-client";
import { LeadRegistrationModal } from "@/components/safer/LeadRegistrationModal";
import { ApiSpecs, CodeBoilerplate, PlaygroundForm } from "@/features/developer";

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

  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [amount, setAmount] = useState(2500000);
  const [paymentRail, setPaymentRail] = useState("BI-FAST");
  const [senderName, setSenderName] = useState("Eko Nugroho");
  const [receiverName, setReceiverName] = useState("Wahyu Safitri");
  const [senderBank, setSenderBank] = useState("Jago");
  const [receiverBank, setReceiverBank] = useState("Jago");

  const [isNewDevice, setIsNewDevice] = useState(false);
  const [isGeoMismatch, setIsGeoMismatch] = useState(false);
  const [isOffHours, setIsOffHours] = useState(false);
  const [hasFailedAttempts, setHasFailedAttempts] = useState(false);
  const [isVelocityAnomaly, setIsVelocityAnomaly] = useState(false);
  const [isRiskyMerchant, setIsRiskyMerchant] = useState(false);

  const [apiResponse, setApiResponse] = useState<any>(null);

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
    const payload = getPayload();
    if (activeTab === "curl") {
      codeText = `curl -X POST https://api.safer.web.id/transactions/simulate \\
  -H "Content-Type: application/json" \\
  ${clientId ? `-H "X-Client-ID: ${clientId}" \\\n  -H "X-Client-Secret: ${clientSecret}" \\\n  ` : ""}-d '${JSON.stringify(payload, null, 2)}'`;
    } else if (activeTab === "node") {
      codeText = `const axios = require('axios');
 
const payload = ${JSON.stringify(payload, null, 2)};
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
 
payload = ${JSON.stringify(payload, null, 2)}
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
      <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 mb-6">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-warning">Compliance Disclaimer (UU PDP &amp; Data Residency)</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Semua request yang dikirimkan melalui Sandbox API ini <strong>hanya boleh menggunakan data dummy / palsu</strong>. Jangan pernah mengirimkan data nasabah riil atau data pribadi (PII) ke lingkungan sandbox publik.
              Untuk penggunaan produksi dengan data transaksi riil nasabah, sistem SAFER FDS dipasang secara <strong>On-Premise / Private Cloud Enclave</strong> di dalam jaringan intranet tertutup bank Anda untuk menjamin kepatuhan penuh terhadap regulasi UU PDP.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <ApiSpecs />
          <CodeBoilerplate
            activeTab={activeTab}
            copied={copied}
            clientId={clientId}
            clientSecret={clientSecret}
            payload={getPayload()}
            onTabChange={setActiveTab}
            onCopy={handleCopyCode}
          />
        </div>

        <div className="space-y-6">
          <PlaygroundForm
            clientId={clientId}
            clientSecret={clientSecret}
            amount={amount}
            paymentRail={paymentRail}
            senderName={senderName}
            receiverName={receiverName}
            senderBank={senderBank}
            receiverBank={receiverBank}
            isNewDevice={isNewDevice}
            isGeoMismatch={isGeoMismatch}
            isOffHours={isOffHours}
            hasFailedAttempts={hasFailedAttempts}
            isVelocityAnomaly={isVelocityAnomaly}
            isRiskyMerchant={isRiskyMerchant}
            loading={loading}
            apiResponse={apiResponse}
            onClientIdChange={setClientId}
            onClientSecretChange={setClientSecret}
            onOpenModal={() => setIsModalOpen(true)}
            onAmountChange={setAmount}
            onPaymentRailChange={setPaymentRail}
            onSenderNameChange={setSenderName}
            onReceiverNameChange={setReceiverName}
            onSenderBankChange={setSenderBank}
            onReceiverBankChange={setReceiverBank}
            onNewDeviceChange={setIsNewDevice}
            onGeoMismatchChange={setIsGeoMismatch}
            onOffHoursChange={setIsOffHours}
            onFailedAttemptsChange={setHasFailedAttempts}
            onVelocityAnomalyChange={setIsVelocityAnomaly}
            onRiskyMerchantChange={setIsRiskyMerchant}
            onExecute={handleExecute}
          />
        </div>
      </div>
      <LeadRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AppShell>
  );
}
