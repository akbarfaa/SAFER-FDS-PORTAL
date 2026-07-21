/**
 * Developer Hub — API Specifications
 */
import { FileText } from "lucide-react";

export function ApiSpecs() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-base font-semibold flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" /> API Specifications
      </h3>

      <div className="mt-4 space-y-4">
        {/* Endpoint block 1 */}
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
  );
}
