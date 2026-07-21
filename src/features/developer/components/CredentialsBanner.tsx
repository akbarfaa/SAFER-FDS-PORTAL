/**
 * Developer Hub — Credentials & Compliance Banner
 */
import { Key, ShieldCheck, Info } from "lucide-react";

interface CredentialsBannerProps {
  clientId: string;
  clientSecret: string;
  onClientIdChange: (val: string) => void;
  onClientSecretChange: (val: string) => void;
  onOpenModal: () => void;
}

export function CredentialsBanner({
  clientId,
  clientSecret,
  onClientIdChange,
  onClientSecretChange,
  onOpenModal,
}: CredentialsBannerProps) {
  const isPartner = Boolean(clientId && clientSecret);

  return (
    <div className="p-4 rounded-lg border border-border bg-surface/50 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <Key className="h-3.5 w-3.5 text-primary" /> Kredensial API Partner (Opsional)
        </h4>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
          isPartner
            ? "bg-success/20 text-success border border-success/30 animate-pulse"
            : "bg-muted text-muted-foreground border border-border"
        }`}>
          {isPartner ? "Partner Mode (Unlocked)" : "Anonymous Mode (Limited)"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-[10px] text-muted-foreground uppercase mb-1">X-Client-ID</label>
          <input
            type="text"
            placeholder="sfr_client_xxxx"
            value={clientId}
            onChange={(e) => onClientIdChange(e.target.value)}
            className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-[10px] text-muted-foreground uppercase mb-1">X-Client-Secret</label>
          <input
            type="password"
            placeholder="sfr_secret_xxxx"
            value={clientSecret}
            onChange={(e) => onClientSecretChange(e.target.value)}
            className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-1.5 border-t border-border/50 text-[11px] text-muted-foreground">
        <span>Belum punya kredensial sandbox?</span>
        <button
          type="button"
          onClick={onOpenModal}
          className="font-semibold text-primary hover:underline"
        >
          Registrasi Instan Di Sini &rarr;
        </button>
      </div>

      <div className={`mt-2 p-3 rounded border text-[11px] leading-relaxed transition-all duration-300 ${
        isPartner
          ? "bg-success/10 border-success/30 text-success-foreground"
          : "bg-primary/5 border-primary/20 text-muted-foreground"
      }`}>
        {isPartner ? (
          <div className="flex gap-2">
            <ShieldCheck className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-success">Partner Sandbox Active:</span> Kredensial terverifikasi. Kuota limit khusus instansi partner diaktifkan (unlocked hingga <strong>10.000 req/menit</strong> di cluster cloud staging) untuk memfasilitasi pengujian mobile banking terintegrasi.
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">Anonymous Mode:</span> Menggunakan sandbox publik bersama (Rate limit <strong>200 req/jam</strong>). Klik tombol registrasi di atas untuk menaikkan kuota dan mendapatkan credential partner khusus secara instan.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
