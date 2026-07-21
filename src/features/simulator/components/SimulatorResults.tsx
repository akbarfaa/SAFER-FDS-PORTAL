/**
 * Risk Simulator — AI Scoring Results Component
 */
import { Brain, FileSearch, AlertOctagon, Loader2 } from "lucide-react";
import { severityStyles, type Severity } from "@/lib/safer-data";

interface SimulatorResultsProps {
  loading: boolean;
  simResult: any | null;
}

export function SimulatorResults({ loading, simResult }: SimulatorResultsProps) {
  if (loading) {
    return (
      <div className="grid h-full min-h-[400px] place-items-center rounded-lg border border-dashed border-border bg-card p-10 text-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="mt-3 text-sm font-semibold text-foreground">Calculating risk score via XGBoost &amp; LightGBM...</div>
          <p className="mt-1 text-xs text-muted-foreground">Running SHAP feature attribution in real-time</p>
        </div>
      </div>
    );
  }

  if (!simResult) {
    return <EmptyResult />;
  }

  return (
    <>
      <ResultSummary score={simResult.risk_score} severity={simResult.severity} suggestedAction={simResult.suggested_action} />

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-[10px] uppercase font-bold text-muted-foreground">XGBoost Probabilitas</div>
          <div className="mt-1.5 num text-2xl font-semibold text-foreground">{(simResult.xgb_probability * 100).toFixed(1)}%</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-[10px] uppercase font-bold text-muted-foreground">LightGBM Probabilitas</div>
          <div className="mt-1.5 num text-2xl font-semibold text-foreground">{(simResult.lgb_probability * 100).toFixed(1)}%</div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Brain className="h-4 w-4 text-primary" />
          <div className="text-sm font-semibold">AI fraud explanation</div>
        </div>
        <div className="px-5 py-4 text-sm leading-relaxed whitespace-pre-line prose max-w-none text-foreground">
          {simResult.ai_reasoning}
        </div>
      </div>

      {simResult.primary_risk_factors && simResult.primary_risk_factors.length > 0 && (
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4 text-sm font-semibold font-sans">
            Faktor Risiko Utama (SHAP Feature Attribution)
          </div>
          <div className="divide-y divide-border">
            {simResult.primary_risk_factors.map((factor: any, index: number) => {
              const percentage = Math.min(100, Math.max(5, Math.round(factor.shap_value * 100)));
              return (
                <div key={index} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-critical" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{factor.label}</span>
                      <span className="num text-xs font-bold text-critical">
                        +{(factor.shap_value * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-critical" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

function ResultSummary({ score: total, severity, suggestedAction }: { score: number; severity: Severity; suggestedAction: string }) {
  const s = severityStyles[severity];
  return (
    <div className={`rounded-lg border ${s.ring} bg-card p-5 ring-1`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">AI Risk Score</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="num text-5xl font-semibold tracking-tight">{total}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Severity</div>
          <div className={`mt-1 inline-flex items-center gap-2 rounded-md ${s.bg} px-2.5 py-1 text-sm font-medium ${s.text}`}>
            <span className={`h-2 w-2 rounded-full ${s.dot}`} /> {s.label}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Fraud probability ≈ <span className="num font-medium text-foreground">{total}%</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-md border border-border bg-surface px-3 py-2.5 text-sm">
        <AlertOctagon className="mt-0.5 h-4 w-4 text-primary" />
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Suggested action</div>
          <div className="font-semibold text-foreground">{suggestedAction}</div>
        </div>
      </div>
    </div>
  );
}

function EmptyResult() {
  return (
    <div className="grid h-full min-h-[400px] place-items-center rounded-lg border border-dashed border-border bg-card p-10 text-center">
      <div>
        <FileSearch className="mx-auto h-8 w-8 text-muted-foreground" />
        <div className="mt-3 text-sm font-semibold">Run AI analysis to see results</div>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
          Configure transaction parameters on the left, then run the analysis to get an explainable AI risk score,
          weighted indicators and a suggested investigator action.
        </p>
      </div>
    </div>
  );
}
