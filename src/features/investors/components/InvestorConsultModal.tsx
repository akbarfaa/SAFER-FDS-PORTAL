import { useState } from "react";
import { TrendingUp, X, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface InvestorConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InvestorConsultModal({ isOpen, onClose }: InvestorConsultModalProps) {
  const { language } = useTranslation();
  const isEn = language === "en";

  const [formData, setFormData] = useState({
    name: "",
    firm: "",
    email: "",
    phone: "",
    interest_type: "Pre-Seed Investment",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("https://api.safer.web.id/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: `${formData.firm} (Investor Inquiry: ${formData.interest_type})`,
          position: "Investor / Strategic Partner",
          interest_model: `Investor Inquiry: ${formData.interest_type} - ${formData.message}`,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send inquiry");
      }
      setSubmitted(true);
    } catch (err) {
      alert(isEn ? "Failed to send inquiry. Please try again later." : "Terjadi kesalahan saat mengirim formulir. Silakan coba kembali.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-primary/40 bg-card shadow-2xl p-6 md:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleConsultSubmit} className="space-y-4">
            <div className="text-center pb-2">
              <TrendingUp className="h-10 w-10 text-primary mx-auto mb-2" />
              <h3 className="text-xl font-bold text-foreground">
                {isEn ? "SAFER Investor Inquiry Form" : "Konsultasi & Inquiry Investor SAFER"}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {isEn
                  ? "Submit your investment interest or strategic partnership query. Our team will respond within 24 hours."
                  : "Sampaikan minat investasi atau kemitraan strategis Anda. Tim kami akan merespons dalam 1x24 jam."}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-muted-foreground uppercase mb-1">
                  {isEn ? "Full Name" : "Nama Lengkap"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? "Your Name" : "Nama Anda"}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground uppercase mb-1">
                  {isEn ? "Company / Firm / Fund Name" : "Perusahaan / Venture Capital / Angel Fund"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? "Firm Name" : "Nama Firma / Dana Investasi"}
                  value={formData.firm}
                  onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-muted-foreground uppercase mb-1">
                    {isEn ? "Professional Email" : "Email Profesional"}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="investor@firm.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-muted-foreground uppercase mb-1">
                    {isEn ? "WhatsApp / Phone" : "Nomor WhatsApp / HP"}
                  </label>
                  <input
                    type="text"
                    placeholder="+62 812 xxxx xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground uppercase mb-1">
                  {isEn ? "Interest Category" : "Kategori Minat Diskusi"}
                </label>
                <select
                  value={formData.interest_type}
                  onChange={(e) => setFormData({ ...formData, interest_type: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Pre-Seed Investment">
                    {isEn ? "Pre-Seed Investment (Rp 150 Million)" : "Pre-Seed Investment (Pendanaan Rp 150 Juta)"}
                  </option>
                  <option value="Pilot Project Partnership">
                    {isEn ? "Pilot Project Partnership (Shadow Mode)" : "Kemitraan Pilot Project (Shadow Mode)"}
                  </option>
                  <option value="Business Advisory">
                    {isEn ? "Business & Regulatory Advisory" : "Advisori Bisnis & Regulasi"}
                  </option>
                  <option value="General Inquiry">
                    {isEn ? "General Inquiry" : "Pertanyaan Umum"}
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground uppercase mb-1">
                  {isEn ? "Message / Note" : "Pesan / Catatan Tambahan"}
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    isEn
                      ? "Briefly describe your discussion focus or investment thesis..."
                      : "Jelaskan secara ringkas fokus diskusi atau kriteria investasi Anda..."
                  }
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {isEn ? "Sending..." : "Mengirim Pesan..."}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> {isEn ? "Submit Consultation Inquiry" : "Kirim Formulir Konsultasi"}
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-foreground">
              {isEn ? "Inquiry Sent Successfully!" : "Formulir Berhasil Terkirim!"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isEn
                ? "Thank you for your interest in SAFER FDS. Your inquiry has been routed directly to the founding team (Akbar Fadhila & Team). We will reach back within 24 hours."
                : "Terima kasih atas minat Anda pada SAFER FDS. Pesan Anda telah diteruskan langsung ke tim pendiri (Akbar Fadhila & Tim). Kami akan menghubungi Anda kembali dalam waktu maksimal 1x24 jam."}
            </p>
            <button
              onClick={handleClose}
              className="rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground"
            >
              {isEn ? "Close Window" : "Tutup Halaman"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
