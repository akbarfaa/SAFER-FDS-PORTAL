import { useState } from "react";
import { X, Copy, Check, ShieldCheck, Key, ArrowRight, Loader2, Mail } from "lucide-react";
import { api } from "@/lib/api/api-client";

interface LeadRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadRegistrationModal({ isOpen, onClose }: LeadRegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    position: "",
    interest_model: "SaaS Payment Gateway",
  });
  
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    client_id: string;
    client_secret: string;
    company: string;
  } | null>(null);
  
  const [copiedId, setCopiedId] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // POST registration data directly to the proxy leads endpoint
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to register lead");
      }

      const data = await response.json();
      setSuccessData({
        client_id: data.client_id,
        client_secret: data.client_secret,
        company: data.company,
      });
    } catch (error) {
      alert("Gagal melakukan registrasi. Silakan coba beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: "id" | "secret") => {
    navigator.clipboard.writeText(text);
    if (type === "id") {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!successData ? (
          /* ─── Form State ─── */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center pb-2">
              <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-bold text-foreground">Hubungi Penjualan & Registrasi</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Dapatkan kredensial API Sandbox kustom instan untuk menguji coba arsitektur payment gateway SAFER FDS.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  placeholder="Budi Santoso"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">Email Perusahaan</label>
                <input 
                  type="email" 
                  required
                  placeholder="budi@bankmitra.co.id"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">Nama Perusahaan</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Bank Mandiri / BNI"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">Jabatan / Posisi</label>
                  <input 
                    type="text" 
                    required
                    placeholder="IT Security Manager"
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">Pilihan Skema Bisnis</label>
                <select 
                  value={formData.interest_model}
                  onChange={e => setFormData({ ...formData, interest_model: e.target.value })}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-xs focus:outline-none focus:border-primary"
                >
                  <option value="SaaS Payment Gateway">SaaS Payment Gateway (Sistem Komisi Transaksi)</option>
                  <option value="Dedicated VPC Enclave">Dedicated VPC Enclave (Private Cloud/AWS)</option>
                  <option value="On-Premise Bank Server">On-Premise (Instalasi Server Lokal Bank)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded bg-primary text-xs font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Mendaftarkan...
                </>
              ) : (
                <>
                  Minta Akses Kredensial <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* ─── Success Credentials State ─── */
          <div className="space-y-4">
            <div className="text-center pb-2">
              <div className="h-10 w-10 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-2">
                <Key className="h-5 w-5 text-success" />
              </div>
              <h3 className="text-lg font-bold text-success">Registrasi Berhasil!</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Kredensial API Sandbox khusus untuk <strong>{successData.company}</strong> telah digenerate secara otomatis.
              </p>
            </div>

            <div className="space-y-3 rounded-lg border border-border bg-surface/50 p-4">
              <div>
                <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                  <span>Client ID</span>
                  <button 
                    onClick={() => copyToClipboard(successData.client_id, "id")}
                    className="flex items-center gap-1 text-[10px] text-primary hover:underline"
                  >
                    {copiedId ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    {copiedId ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="font-mono text-xs text-foreground bg-surface border border-border p-2 rounded truncate select-all">
                  {successData.client_id}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                  <span>Client Secret</span>
                  <button 
                    onClick={() => copyToClipboard(successData.client_secret, "secret")}
                    className="flex items-center gap-1 text-[10px] text-primary hover:underline"
                  >
                    {copiedSecret ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    {copiedSecret ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="font-mono text-xs text-foreground bg-surface border border-border p-2 rounded truncate select-all">
                  {successData.client_secret}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-warning/20 bg-warning/5 p-3 text-[10px] text-muted-foreground leading-relaxed">
              <span className="font-semibold text-warning">Panduan Uji Coba:</span> Kamu dapat langsung memasukkan pasangan Client ID & Secret ini di menu **API Sandbox** untuk menguji integrasi API live dengan kredensial partner kustom kamu.
            </div>

            <button 
              onClick={onClose}
              className="w-full inline-flex h-9 items-center justify-center rounded border border-border bg-card text-xs font-semibold transition-colors hover:bg-accent"
            >
              Tutup & Masuk Sandbox
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
