/**
 * SAFER — Dual-Mode AI Reasoning Engine
 *
 * Mode 1 (default): Sophisticated template-based reasoning that generates
 *   natural-sounding analysis without any external API calls.
 * Mode 2 (optional): Calls an external LLM API (Groq / Gemini / OpenRouter)
 *   for truly dynamic natural language reasoning.
 *
 * Both modes produce analyst-quality fraud reasoning text suitable for
 * a Bank Indonesia hackathon demo.
 */

import type { RawTransaction } from "./transaction-engine";
import type { ScoringResult, Indicator } from "./risk-scoring";
import type { Severity } from "./safer-data";

// ─── Configuration ──────────────────────────────────────────────────────────

export interface LLMConfig {
  enabled: boolean;
  provider: "groq" | "gemini" | "openrouter";
  apiKey: string;
  model?: string;
  language: "id" | "en";
}

const DEFAULT_MODELS: Record<LLMConfig["provider"], string> = {
  groq: "llama-3.3-70b-versatile",
  gemini: "gemini-2.0-flash",
  openrouter: "meta-llama/llama-3.3-70b-instruct",
};

const API_ENDPOINTS: Record<LLMConfig["provider"], string> = {
  groq: "https://api.groq.com/openai/v1/chat/completions",
  gemini: "https://generativelanguage.googleapis.com/v1beta/models",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
};

// ─── Template Reasoning (Mode 1) ────────────────────────────────────────────

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
  const hitIds = new Set(hitIndicators.map(i => i.id));
  if (hitIds.has("device_mismatch") || hitIds.has("sim_swap")) return "account_takeover";
  if (hitIds.has("velocity") && hitIds.has("unusual_beneficiary")) return "mule_network";
  if (tx.rail === "Kartu Kredit" && hitIds.has("geo")) return "card_fraud";
  if (hitIds.has("sim_swap")) return "sim_swap_fraud";
  if (hitIds.has("amount") && hitIds.has("cross_city")) return "money_laundering";
  if (hitIds.has("device_trust") && hitIds.has("failed_auth")) return "social_engineering";
  return "mule_network";
}

function buildIndicatorNarrative(indicators: Indicator[]): string {
  const hits = indicators.filter(i => i.hit).sort((a, b) => b.weight - a.weight);
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

/**
 * Generate template-based reasoning — no API needed.
 * Produces analyst-quality natural language reasoning.
 */
export function generateTemplateReasoning(
  tx: RawTransaction,
  result: ScoringResult,
): string {
  const hitIndicators = result.indicators.filter(i => i.hit);
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

// ─── LLM API Reasoning (Mode 2) ────────────────────────────────────────────

function buildSystemPrompt(language: "id" | "en"): string {
  if (language === "id") {
    return `Anda adalah Senior Fraud Analyst AI di platform SAFER (Secure AI Fraud & Risk Engine), sebuah sistem fraud detection untuk ekosistem keuangan digital Indonesia. 

Tugas Anda:
1. Analisis transaksi keuangan yang diberikan berdasarkan risk score dan indikator yang terdeteksi
2. Berikan penjelasan reasoning yang jelas, terstruktur, dan dapat dipahami oleh fraud analyst manusia
3. Jelaskan MENGAPA transaksi ini mencurigakan (atau tidak), berdasarkan pola, konteks, dan indikator
4. Berikan rekomendasi tindakan yang spesifik

Guidelines:
- Gunakan bahasa Indonesia yang profesional dan teknis
- Sebut detail spesifik (angka, waktu, lokasi) dari data transaksi
- Jelaskan implikasi dari setiap indikator yang terpicu
- Hubungkan indikator satu sama lain untuk menunjukkan pola
- Gunakan bold (**teks**) untuk emphasis pada poin penting
- Tulis dalam 2-4 paragraf yang ringkas tapi informatif
- JANGAN gunakan bullet points, tulis sebagai paragraf narasi
- Akhiri dengan rekomendasi tindakan yang jelas`;
  }

  return `You are a Senior Fraud Analyst AI at SAFER (Secure AI Fraud & Risk Engine), a fraud detection system for Indonesia's digital financial ecosystem.

Your task:
1. Analyze the given financial transaction based on risk score and triggered indicators
2. Provide clear, structured reasoning understandable by human fraud analysts
3. Explain WHY the transaction is suspicious (or not), based on patterns, context, and indicators
4. Provide specific action recommendations

Guidelines:
- Use professional, technical language
- Reference specific details (amounts, times, locations) from the transaction data
- Explain implications of each triggered indicator
- Connect indicators to show patterns
- Use bold (**text**) for emphasis on key points
- Write in 2-4 concise but informative paragraphs
- Do NOT use bullet points, write as narrative paragraphs
- End with a clear action recommendation`;
}

function buildUserPrompt(tx: RawTransaction, result: ScoringResult, language: "id" | "en"): string {
  const hitIndicators = result.indicators.filter(i => i.hit);
  const indicatorDetails = result.indicators
    .map(i => `- ${i.label}: ${i.hit ? `⚠️ TERPICU (weight: ${i.weight}/${i.maxWeight}) — ${i.detail}` : `✓ Normal — ${i.detail}`}`)
    .join("\n");

  return `Analyze this transaction:

TRANSACTION DATA:
- TX ID: ${tx.id}
- Timestamp: ${tx.timestamp.toISOString()}
- Amount: Rp ${tx.amount.toLocaleString("id-ID")}
- Payment Rail: ${tx.rail}${tx.ewalletProvider ? ` (${tx.ewalletProvider})` : ""}
- Sender: ${tx.senderName} (${tx.senderBank}, ${tx.senderCity}, ${tx.senderProvince})
- Receiver: ${tx.receiverName} (${tx.receiverBank}, ${tx.receiverCity})
- Merchant: ${tx.merchant} (Category: ${tx.merchantCategory})
- Channel: ${tx.channel}
- Device: ${tx.deviceBrand} (${tx.deviceType}) ${tx.isNewDevice ? "— NEW DEVICE" : ""}
- IP: ${tx.ipAddress}
- Account Age: ${tx.accountAgeDays} days

RISK ASSESSMENT:
- Risk Score: ${result.score}/100
- Severity: ${result.severity.toUpperCase()}
- Fraud Probability: ${result.fraudProbability}%
- Suggested Action: ${result.suggestedAction}

INDICATORS (${hitIndicators.length}/${result.indicators.length} triggered):
${indicatorDetails}

${language === "id" ? "Berikan analisis reasoning dalam Bahasa Indonesia." : "Provide reasoning analysis in English."}`;
}

/**
 * Call external LLM API for reasoning.
 * Falls back to template reasoning on error.
 */
export async function generateLLMReasoning(
  tx: RawTransaction,
  result: ScoringResult,
  config: LLMConfig,
): Promise<string> {
  if (!config.enabled || !config.apiKey) {
    return generateTemplateReasoning(tx, result);
  }

  const model = config.model || DEFAULT_MODELS[config.provider];
  const systemPrompt = buildSystemPrompt(config.language);
  const userPrompt = buildUserPrompt(tx, result, config.language);

  try {
    if (config.provider === "gemini") {
      return await callGemini(config.apiKey, model, systemPrompt, userPrompt);
    }
    // OpenAI-compatible API (Groq, OpenRouter)
    return await callOpenAICompatible(
      API_ENDPOINTS[config.provider],
      config.apiKey,
      model,
      systemPrompt,
      userPrompt,
      config.provider,
    );
  } catch (err) {
    console.warn("[SAFER AI] LLM API call failed, falling back to template:", err);
    return generateTemplateReasoning(tx, result);
  }
}

async function callOpenAICompatible(
  endpoint: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  provider: string,
): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  if (provider === "openrouter") {
    headers["HTTP-Referer"] = window.location.origin;
    headers["X-Title"] = "SAFER Fraud Intelligence";
  }

  const resp = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!resp.ok) {
    throw new Error(`LLM API ${resp.status}: ${await resp.text()}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || "Reasoning generation failed.";
}

async function callGemini(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const endpoint = `${API_ENDPOINTS.gemini}/${model}:generateContent?key=${apiKey}`;

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    }),
  });

  if (!resp.ok) {
    throw new Error(`Gemini API ${resp.status}: ${await resp.text()}`);
  }

  const data = await resp.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Reasoning generation failed.";
}

/**
 * Test if the LLM API connection works.
 */
export async function testLLMConnection(config: LLMConfig): Promise<{ ok: boolean; message: string }> {
  if (!config.apiKey) return { ok: false, message: "API key tidak ditemukan" };

  try {
    const model = config.model || DEFAULT_MODELS[config.provider];
    const testPrompt = "Respond with exactly: SAFER AI connection successful";

    if (config.provider === "gemini") {
      await callGemini(config.apiKey, model, "You are a test assistant.", testPrompt);
    } else {
      await callOpenAICompatible(
        API_ENDPOINTS[config.provider],
        config.apiKey,
        model,
        "You are a test assistant.",
        testPrompt,
        config.provider,
      );
    }
    return { ok: true, message: `Terhubung ke ${config.provider} (${model})` };
  } catch (err) {
    return { ok: false, message: `Gagal: ${err instanceof Error ? err.message : String(err)}` };
  }
}
