/**
 * Transaction Detail Feature — 4-Block Grid Info Component
 */
import { formatIDR } from "@/lib/safer-data";
import { User, Building2, CreditCard, Smartphone, MapPin, Globe } from "lucide-react";
import type { Transaction } from "@/lib/transaction-store";

interface TransactionGridProps {
  tx: Transaction;
}

export function TransactionGrid({ tx }: TransactionGridProps) {
  return (
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

        {/* Receiver / Merchant */}
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
            <div><span className="text-muted-foreground text-xs">Ref:</span> <span className="font-mono text-[10px]">{tx.raw.id}</span></div>
          </div>
        </div>

        {/* Device & Network */}
        <div className="bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
            <Smartphone className="h-3.5 w-3.5" /> DEVICE &amp; NETWORK
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
  );
}
