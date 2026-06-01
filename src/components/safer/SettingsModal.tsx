/**
 * SAFER — Settings Modal
 *
 * Configuration dialog for LLM API, simulation settings, and demo controls.
 */

import { useState, useEffect } from "react";
import { X, Zap, Brain, Settings, RotateCcw, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useTransactionActions } from "@/lib/transaction-store";
import { testLLMConnection, type LLMConfig } from "@/lib/ai-reasoning";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: Props) {
  const actions = useTransactionActions();

  // LLM settings
  const [llmEnabled, setLlmEnabled] = useState(actions.llmConfig.enabled);
  const [provider, setProvider] = useState<LLMConfig["provider"]>(actions.llmConfig.provider);
  const [apiKey, setApiKey] = useState(actions.llmConfig.apiKey);
  const [language, setLanguage] = useState<"id" | "en">(actions.llmConfig.language);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Simulation settings
  const [interval, setInterval_] = useState(actions.autoIntervalMs / 1000);
  const [batchSize, setBatchSize] = useState(actions.batchSize);
  const [fraudRatio, setFraudRatio] = useState(Math.round(actions.fraudRatio * 100));

  useEffect(() => {
    if (open) {
      setLlmEnabled(actions.llmConfig.enabled);
      setProvider(actions.llmConfig.provider);
      setApiKey(actions.llmConfig.apiKey);
      setLanguage(actions.llmConfig.language);
      setInterval_(actions.autoIntervalMs / 1000);
      setBatchSize(actions.batchSize);
      setFraudRatio(Math.round(actions.fraudRatio * 100));
      setTestResult(null);
    }
  }, [open, actions]);

  const handleSave = () => {
    actions.llmConfig = { enabled: llmEnabled, provider, apiKey, language };
    actions.autoIntervalMs = interval * 1000;
    actions.batchSize = batchSize;
    actions.fraudRatio = fraudRatio / 100;
    onClose();
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await testLLMConnection({ enabled: true, provider, apiKey, language });
    setTestResult(result);
    setIsTesting(false);
  };

  const handleReset = () => {
    if (confirm("Reset semua transaksi? Data akan hilang.")) {
      actions.reset();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Settings className="h-4 w-4 text-primary" /> Settings
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-accent transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* ── AI Reasoning ──────────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 text-sm font-semibold mb-4">
              <Brain className="h-4 w-4 text-primary" /> AI Reasoning Engine
            </div>

            <div className="space-y-3">
              <div className="rounded-md border border-border bg-surface px-3 py-2.5 text-xs text-muted-foreground">
                <span className="font-semibold text-primary block mb-1">Template Reasoning Mode Active</span>
                AI analysis is generated offline (tanpa API call) menggunakan template dinamis untuk stabilitas demonstrasi. Reasoning tetap disajikan secara natural dan informatif.
              </div>
            </div>
          </section>

          {/* ── Simulation Settings ───────────────────────────────────── */}
          <section className="border-t border-border pt-6">
            <div className="flex items-center gap-2 text-sm font-semibold mb-4">
              <Zap className="h-4 w-4 text-primary" /> Simulation Settings
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Auto-generate interval</span>
                  <span className="num">{interval}s</span>
                </label>
                <input
                  type="range"
                  min={3}
                  max={60}
                  step={1}
                  value={interval}
                  onChange={(e) => setInterval_(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>3s (fast)</span>
                  <span>60s (slow)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Batch size</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1 flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span>Fraud ratio</span>
                    <span className="num">{fraudRatio}%</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    step={5}
                    value={fraudRatio}
                    onChange={(e) => setFraudRatio(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Reasoning language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "id" | "en")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </section>

          {/* ── Demo Controls ─────────────────────────────────────────── */}
          <section className="border-t border-border pt-6">
            <button
              onClick={handleReset}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-destructive/30 px-4 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset All Transactions
            </button>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="h-9 rounded-md border border-border px-4 text-sm hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative h-5 w-9 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted-foreground/30"}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-card transition-all shadow-sm ${value ? "left-4.5" : "left-0.5"}`}
      />
    </button>
  );
}
