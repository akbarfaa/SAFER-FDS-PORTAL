import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, AlertTriangle, ShieldCheck, Cpu, ArrowRight, HelpCircle, FileText, Info } from "lucide-react";
import { Logo } from "@/components/safer/Logo";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources & Insights Center · SAFER" },
      { name: "description", content: "Pusat edukasi dan panduan teknologi fraud: Apa itu FDS, jenis penipuan digital di Indonesia, dan cara kerja SAFER." },
      { name: "keywords", content: "apa itu fds, fraud detection system indonesia, cara kerja fds, jenis fraud perbankan, rekening bagong, smart ai safer" }
    ],
  }),
  component: ResourcesPage,
});

// Articles Database
const ARTICLES = [
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
    )
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
              Account Takeover (ATO) & SIM Swap
            </h4>
            <p className="mt-2 text-xs leading-relaxed">
              Pelaku mengambil alih kendali aplikasi mobile banking nasabah. Hal ini diawali dengan pembajakan kode OTP nasabah (via phising/aplikasi malware APK) atau pengambilalihan nomor SIM kartu telepon seluler (SIM Swap). Pelaku kemudian mendaftarkan aplikasi mobile banking di perangkat baru mereka (*New Device Swap*) dan langsung melakukan kuras dana keluar.
            </p>
          </div>
        </div>

        <h3 className="text-base font-semibold text-foreground mt-6">Bagaimana Mencegahnya?</h3>
        <p>
          Pencegahan tidak cukup hanya mendeteksi nominal transaksi yang besar. FDS harus mampu melacak parameter non-finansial seperti **sidik jari perangkat (Device Fingerprint)** untuk mendeteksi pendaftaran perangkat baru, **Geo-Location Mismatch** untuk mendeteksi mustahilnya perjalanan fisik nasabah, serta **analisis jaringan graf** untuk melacak rantai mutasi dana rekening bagong.
        </p>
      </div>
    )
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
          <strong>SAFER (Smart AI Fraud & Economic Risk Intelligence)</strong> dirancang khusus sebagai solusi *Fraud Detection System* enterprise generasi terbaru yang melayani perbankan dan fintech di Indonesia dengan kepatuhan hukum yang sangat ketat.
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

        <h3 className="text-base font-semibold text-foreground mt-6">Keamanan Tingkat Tinggi & Kepatuhan UU PDP</h3>
        <p>
          Untuk menjamin kedaulatan data nasabah perbankan:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li><strong>PII Tokenizer / Anonymization Engine:</strong> Data pribadi nasabah (nama asli, nomor rekening lengkap) disamarkan sebelum data dikirim ke model ML skoring untuk menghindari paparan informasi sensitif.</li>
          <li><strong>mTLS & Signed Payload:</strong> Semua pertukaran data API dikunci dengan enkripsi mTLS (*mutual TLS*) dan verifikasi tanda tangan HMAC.</li>
          <li><strong>On-Premise / Private Cloud Enclave:</strong> Sistem SAFER dapat dipasang langsung di server lokal milik bank agar data nasabah tidak pernah keluar ke internet publik.</li>
        </ul>
      </div>
    )
  }
];

function ResourcesPage() {
  const [selectedArticleId, setSelectedArticleId] = useState<string>("what-is-fds");
  
  const activeArticle = ARTICLES.find(a => a.id === selectedArticleId) || ARTICLES[0];

  return (
    <div className="min-h-screen w-full bg-surface text-foreground flex flex-col">
      
      {/* ─── Top Public Navbar ─── */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/compliance" className="text-muted-foreground hover:text-foreground transition-colors">Kepatuhan</Link>
            <Link to="/developer" className="text-muted-foreground hover:text-foreground transition-colors">API Sandbox</Link>
            <span className="text-primary font-semibold border-b-2 border-primary py-5">Edukasi & Insights</span>
          </nav>

          <Link 
            to="/dashboard" 
            className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-600/10 transition-colors hover:bg-indigo-500"
          >
            Buka Konsol Analis
          </Link>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-12">
        {/* Top Title Bar */}
        <div className="rounded-lg border border-border bg-card p-6 mb-8">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" /> Pusat Pengetahuan & Insights Fraud
          </h3>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-3xl">
            Selamat datang di Pusat Edukasi SAFER. Di sini kami merangkum pemahaman dasar tentang FDS perbankan, analisis pola penipuan keuangan digital terbaru di Indonesia, serta dokumentasi bagaimana arsitektur AI kami membantu mengamankan transaksi finansial.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Article Selector List */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider pl-1">Daftar Panduan & Artikel</h4>
            <div className="space-y-2">
              {ARTICLES.map((article) => {
                const isActive = article.id === selectedArticleId;
                return (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticleId(article.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      isActive 
                        ? "border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/5" 
                        : "border-border bg-card hover:bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-indigo-400">{article.category}</span>
                      <span className="text-[10px] text-muted-foreground">{article.readTime}</span>
                    </div>
                    <h4 className="mt-1.5 text-sm font-semibold text-foreground line-clamp-1">{article.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{article.summary}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-indigo-400">
                      Baca Selengkapnya <ArrowRight className="h-3 w-3" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Demo CTA Box */}
            <div className="rounded-lg border border-border bg-card p-4 text-center mt-6">
              <HelpCircle className="h-8 w-8 text-warning mx-auto mb-2" />
              <h5 className="text-xs font-bold text-foreground">Tertarik Menguji Coba Integrasi API?</h5>
              <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed">
                Dapatkan akses langsung ke Sandbox FDS Developer Hub untuk mensimulasikan skoring secara mandiri dengan mengajukan demo.
              </p>
              <div className="mt-4">
                <span className="inline-block text-[10px] font-bold text-warning border border-warning/30 bg-warning/5 px-2.5 py-1.5 rounded uppercase">
                  Akses API Sandbox Tersedia via Request Demo
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Article Reading Pane */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-border bg-card p-6 md:p-8">
              {/* Article Header */}
              <div className="border-b border-border pb-4 mb-6">
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded uppercase">{activeArticle.category}</span>
                  <span className="text-muted-foreground font-medium">{activeArticle.readTime}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mt-3 leading-tight">{activeArticle.title}</h2>
              </div>

              {/* Article Body Content */}
              <div className="prose prose-invert max-w-none">
                {activeArticle.content}
              </div>

              {/* Article Footer Disclaimer */}
              <div className="mt-8 border-t border-border pt-4 text-[10px] text-muted-foreground flex gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Catatan Edukasi:</strong> Artikel ini dirancang oleh Tim Riset Inovasi SAFER untuk kepentingan edukasi, pelatihan, dan dokumentasi platform evaluasi FDS perbankan nasional.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-background border-t border-border mt-auto">
        <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <Logo />
              <p className="mt-3 max-w-md text-xs text-muted-foreground">
                SAFER — Smart AI Fraud & Economic Risk Intelligence. Built for Indonesia&apos;s digital financial ecosystem.
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} SAFER. Prototype for demonstration purposes.
            </div>
          </div>
          <div className="rounded-lg border border-warning/20 bg-warning/5 p-4 text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-warning">Pernyataan Penyangkalan (Disclaimer Industri):</span> Seluruh data transaksi, nama nasabah, nomor rekening, alamat IP, data logikal perangkat, dan visualisasi jaringan hubungan yang disajikan dalam purwarupa (prototype) FDS SAFER ini adalah data sintetis rekayasa buatan. Purwarupa ini dibuat khusus untuk keperluan demonstrasi dan simulasi operasional deteksi fraud industri keuangan digital Indonesia. Tidak menggunakan data nasabah riil atau transaksi finansial nyata dari institusi manapun.
          </div>
        </div>
      </footer>
    </div>
  );
}
