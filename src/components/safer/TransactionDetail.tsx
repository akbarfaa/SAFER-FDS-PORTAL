/**
 * SAFER — Transaction Detail Drawer
 *
 * Slide-over panel showing full transaction info, AI reasoning,
 * indicator breakdown, and audit action controls.
 */

import { useState } from "react";
import {
  X,
  Brain,
  AlertOctagon,
  Clock,
  MapPin,
  CreditCard,
  Smartphone,
  Globe,
  User,
  Building2,
  ArrowRight,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatIDR, severityStyles } from "@/lib/safer-data";
import {
  type Transaction,
  type AuditStatus,
  AUDIT_STATUS_META,
  useTransactionActions,
} from "@/lib/transaction-store";
import { AuditStatusBadge } from "@/components/safer/AuditStatusBadge";

interface Props {
  transaction: Transaction;
  onClose: () => void;
}

const AUDIT_OPTIONS: AuditStatus[] = [
  "pending_review",
  "under_investigation",
  "planned_audit",
  "audited_legitimate",
  "audited_suspicious",
  "escalated",
  "blocked",
  "cleared",
];

export function TransactionDetail({ transaction: tx, onClose }: Props) {
  const actions = useTransactionActions();
  const [notes, setNotes] = useState(tx.auditNotes);
  const [selectedStatus, setSelectedStatus] = useState<AuditStatus>(tx.auditStatus);
  const [showAllIndicators, setShowAllIndicators] = useState(false);
  const s = severityStyles[tx.scoring.severity];
  const auditMeta = AUDIT_STATUS_META[tx.auditStatus];

  const handleSaveAudit = () => {
    actions.updateAuditStatus(tx.raw.id, selectedStatus, notes);
  };

  const hitIndicators = tx.scoring.indicators.filter(i => i.hit);
  const normalIndicators = tx.scoring.indicators.filter(i => !i.hit);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-2xl overflow-y-auto bg-card border-l border-border shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold">{tx.raw.id}</span>
              <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${s.bg} ${s.text}`}>
                {s.label}
              </span>
              <AuditStatusBadge status={tx.auditStatus} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {tx.raw.timestamp.toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "medium",
              })}
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {/* ── Risk Score Summary ─────────────────────────────────────── */}
          <div className={`rounded-lg border ${s.ring} ring-1 p-5`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">AI Risk Score</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="num text-5xl font-semibold tracking-tight">{tx.scoring.score}</span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Fraud Probability</div>
                <div className="num mt-1 text-2xl font-semibold">{tx.scoring.fraudProbability}%</div>
              </div>
            </div>
            {/* Score bar */}
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all duration-700 ${
                  tx.scoring.severity === "critical"
                    ? "bg-critical"
                    : tx.scoring.severity === "high"
                      ? "bg-destructive"
                      : tx.scoring.severity === "medium"
                        ? "bg-warning"
                        : "bg-success"
                }`}
                style={{ width: `${tx.scoring.score}%` }}
              />
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-md border border-border bg-surface px-3 py-2.5 text-sm">
              <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Suggested Action</div>
                <div>{tx.scoring.suggestedAction}</div>
              </div>
            </div>
          </div>

          {/* ── Transaction Details ────────────────────────────────────── */}
          <div className="rounded-lg border border-border">
            <div className="border-b border-border px-5 py-3 text-sm font-semibold">
              Transaction Details
            </div>
            <div className="grid gap-px bg-border md:grid-cols-2">
              {/* Sender */}
              <div className="bg-card p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
                  <User className="h-3.5 w-3.5" /> PENGIRIM
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground text-xs">Nama:</span> <span className="font-medium">{tx.raw.senderName}</span></div>
                  <div><span className="text-muted-foreground text-xs">Rekening:</span> <span className="font-mono text-xs">{tx.raw.senderAccount}</span></div>
                  <div><span className="text-muted-foreground text-xs">Bank:</span> {tx.raw.senderBank}</div>
                  <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" /> <span className="text-xs">{tx.raw.senderCity}, {tx.raw.senderProvince}</span></div>
                </div>
              </div>
              {/* Receiver */}
              <div className="bg-card p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
                  <Building2 className="h-3.5 w-3.5" /> PENERIMA / MERCHANT
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground text-xs">Nama:</span> <span className="font-medium">{tx.raw.receiverName}</span></div>
                  <div><span className="text-muted-foreground text-xs">Merchant:</span> {tx.raw.merchant}</div>
                  <div><span className="text-muted-foreground text-xs">Kategori:</span> {tx.raw.merchantCategory}</div>
                  <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" /> <span className="text-xs">{tx.raw.receiverCity}</span></div>
                </div>
              </div>
              {/* Transaction */}
              <div className="bg-card p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
                  <CreditCard className="h-3.5 w-3.5" /> TRANSAKSI
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground text-xs">Amount:</span> <span className="num font-semibold">{formatIDR(tx.raw.amount)}</span></div>
                  <div><span className="text-muted-foreground text-xs">Rail:</span> <span className="rounded bg-accent px-1.5 py-0.5 text-[10px]">{tx.raw.rail}</span>{tx.raw.ewalletProvider && <span className="ml-1 text-xs text-muted-foreground">({tx.raw.ewalletProvider})</span>}</div>
                  <div><span className="text-muted-foreground text-xs">Channel:</span> {tx.raw.channel}</div>
                  <div><span className="text-muted-foreground text-xs">Ref:</span> <span className="font-mono text-[10px]">{tx.raw.referenceNumber}</span></div>
                </div>
              </div>
              {/* Device & Network */}
              <div className="bg-card p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
                  <Smartphone className="h-3.5 w-3.5" /> DEVICE & NETWORK
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground text-xs">Device:</span> {tx.raw.deviceBrand} ({tx.raw.deviceType}) {tx.raw.isNewDevice && <span className="rounded bg-warning/15 px-1.5 py-0.5 text-[10px] text-warning font-medium ml-1">NEW</span>}</div>
                  <div><span className="text-muted-foreground text-xs">Fingerprint:</span> <span className="font-mono text-[10px]">{tx.raw.deviceFingerprint}</span></div>
                  <div className="flex items-center gap-1"><Globe className="h-3 w-3 text-muted-foreground" /> <span className="font-mono text-xs">{tx.raw.ipAddress}</span></div>
                  <div><span className="text-muted-foreground text-xs">Account age:</span> {tx.raw.accountAgeDays} hari</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── AI Reasoning ───────────────────────────────────────────── */}
          <div className="rounded-lg border border-border">
            <div className="flex items-center gap-2 border-b border-border px-5 py-3">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">AI Fraud Analysis</span>
              {tx.isReasoningLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
            </div>
            <div className="px-5 py-4 text-sm leading-relaxed whitespace-pre-line">
              {tx.aiReasoning || "Generating analysis…"}
            </div>
          </div>

          {/* ── Indicator Breakdown ────────────────────────────────────── */}
          <div className="rounded-lg border border-border">
            <div className="border-b border-border px-5 py-3 text-sm font-semibold">
              Indicator Breakdown ({hitIndicators.length}/{tx.scoring.indicators.length} triggered)
            </div>
            <div className="divide-y divide-border">
              {hitIndicators.map(ind => (
                <IndicatorRow key={ind.id} indicator={ind} />
              ))}
            </div>
            {normalIndicators.length > 0 && (
              <>
                <button
                  onClick={() => setShowAllIndicators(v => !v)}
                  className="flex w-full items-center justify-center gap-1.5 border-t border-border px-4 py-2 text-xs text-muted-foreground hover:bg-accent transition-colors"
                >
                  {showAllIndicators ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {showAllIndicators ? "Hide" : "Show"} {normalIndicators.length} normal indicators
                </button>
                {showAllIndicators && (
                  <div className="divide-y divide-border border-t border-border">
                    {normalIndicators.map(ind => (
                      <IndicatorRow key={ind.id} indicator={ind} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Audit Actions ──────────────────────────────────────────── */}
          <div className="rounded-lg border border-primary/30 ring-1 ring-primary/20">
            <div className="flex items-center gap-2 border-b border-border px-5 py-3">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Audit Decision</span>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as AuditStatus)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {AUDIT_OPTIONS.map(status => {
                    const meta = AUDIT_STATUS_META[status];
                    return (
                      <option key={status} value={status}>
                        {meta.label}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Audit Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan audit..."
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <button
                onClick={handleSaveAudit}
                className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Save Audit Decision
              </button>
            </div>

            {/* Audit History */}
            {tx.auditHistory.length > 0 && (
              <div className="border-t border-border">
                <div className="px-5 py-3 text-xs font-semibold text-muted-foreground">Audit History</div>
                <div className="space-y-2 px-5 pb-4">
                  {tx.auditHistory.map((entry, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">
                          {AUDIT_STATUS_META[entry.from].label}
                        </span>
                        {" → "}
                        <span className="font-medium">{AUDIT_STATUS_META[entry.to].label}</span>
                        <span className="text-muted-foreground"> · {entry.by} · {entry.at.toLocaleTimeString("id-ID")}</span>
                        {entry.notes && <div className="mt-0.5 text-muted-foreground italic">"{entry.notes}"</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function IndicatorRow({ indicator: ind }: { indicator: { id: string; label: string; weight: number; maxWeight: number; hit: boolean; detail: string; category: string } }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3">
      <div className={`h-2 w-2 shrink-0 rounded-full ${ind.hit ? "bg-destructive" : "bg-success/60"}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{ind.label}</span>
          <div className="flex items-center gap-2">
            <span className="rounded bg-accent px-1.5 py-0.5 text-[9px] text-muted-foreground">{ind.category}</span>
            <span className="num text-xs text-muted-foreground">
              {ind.hit ? `+${ind.weight}` : "0"}/{ind.maxWeight}
            </span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">{ind.detail}</div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full transition-all ${ind.hit ? "bg-destructive" : "bg-muted-foreground/20"}`}
            style={{ width: `${(ind.weight / ind.maxWeight) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
