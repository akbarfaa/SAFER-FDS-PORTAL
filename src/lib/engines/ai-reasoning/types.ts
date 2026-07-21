/**
 * AI Reasoning Engine — Types & Configuration
 */

export interface LLMConfig {
  enabled: boolean;
  provider: "groq" | "gemini" | "openrouter";
  apiKey: string;
  model?: string;
  language: "id" | "en";
}

export const DEFAULT_MODELS: Record<LLMConfig["provider"], string> = {
  groq: "llama-3.3-70b-versatile",
  gemini: "gemini-2.0-flash",
  openrouter: "meta-llama/llama-3.3-70b-instruct",
};

export const API_ENDPOINTS: Record<LLMConfig["provider"], string> = {
  groq: "https://api.groq.com/openai/v1/chat/completions",
  gemini: "https://generativelanguage.googleapis.com/v1beta/models",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
};
