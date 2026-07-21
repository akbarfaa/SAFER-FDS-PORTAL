/**
 * Developer Hub — Interactive Sandbox Playground Form & Response Viewer
 */
import { Terminal, Cpu, Play, Info } from "lucide-react";
import { CredentialsBanner } from "./CredentialsBanner";

interface PlaygroundFormProps {
  clientId: string;
  clientSecret: string;
  amount: number;
  paymentRail: string;
  senderName: string;
  receiverName: string;
  senderBank: string;
  receiverBank: string;
  isNewDevice: boolean;
  isGeoMismatch: boolean;
  isOffHours: boolean;
  hasFailedAttempts: boolean;
  isVelocityAnomaly: boolean;
  isRiskyMerchant: boolean;
  loading: boolean;
  apiResponse: any;
  onClientIdChange: (val: string) => void;
  onClientSecretChange: (val: string) => void;
  onOpenModal: () => void;
  onAmountChange: (val: number) => void;
  onPaymentRailChange: (val: string) => void;
  onSenderNameChange: (val: string) => void;
  onReceiverNameChange: (val: string) => void;
  onSenderBankChange: (val: string) => void;
  onReceiverBankChange: (val: string) => void;
  onNewDeviceChange: (val: boolean) => void;
  onGeoMismatchChange: (val: boolean) => void;
  onOffHoursChange: (val: boolean) => void;
  onFailedAttemptsChange: (val: boolean) => void;
  onVelocityAnomalyChange: (val: boolean) => void;
  onRiskyMerchantChange: (val: boolean) => void;
  onExecute: () => void;
}

export function PlaygroundForm({
  clientId,
  clientSecret,
  amount,
  paymentRail,
  senderName,
  receiverName,
  senderBank,
  receiverBank,
  isNewDevice,
  isGeoMismatch,
  isOffHours,
  hasFailedAttempts,
  isVelocityAnomaly,
  isRiskyMerchant,
  loading,
  apiResponse,
  onClientIdChange,
  onClientSecretChange,
  onOpenModal,
  onAmountChange,
  onPaymentRailChange,
  onSenderNameChange,
  onReceiverNameChange,
  onSenderBankChange,
  onReceiverBankChange,
  onNewDeviceChange,
  onGeoMismatchChange,
  onOffHoursChange,
  onFailedAttemptsChange,
  onVelocityAnomalyChange,
  onRiskyMerchantChange,
  onExecute,
}: PlaygroundFormProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-base font-semibold flex items-center gap-2 border-b border-border pb-4">
        <Terminal className="h-4 w-4 text-warning" /> Interactive Sandbox Playground
      </h3>

      <div className="mt-4">
        <CredentialsBanner
          clientId={clientId}
          clientSecret={clientSecret}
          onClientIdChange={onClientIdChange}
          onClientSecretChange={onClientSecretChange}
          onOpenModal={onOpenModal}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs text-muted-foreground font-medium">Amount (Rupiah)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(Number(e.target.value))}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium">Payment Rail</label>
          <select
            value={paymentRail}
            onChange={(e) => onPaymentRailChange(e.target.value)}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {["BI-FAST", "QRIS", "E-Wallet", "Kartu Debit", "Virtual Account", "RTGS", "SKN"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium">Sender Name</label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => onSenderNameChange(e.target.value)}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium">Receiver Name</label>
          <input
            type="text"
            value={receiverName}
            onChange={(e) => onReceiverNameChange(e.target.value)}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium">Sender Bank</label>
          <input
            type="text"
            value={senderBank}
            onChange={(e) => onSenderBankChange(e.target.value)}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium">Receiver Bank</label>
          <input
            type="text"
            value={receiverBank}
            onChange={(e) => onReceiverBankChange(e.target.value)}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Anomalies Toggles */}
      <div className="mt-6 border-t border-border pt-4">
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Simulate Anomaly Flags</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { id: "device", label: "New Device Swap", state: isNewDevice, set: onNewDeviceChange },
            { id: "geo", label: "Geo Location Mismatch", state: isGeoMismatch, set: onGeoMismatchChange },
            { id: "hours", label: "Off-Hours Transfer", state: isOffHours, set: onOffHoursChange },
            { id: "pin", label: "Failed Pin/OTP Attempts", state: hasFailedAttempts, set: onFailedAttemptsChange },
            { id: "vel", label: "Velocity Count Anomaly", state: isVelocityAnomaly, set: onVelocityAnomalyChange },
            { id: "merch", label: "Risky Merchant (Crypto/Gambling)", state: isRiskyMerchant, set: onRiskyMerchantChange },
          ].map((flag) => (
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

      <div className="mt-6">
        <button
          onClick={onExecute}
          disabled={loading}
          className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50 shadow-md shadow-indigo-600/20"
        >
          {loading ? <Cpu className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-white" />}
          {loading ? "Processing Sandbox Inference..." : "Send Sandbox API Request"}
        </button>
      </div>

      {/* API Server Response */}
      <div className="mt-6 border-t border-border pt-4">
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">API Server Response</h4>
        {apiResponse ? (
          <div className="space-y-4">
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

            <div className="rounded border border-border bg-muted/30 p-3">
              <div className="flex gap-2 items-start">
                <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">AI Narrative Reasoning:</span>{" "}
                  {apiResponse.ai_reasoning || "No explanation returned."}
                </div>
              </div>
            </div>

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
  );
}
