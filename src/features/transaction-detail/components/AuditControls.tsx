/**
 * Transaction Detail Feature — Audit Controls & History Component
 */
import { useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import {
  type Transaction,
  type AuditStatus,
  AUDIT_STATUS_META,
  useTransactionActions,
} from "@/lib/transaction-store";

interface AuditControlsProps {
  tx: Transaction;
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

export function AuditControls({ tx }: AuditControlsProps) {
  const actions = useTransactionActions();
  const [notes, setNotes] = useState(tx.auditNotes);
  const [selectedStatus, setSelectedStatus] = useState<AuditStatus>(tx.auditStatus);

  const handleSaveAudit = () => {
    actions.updateAuditStatus(tx.raw.id, selectedStatus, notes);
  };

  return (
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
            {AUDIT_OPTIONS.map((status) => {
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
  );
}
