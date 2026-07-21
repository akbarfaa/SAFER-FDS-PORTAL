/**
 * Tour Feature — Tour Floating Modal Overlay
 */
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { tourStore, useTourStore } from "@/lib/tour-store";
import { TOUR_STEPS, getBotStateTheme } from "../constants";
import { SaferBotAvatar } from "./SaferBotAvatar";

export function TourModal() {
  const { open, step } = useTourStore();
  const navigate = useNavigate();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });

  // Auto-start the tour if not seen
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("safer-tour-seen") && !open && step === 0) {
      const t = setTimeout(() => tourStore.start(), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  // Navigate to correct route when step changes
  useEffect(() => {
    if (!open) return;
    const targetRoute = TOUR_STEPS[step].route;
    if (currentPath !== targetRoute) {
      navigate({ to: targetRoute });
    }
  }, [step, open, navigate, currentPath]);

  const botTheme = getBotStateTheme(TOUR_STEPS[step]?.botState || "welcome");

  return (
    <>
      <button
        onClick={() => tourStore.start()}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-primary/20 bg-primary/10 px-3.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20 hover:border-primary/30 active:scale-95"
      >
        <Play className="h-3.5 w-3.5 fill-primary" /> <span className="hidden sm:inline">Panduan Interaktif</span><span className="inline sm:hidden">Tur</span>
      </button>

      {typeof document !== "undefined" && createPortal(
        <>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", damping: 26, stiffness: 280 }}
                className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-[calc(50%-190px)] md:right-auto z-50 w-auto md:w-[380px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 transition-all duration-300"
                style={{ borderTopColor: botTheme.color, borderTopWidth: "3px" }}
              >
                <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                    </span>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      SAFER BOT · LANGKAH {step + 1} DARI {TOUR_STEPS.length}
                    </div>
                  </div>
                  <button onClick={() => tourStore.close()} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="px-5 py-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-start gap-4">
                        <SaferBotAvatar state={TOUR_STEPS[step].botState} />

                        <div className="space-y-1">
                          <h3 className="text-sm font-bold tracking-tight text-foreground transition-colors duration-300" style={{ color: botTheme.color }}>
                            {TOUR_STEPS[step].title}
                          </h3>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {TOUR_STEPS[step].body}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-3.5">
                  <div className="flex gap-1.5">
                    {TOUR_STEPS.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === step
                            ? "w-4"
                            : "w-1.5 bg-muted-foreground/20"
                        }`}
                        style={i === step ? { backgroundColor: botTheme.color } : {}}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => tourStore.prevStep()}
                      disabled={step === 0}
                      className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-semibold text-muted-foreground disabled:opacity-30 disabled:pointer-events-none hover:bg-accent hover:text-foreground transition-all"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Kembali
                    </button>
                    <button
                      onClick={() => tourStore.nextStep(TOUR_STEPS.length)}
                      className="inline-flex h-8 items-center gap-1 rounded-md px-3.5 text-xs font-bold text-white transition-all shadow-sm active:scale-95"
                      style={{ backgroundColor: botTheme.color }}
                    >
                      {step < TOUR_STEPS.length - 1 ? (
                        <>
                          Lanjut <ChevronRight className="h-3.5 w-3.5" />
                        </>
                      ) : (
                        "Selesai"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {open && step === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
                onClick={() => tourStore.close()}
              />
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </>
  );
}
