/**
 * Resources Center — Knowledge Base Articles Database
 */
import { Cpu, BookOpen, ShieldCheck, Info } from "lucide-react";
import type { ReactNode } from "react";

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: ReactNode;
}

export const ARTICLES: Article[] = [
  {
    id: "what-is-fds",
    title: "Apa itu Fraud Detection System (FDS)?",
    category: "Dasar FDS",
    readTime: "5 min read",
    summary: "Panduan mendalam memahami sistem deteksi fraud, evolusi dari aturan manual (rule-based) menuju kecerdasan buatan (Machine Learning).",
    content: (
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          <strong>Fraud Detection System (FDS)</strong> adalah infrastruktur keamanan digital yang digunakan oleh institusi keuangan (bank, fintech, e-wallet) untuk memantau, mendeteksi, dan menghentikan transaksi mencurigakan secara real-time sebelum kerugian finansial terjadi.
        </p>

        <div className="my-4 rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
          <h4 className="font-semibold text-primary flex items-center gap-1.5 mb-1">
            <Info className="h-4 w-4" /> Mengapa FDS Sangat Krusial Sekarang?
          </h4>
          Dengan adopsi sistem pembayaran instan nasional seperti <strong>BI-FAST</strong> dan <strong>QRIS</strong>, dana nasabah dapat berpindah tangan hanya dalam hitungan detik. Tanpa FDS yang bekerja di bawah 150ms, bank tidak memiliki waktu untuk mendeteksi apakah transaksi tersebut sah atau hasil penipuan.
        </div>

        <h3 className="text-base font-semibold text-foreground mt-6">Evolusi Teknologi FDS: Rule-Based vs Machine Learning</h3>
        <p>
          Secara tradisional, perbankan mendeteksi fraud menggunakan aturan manual (<em>Rule-Based</em>). Namun, teknologi ini memiliki banyak kelemahan dibanding sistem modern berbasis <em>Machine Learning</em>:
        </p>

        <div className="overflow-x-auto my-4">
          <table className="w-full border-collapse border border-border text-xs text-left">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-2 border-r border-border font-semibold text-foreground">Karakteristik</th>
                <th className="p-2 border-r border-border font-semibold text-foreground">Sistem Rule-Based (Lama)</th>
                <th className="p-2 font-semibold text-foreground">Machine Learning FDS (Modern)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-2 border-r border-border font-semibold text-foreground">Fleksibilitas</td>
                <td className="p-2 border-r border-border">Kaku. Harus ditulis manual oleh analis jika ada modus baru.</td>
                <td className="p-2">Sangat fleksibel. Menemukan pola fraud baru secara otomatis dari data.</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-2 border-r border-border font-semibold text-foreground">False Positive Rate</td>
                <td className="p-2 border-r border-border">Tinggi. Memblokir transaksi nasabah sah yang tidak biasa.</td>
                <td className="p-2">Rendah. Memahami profil perilaku nasabah secara individual.</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-border font-semibold text-foreground">Waktu Proses</td>
                <td className="p-2 border-r border-border">Lambat jika rule menumpuk (menyebabkan lag transaksi).</td>
                <td className="p-2">Instan (sub-150ms) menggunakan scoring model ter-optimasi.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-base font-semibold text-foreground mt-6">Rekomendasi Implementasi</h3>
        <p>
          Pendekatan terbaik yang diusung oleh <strong>SAFER FDS</strong> adalah metode <strong>Hibrida</strong>: Menggabungkan aturan kepatuhan mutlak (*Hard-rules* seperti limit transaksi harian) dengan penilaian probabilitas *Machine Learning* untuk mendeteksi anomali perilaku yang halus.
        </p>
      </div>
    ),
  },
  {
    id: "indonesia-fraud-patterns",
    title: "Mengenal Modus Penipuan (Fraud) Digital di Indonesia",
    category: "Pola Ancaman",
    readTime: "7 min read",
    summary: "Membedah taktik rekayasa sosial dan serangan siber terpopuler di ekosistem digital Indonesia seperti sindikat rekening bagong dan manipulasi merchant.",
    content: (
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          Karakteristik kejahatan keuangan digital di Indonesia sangat unik karena mayoritas diawali oleh teknik <strong>Social Engineering</strong> (manipulasi psikologis korban) seperti telepon palsu berhadiah, undian palsu, hingga link APK kurir fiktif.
        </p>

        <h3 className="text-base font-semibold text-foreground mt-6">Tiga Modus Utama yang Paling Sering Terjadi:</h3>

        <div className="space-y-4 my-4">
          <div className="rounded-lg border border-border p-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-destructive/10 text-destructive text-xs font-bold">1</span>
              Sindikat Rekening Bagong (Mule Account Rings)
            </h4>
            <p className="mt-2 text-xs leading-relaxed">
              Pelaku kejahatan membeli atau menyewa rekening bank milik warga biasa (biasanya masyarakat pedesaan) dengan imbalan uang tunai. Rekening-rekening ini kemudian digunakan secara kolektif untuk menampung dan memutar uang hasil kejahatan sebelum akhirnya ditarik tunai. Sindikat ini biasanya mengakses banyak rekening dari satu perangkat HP (*Device Sharing*) atau alamat IP yang sama secara cepat.
            </p>
          </div>

          <div className="rounded-lg border border-border p-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-warning/10 text-warning text-xs font-bold">2</span>
              Manipulasi QRIS Palsu / Merchant Fiktif
            </h4>
            <p className="mt-2 text-xs leading-relaxed">
              Pelaku mendaftarkan merchant QRIS menggunakan identitas palsu. Korban kemudian diinduksi untuk mentransfer uang ke merchant tersebut dengan alasan investasi bodong atau transaksi belanja online palsu. Uang yang masuk ke saldo merchant langsung dicairkan secara instan (Velocity anomaly).
            </p>
          </div>

          <div className="rounded-lg border border-border p-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-indigo-600/10 text-indigo-400 text-xs font-bold">3</span>
              Account Takeover (ATO) &amp; SIM Swap
            </h4>
            <p className="mt-2 text-xs leading-relaxed">
              Pelaku mengambil alih kendali aplikasi mobile banking nasabah. Hal ini diawali dengan pembajakan kode OTP nasabah (via phising/aplikasi malware APK) atau pengambilalihan nomor SIM kartu telepon seluler (SIM Swap). Pelaku kemudian mendaftarkan aplikasi mobile banking di perangkat baru mereka (*New Device Swap*) dan langsung melakukan kuras dana keluar.
            </p>
          </div>
        </div>

        <h3 className="text-base font-semibold text-foreground mt-6">Bagaimana Mencegahnya?</h3>
        <p>
          Pencegahan tidak cukup hanya mendeteksi nominal transaksi yang besar. FDS harus mampu melacak parameter non-finansial seperti <strong>sidik jari perangkat (Device Fingerprint)</strong> untuk mendeteksi pendaftaran perangkat baru, <strong>Geo-Location Mismatch</strong> untuk mendeteksi mustahilnya perjalanan fisik nasabah, serta <strong>analisis jaringan graf</strong> untuk melacak rantai mutasi dana rekening bagong.
        </p>
      </div>
    ),
  },
  {
    id: "what-is-safer",
    title: "Bagaimana SAFER Bekerja Melindungi Finansial Anda?",
    category: "Teknologi SAFER",
    readTime: "6 min read",
    summary: "Mengenal arsitektur Smart AI Fraud & Economic Risk Intelligence dan integrasi mTLS, anonymization engine, serta Graph Intelligence.",
    content: (
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          <strong>SAFER (Smart AI Fraud &amp; Economic Risk Intelligence)</strong> dirancang khusus sebagai solusi <em>Fraud Detection System</em> enterprise generasi terbaru yang melayani perbankan dan fintech di Indonesia dengan kepatuhan hukum yang sangat ketat.
        </p>

        <h3 className="text-base font-semibold text-foreground mt-6">Tiga Pilar Utama Teknologi SAFER:</h3>

        <div className="grid gap-4 sm:grid-cols-3 my-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <Cpu className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="text-xs font-bold text-foreground">Hybrid AI Inference</h4>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              Memproses transaksi dalam waktu &lt;150ms menggabungkan rule kepatuhan dan skoring ensemble model ML (XGBoost + LightGBM).
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <BookOpen className="h-6 w-6 text-warning mx-auto mb-2" />
            <h4 className="text-xs font-bold text-foreground">Explainable AI (XAI)</h4>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              Menerjemahkan keputusan matematis AI menjadi grafik kontribusi SHAP dan narasi teks penjelasan otomatis berbahasa Indonesia.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <ShieldCheck className="h-6 w-6 text-success mx-auto mb-2" />
            <h4 className="text-xs font-bold text-foreground">Graph Intelligence</h4>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              Memetakan hubungan kompleks rekening bagong (mule account) dan pendeteksian pola device sharing secara visual.
            </p>
          </div>
        </div>

        <h3 className="text-base font-semibold text-foreground mt-6">Keamanan Tingkat Tinggi &amp; Kepatuhan UU PDP</h3>
        <p>Untuk menjamin kedaulatan data nasabah perbankan:</p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li><strong>PII Tokenizer / Anonymization Engine:</strong> Data pribadi nasabah (nama asli, nomor rekening lengkap) disamarkan sebelum data dikirim ke model ML skoring untuk menghindari paparan informasi sensitif.</li>
          <li><strong>mTLS &amp; Signed Payload:</strong> Semua pertukaran data API dikunci dengan enkripsi mTLS (<em>mutual TLS</em>) dan verifikasi tanda tangan HMAC.</li>
          <li><strong>On-Premise / Private Cloud Enclave:</strong> Sistem SAFER dapat dipasang langsung di server lokal milik bank agar data nasabah tidak pernah keluar ke internet publik.</li>
        </ul>
      </div>
    ),
  },
];
