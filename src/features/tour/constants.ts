/**
 * Tour Feature — Tour Steps & Bot Theme Constants
 */

export interface TourStep {
  botState: string;
  title: string;
  body: string;
  route: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    botState: "welcome",
    title: "Halo! Saya SAFER BOT 🤖",
    body: "Saya akan mendampingi Anda menjelajahi prototipe FDS SAFER. Sebagai Fraud Analyst, Anda memiliki dashboard intelijen fraud mutakhir. Mari kita mulai!",
    route: "/",
  },
  {
    botState: "scanning",
    title: "1. Simulasi Risiko Real-time",
    body: "Di sini Anda dapat mensimulasikan transaksi secara instan. Sistem kami mengevaluasi setiap transaksi dalam waktu <150ms dengan aturan deterministik dan AI.",
    route: "/simulator",
  },
  {
    botState: "analytical",
    title: "2. Transparansi AI (Explainable AI)",
    body: "SAFER tidak hanya memberikan skor, tapi juga alasan lengkap di balik setiap penilaian. Anda bisa melihat kontribusi masing-masing indikator risiko secara detail.",
    route: "/simulator",
  },
  {
    botState: "alert",
    title: "3. Dashboard Monitoring Utama",
    body: "Di layar ini, aliran transaksi dipantau secara real-time. Anda bisa memulai/jeda aliran transaksi, memicu skenario fraud, dan melihat tren agregat.",
    route: "/dashboard",
  },
  {
    botState: "helper",
    title: "4. Antrean Audit Manual",
    body: "Di sinilah analis mengaudit transaksi mencurigakan. Anda dapat mengubah status audit transaksi, menulis catatan kepatuhan, atau melakukan aksi massal (bulk actions).",
    route: "/audit",
  },
  {
    botState: "network",
    title: "5. Visualisasi Jaringan Fraud Graph",
    body: "Gunakan Fraud Graph untuk membongkar jaringan rekening bagong (mule accounts) dan perangkat yang digunakan bersama (device sharing) yang sulit dilacak tabel biasa.",
    route: "/network",
  },
  {
    botState: "architecture",
    title: "6. Developer API Sandbox",
    body: "Untuk tim IT integrasi bank, kami menyediakan antarmuka API Sandbox interaktif. Developer dapat menyimulasikan API call secara stateless, membaca spesifikasi, dan men-generate boilerplate kode secara instan.",
    route: "/developer",
  },
  {
    botState: "secure",
    title: "7. Kepatuhan & Tata Kelola",
    body: "SAFER dirancang sesuai standar kepatuhan Bank Indonesia, OJK POJK 11, serta UU Perlindungan Data Pribadi (UU PDP) dengan perlindungan privasi ketat.",
    route: "/compliance",
  },
  {
    botState: "architecture",
    title: "8. Arsitektur Platform",
    body: "Platform SAFER mendukung integrasi API siap pakai (<2 minggu) dan dapat dideploy secara aman di cloud (VPC) privat maupun infrastruktur on-premise perbankan.",
    route: "/architecture",
  },
  {
    botState: "business",
    title: "9. Model Bisnis & Skalabilitas",
    body: "Mulai dari fintech startup hingga bank BUMN besar, kami menawarkan paket harga berbasis penggunaan yang fleksibel serta skema kolaborasi konsorsium.",
    route: "/business",
  },
  {
    botState: "welcome",
    title: "Siap Menjelajahi SAFER!",
    body: "Tur selesai! Silakan jelajahi konsol SAFER secara mandiri. Jangan ragu memicu 'Fraud Scenario' di Dashboard untuk melihat FDS beraksi secara dinamis.",
    route: "/",
  },
];

export function getBotStateTheme(state: string) {
  switch (state) {
    case "scanning":
      return { color: "rgb(168, 85, 247)", glow: "rgba(168, 85, 247, 0.2)" };
    case "analytical":
      return { color: "rgb(245, 158, 11)", glow: "rgba(245, 158, 11, 0.2)" };
    case "alert":
      return { color: "rgb(239, 68, 68)", glow: "rgba(239, 68, 68, 0.3)" };
    case "helper":
      return { color: "rgb(16, 185, 129)", glow: "rgba(16, 185, 129, 0.2)" };
    case "network":
      return { color: "rgb(6, 182, 212)", glow: "rgba(6, 182, 212, 0.2)" };
    case "secure":
      return { color: "rgb(16, 185, 129)", glow: "rgba(16, 185, 129, 0.2)" };
    case "architecture":
      return { color: "rgb(99, 102, 241)", glow: "rgba(99, 102, 241, 0.2)" };
    case "business":
      return { color: "rgb(234, 179, 8)", glow: "rgba(234, 179, 8, 0.2)" };
    case "welcome":
    default:
      return { color: "rgb(59, 130, 246)", glow: "rgba(59, 130, 246, 0.2)" };
  }
}
