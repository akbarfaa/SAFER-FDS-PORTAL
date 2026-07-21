/**
 * Dashboard Feature — Live Transaction Stream Table Component
 */
import { formatIDR, severityStyles } from "@/lib/safer-data";
import { ArrowUpRight, Activity, Play, Zap } from "lucide-react";
import { AUDIT_STATUS_META, type Transaction } from "@/lib/transaction-store";
import { AuditStatusBadge } from "@/components/safer/AuditStatusBadge";

interface TransactionStreamTableProps {
  filteredTxs: Transaction[];
  totalCount: number;
  isFiltered: boolean;
  txs: Transaction[];
  t: (key: string) => string;
  onSelectTx: (tx: Transaction) => void;
  onToggleAuto: () => void;
  onGenerateBatch: (count?: number) => void;
}

export function TransactionStreamTable({
  filteredTxs,
  totalCount,
  isFiltered,
  txs,
  t,
  onSelectTx,
  onToggleAuto,
  onGenerateBatch,
}: TransactionStreamTableProps) {
  if (totalCount === 0) {
    return (
      <div className="mt-8 grid place-items-center rounded-xl border border-dashed border-border bg-card p-16 text-center">
        <div>
          <Activity className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <div className="mt-4 text-lg font-semibold">{t('dashboard.empty.title')}</div>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('dashboard.empty.desc') }} />
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={onToggleAuto}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Play className="h-4 w-4" /> {t('dashboard.btn.startStream')}
            </button>
            <button
              onClick={() => onGenerateBatch(5)}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-5 text-sm hover:bg-accent"
            >
              <Zap className="h-4 w-4" /> {t('dashboard.btn.genBatch')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (filteredTxs.length === 0) return null;

  return (
    <div className="mt-4 rounded-lg border border-border bg-card card-enter" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <div className="text-sm font-semibold">Live Transaction Stream</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {filteredTxs.length} of {totalCount} transactions{isFiltered ? " (filtered)" : ""}
          </div>
        </div>
        <button
          onClick={() => {
            const link = document.createElement("a");
            link.href = "/audit";
            link.click();
          }}
          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
        >
          Open audit queue <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-y border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium">{t('dashboard.col.time')}</th>
              <th className="px-4 py-2.5 text-left font-medium">{t('dashboard.col.txId')}</th>
              <th className="px-4 py-2.5 text-left font-medium">{t('dashboard.col.sender')}</th>
              <th className="px-4 py-2.5 text-left font-medium">{t('dashboard.col.receiver')}</th>
              <th className="px-4 py-2.5 text-left font-medium">Rail</th>
              <th className="px-4 py-2.5 text-left font-medium">City</th>
              <th className="px-4 py-2.5 text-right font-medium">{t('dashboard.col.amount')}</th>
              <th className="px-4 py-2.5 text-right font-medium">Score</th>
              <th className="px-4 py-2.5 text-right font-medium">{t('dashboard.col.severity')}</th>
              <th className="px-4 py-2.5 text-right font-medium">{t('dashboard.col.audit')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredTxs.slice(0, 50).map((tItem, i) => {
              const sv = severityStyles[tItem.scoring.severity];
              return (
                <tr
                  key={tItem.raw.id}
                  onClick={() => onSelectTx(tItem)}
                  className={`border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-primary/5 ${i < 3 && txs[0]?.raw.id === filteredTxs[0]?.raw.id ? "animate-in fade-in slide-in-from-top-2 duration-500" : ""}`}
                  style={i < 3 ? { animationDelay: `${i * 100}ms` } : undefined}
                >
                  <td className="px-4 py-2.5 text-xs text-muted-foreground num whitespace-nowrap">
                    {tItem.raw.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs">{tItem.raw.id}</td>
                  <td className="px-4 py-2.5 max-w-[140px] truncate">{tItem.raw.senderName}</td>
                  <td className="px-4 py-2.5 text-muted-foreground max-w-[140px] truncate">{tItem.raw.merchant}</td>
                  <td className="px-4 py-2.5"><span className="rounded bg-accent px-1.5 py-0.5 text-[10px]">{tItem.raw.rail}</span></td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{tItem.raw.senderCity}</td>
                  <td className="px-4 py-2.5 text-right num whitespace-nowrap">{formatIDR(tItem.raw.amount)}</td>
                  <td className="px-4 py-2.5 text-right num font-medium">{tItem.scoring.score}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${sv.bg} ${sv.text}`}>{sv.label}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end">
                      <AuditStatusBadge status={tItem.auditStatus} showIconOnly />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredTxs.length > 50 && (
          <div className="border-t border-border px-4 py-2.5 text-center text-xs text-muted-foreground">
            Showing 50 of {filteredTxs.length} transactions. Use filters to narrow down.
          </div>
        )}
      </div>
    </div>
  );
}
