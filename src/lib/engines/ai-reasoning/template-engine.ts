/**
 * AI Reasoning Engine — Mode 1: Deterministic Template Reasoning
 */
import type { RawTransaction } from "../transaction";
import type { ScoringResult, Indicator } from "../../risk-scoring";
import type { Severity } from "../../safer-data";

const OPENING_PHRASES = {
  critical: [
    "Analisis menunjukkan pola anomali **sangat kritis** yang memerlukan tindakan segera.",
    "Terdeteksi kombinasi indikator berisiko tinggi yang **secara signifikan** mengindikasikan aktivitas fraud.",
    "Transaksi ini menampilkan **profil risiko ekstrem** berdasarkan analisis multi-dimensional.",
    "**PERINGATAN KRITIS**: Multiple fraud indicators terpicu secara bersamaan pada transaksi ini.",
  ],
  high: [
    "Analisis mengidentifikasi beberapa sinyal risiko yang **memerlukan investigasi segera**.",
    "Profil transaksi ini menunjukkan **deviasi signifikan** dari pola normal customer.",
    "Terdeteksi kombinasi indikator yang **meningkatkan probabilitas fraud** secara substansial.",
    "Beberapa aspek transaksi ini **tidak konsisten** dengan behavioral baseline customer.",
  ],
  medium: [
    "Analisis mendeteksi beberapa sinyal yang perlu **monitoring lebih lanjut**.",
    "Profil transaksi menunjukkan **deviasi minor** dari pola historis customer.",
    "Terdapat indikator yang **belum mencapai threshold kritis** namun patut diperhatikan.",
    "Transaksi memiliki beberapa aspek yang **sedikit di luar pattern normal**.",
  ],
  low: [
    "Profil transaksi **konsisten** dengan pola historis customer.",
    "Tidak terdeteksi anomali signifikan pada transaksi ini.",
    "Transaksi berada **dalam parameter normal** untuk profil customer.",
    "Analisis menunjukkan transaksi ini **sesuai dengan behavioral baseline**.",
  ],
};

const FRAUD_TYPE_DESCRIPTIONS: Record<string, string> = {
  "account_takeover": "account takeover (pengambilalihan akun)",
  "mule_network": "mule network operation (jaringan akun penampung)",
  "card_fraud": "card-not-present fraud",
  "identity_theft": "identity theft (pencurian identitas)",
  "social_engineering": "social engineering attack",
  "money_laundering": "money laundering pattern (pola pencucian uang)",
  "sim_swap_fraud": "SIM swap fraud",
};

function inferFraudType(tx: RawTransaction, hitIndicators: Indicator[]): string {
  const hitIds = new Set(hitIndicators.map((i) => i.id));
  if (hitIds.has("device_mismatch") || hitIds.has("sim_swap")) return "account_takeover";
  if (hitIds.has("velocity") && hitIds.has("unusual_beneficiary")) return "mule_network";
  if (tx.rail === "Kartu Kredit" && hitIds.has("geo")) return "card_fraud";
  if (hitIds.has("sim_swap")) return "sim_swap_fraud";
  if (hitIds.has("amount") && hitIds.has("cross_city")) return "money_laundering";
  if (hitIds.has("device_trust") && hitIds.has("failed_auth")) return "social_engineering";
  return "mule_network";
}

function buildIndicatorNarrative(indicators: Indicator[]): string {
  const hits = indicators.filter((i) => i.hit).sort((a, b) => b.weight - a.weight);
  if (hits.length === 0) return "";

  const parts: string[] = [];
  for (const h of hits.slice(0, 4)) {
    parts.push(h.detail);
  }
  return parts.join(". ") + ".";
}

const CLOSING_RECOMMENDATIONS: Record<Severity, string[]> = {
  critical: [
    "**Rekomendasi**: Tahan dana segera, terminasi sesi aktif, dan eskalasi ke tim fraud operations untuk investigasi menyeluruh. Pertimbangkan pemblokiran sementara akun pengirim.",
    "**Rekomendasi**: Blokir transaksi, freeze akun terkait, dan siapkan laporan insiden untuk eskalasi ke manajemen risiko.",
    "**Rekomendasi**: Auto-hold dana, notifikasi customer melalui channel terverifikasi, dan assign ke senior fraud investigator.",
  ],
  high: [
    "**Rekomendasi**: Tahan dana untuk review manual. Lakukan verifikasi identitas customer melalui callback dan periksa riwayat transaksi 30 hari terakhir.",
    "**Rekomendasi**: Eskalasi ke analyst untuk investigasi lebih lanjut. Step-up authentication diperlukan sebelum dana dilepas.",
    "**Rekomendasi**: Hold transaksi dan lakukan customer outreach melalui channel resmi untuk konfirmasi legitimasi.",
  ],
  medium: [
    "**Rekomendasi**: Tambahkan step-up authentication pada transaksi berikutnya. Monitor pola transaksi dalam 24 jam ke depan.",
    "**Rekomendasi**: Log untuk trend analysis dan aktifkan enhanced monitoring pada akun ini selama 7 hari.",
    "**Rekomendasi**: Flagging untuk review berkala. Tidak perlu tindakan segera namun perlu monitoring berkelanjutan.",
  ],
  low: [
    "**Rekomendasi**: Allow transaksi dan lanjutkan passive monitoring. Tidak diperlukan tindakan lebih lanjut.",
    "**Rekomendasi**: Transaksi aman untuk diproses. Catat dalam log rutin untuk audit trail.",
  ],
};

function pickTemplate<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateTemplateReasoning(
  tx: RawTransaction,
  result: ScoringResult,
): string {
  const hitIndicators = result.indicators.filter((i) => i.hit);
  const opening = pickTemplate(OPENING_PHRASES[result.severity]);
  const closing = pickTemplate(CLOSING_RECOMMENDATIONS[result.severity]);

  if (hitIndicators.length === 0) {
    return `${opening} Tidak ada indikator risiko material yang terpicu. Transaksi Rp ${tx.amount.toLocaleString("id-ID")} melalui ${tx.rail} dari ${tx.senderName} ke ${tx.merchant} berada dalam parameter normal. ${closing}`;
  }

  const fraudType = inferFraudType(tx, hitIndicators);
  const fraudDesc = FRAUD_TYPE_DESCRIPTIONS[fraudType] || fraudType;
  const indicatorNarrative = buildIndicatorNarrative(hitIndicators);

  const contextLine = `Transaksi sebesar **Rp ${tx.amount.toLocaleString("id-ID")}** melalui **${tx.rail}** dari **${tx.senderName}** (${tx.senderBank}, ${tx.senderCity}) ke **${tx.merchant}** pada pukul ${tx.timestamp.getHours().toString().padStart(2, "0")}:${tx.timestamp.getMinutes().toString().padStart(2, "0")} WIB.`;

  const riskLine = `Kombinasi sinyal behavioral meningkatkan probabilitas **${fraudDesc}** secara signifikan. Score risiko: **${result.score}/100** dengan **${hitIndicators.length} indikator** terpicu dari ${result.indicators.length} total parameter.`;

  return `${opening}\n\n${contextLine}\n\n${indicatorNarrative}\n\n${riskLine}\n\n${closing}`;
}
