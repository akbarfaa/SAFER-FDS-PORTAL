/**
 * AI Reasoning Engine — Mode 2: Dynamic LLM API Integration (Groq / Gemini / OpenRouter)
 */
import type { RawTransaction } from "../transaction";
import type { ScoringResult } from "../../risk-scoring";
import { type LLMConfig, DEFAULT_MODELS, API_ENDPOINTS } from "./types";
import { generateTemplateReasoning } from "./template-engine";

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
  const hitIndicators = result.indicators.filter((i) => i.hit);
  const indicatorDetails = result.indicators
    .map((i) => `- ${i.label}: ${i.hit ? `⚠️ TERPICU (weight: ${i.weight}/${i.maxWeight}) — ${i.detail}` : `✓ Normal — ${i.detail}`}`)
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
