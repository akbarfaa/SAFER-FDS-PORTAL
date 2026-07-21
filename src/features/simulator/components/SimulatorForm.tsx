/**
 * Risk Simulator — Parameter Input Form Component
 */
import { formatIDR } from "@/lib/safer-data";
import { Play, RotateCcw, Loader2 } from "lucide-react";
import type { FormState } from "../types";

interface SimulatorFormProps {
  formState: FormState;
  loading: boolean;
  onUpdate: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  onRunAnalysis: () => void;
  onReset: () => void;
}

export function SimulatorForm({
  formState: f,
  loading,
  onUpdate,
  onRunAnalysis,
  onReset,
}: SimulatorFormProps) {
  return (
    <div className="lg:col-span-2 rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <div className="text-sm font-semibold">Transaction parameters</div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          Adjust values to simulate a real-world transaction
        </div>
      </div>
      <div className="space-y-4 p-5">
        <Field label={`Amount: ${formatIDR(f.amount)}`}>
          <input
            type="range"
            min={50_000}
            max={50_000_000}
            step={50_000}
            value={f.amount}
            onChange={(e) => onUpdate("amount", Number(e.target.value))}
            className="w-full accent-primary"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Hour of day">
            <NumberInput value={f.hour} min={0} max={23} onChange={(v) => onUpdate("hour", v)} />
          </Field>
          <Field label="Account age (months)">
            <NumberInput value={f.accountAge} min={0} max={120} onChange={(v) => onUpdate("accountAge", v)} />
          </Field>
          <Field label="Frequency (tx/day)">
            <NumberInput value={f.frequency} min={0} max={50} onChange={(v) => onUpdate("frequency", v)} />
          </Field>
          <Field label="Velocity (tx / 10 min)">
            <NumberInput value={f.velocity} min={0} max={20} onChange={(v) => onUpdate("velocity", v)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Merchant category">
            <Select value={f.merchant} onChange={(v) => onUpdate("merchant", v)} options={["Retail", "Food", "Travel", "Crypto", "Gaming", "Utility"]} />
          </Field>
          <Field label="Payment rail">
            <Select value={f.rail} onChange={(v) => onUpdate("rail", v)} options={["QRIS", "BI-FAST", "E-Wallet", "Card", "Virtual Acc"]} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Toggle label="Device known" value={f.deviceKnown} onChange={(v) => onUpdate("deviceKnown", v)} />
          <Toggle label="Device mismatch" value={f.deviceMismatch} onChange={(v) => onUpdate("deviceMismatch", v)} />
          <Toggle label="Geo anomaly" value={f.geoAnomaly} onChange={(v) => onUpdate("geoAnomaly", v)} />
          <Toggle label="Suspicious IP" value={f.suspiciousIp} onChange={(v) => onUpdate("suspiciousIp", v)} />
          <Toggle label="Failed attempts" value={f.failedAttempts} onChange={(v) => onUpdate("failedAttempts", v)} />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onRunAnalysis}
            disabled={loading}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run AI analysis
          </button>
          <button
            onClick={onReset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm transition-colors hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function NumberInput({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between rounded-md border px-3 py-2 text-xs transition-colors w-full ${
        value ? "border-primary/40 bg-primary/10 text-foreground" : "border-border bg-surface text-muted-foreground"
      }`}
    >
      <span>{label}</span>
      <span className={`relative h-4 w-7 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted-foreground/30"}`}>
        <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-card transition-all ${value ? "left-3.5" : "left-0.5"}`} />
      </span>
    </button>
  );
}
