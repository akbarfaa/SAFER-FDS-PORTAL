import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { tourStore, useTourStore } from "@/lib/tour-store";

// Define the steps of the tour with routes and bot states
const STEPS = [
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
    botState: "secure",
    title: "6. Kepatuhan & Tata Kelola",
    body: "SAFER dirancang sesuai standar kepatuhan Bank Indonesia, OJK POJK 11, serta UU Perlindungan Data Pribadi (UU PDP) dengan perlindungan privasi ketat.",
    route: "/compliance",
  },
  {
    botState: "architecture",
    title: "7. Arsitektur Platform",
    body: "Platform SAFER mendukung integrasi API siap pakai (<2 minggu) dan dapat dideploy secara aman di cloud (VPC) privat maupun infrastruktur on-premise perbankan.",
    route: "/architecture",
  },
  {
    botState: "business",
    title: "8. Model Bisnis & Skalabilitas",
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

// Helper to determine the themed colors for the bot state
function getBotStateTheme(state: string) {
  switch (state) {
    case "scanning":
      return {
        color: "rgb(168, 85, 247)", // purple
        glow: "rgba(168, 85, 247, 0.2)"
      };
    case "analytical":
      return {
        color: "rgb(245, 158, 11)", // warning amber
        glow: "rgba(245, 158, 11, 0.2)"
      };
    case "alert":
      return {
        color: "rgb(239, 68, 68)", // critical red
        glow: "rgba(239, 68, 68, 0.3)"
      };
    case "helper":
      return {
        color: "rgb(16, 185, 129)", // success green
        glow: "rgba(16, 185, 129, 0.2)"
      };
    case "network":
      return {
        color: "rgb(6, 182, 212)", // cyan
        glow: "rgba(6, 182, 212, 0.2)"
      };
    case "secure":
      return {
        color: "rgb(16, 185, 129)", // emerald/success
        glow: "rgba(16, 185, 129, 0.2)"
      };
    case "architecture":
      return {
        color: "rgb(99, 102, 241)", // indigo
        glow: "rgba(99, 102, 241, 0.2)"
      };
    case "business":
      return {
        color: "rgb(234, 179, 8)", // gold/yellow
        glow: "rgba(234, 179, 8, 0.2)"
      };
    case "welcome":
    default:
      return {
        color: "rgb(59, 130, 246)", // primary blue
        glow: "rgba(59, 130, 246, 0.2)"
      };
  }
}

// SAFER BOT Mascot Avatar with animated SVGs
function SaferBotAvatar({ state }: { state: string }) {
  const theme = getBotStateTheme(state);

  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
      className="relative shrink-0 w-16 h-16 flex items-center justify-center"
    >
      {/* Background glow circle */}
      <div 
        className="absolute inset-0 rounded-full blur-md transition-all duration-500" 
        style={{ backgroundColor: theme.glow }}
      />
      
      {/* Robot SVG Head */}
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 select-none">
        {/* Antenna */}
        <motion.path 
          d="M28 12V6M28 6C29.6569 6 31 4.65685 31 3C31 1.34315 29.6569 0 28 0C26.3431 0 25 1.34315 25 3C25 4.65685 26.3431 6 28 6Z" 
          fill={theme.color}
          stroke={theme.color}
          strokeWidth="1"
          animate={state === "welcome" ? { rotate: [0, -12, 12, -12, 12, 0] } : {}}
          transition={{ repeat: Infinity, repeatDelay: 1.5, duration: 1.2 }}
          style={{ originX: "28px", originY: "12px" }}
        />
        
        {/* Ears (Pulsing alarm lights when alert state) */}
        {state === "alert" ? (
          <motion.rect 
            x="3" y="20" width="4" height="12" rx="2" 
            fill={theme.color}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
        ) : (
          <rect x="3" y="20" width="4" height="12" rx="2" fill={theme.color} />
        )}
        
        {state === "alert" ? (
          <motion.rect 
            x="49" y="20" width="4" height="12" rx="2" 
            fill={theme.color}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
        ) : (
          <rect x="49" y="20" width="4" height="12" rx="2" fill={theme.color} />
        )}
        
        {/* Head Outer */}
        <rect x="7" y="12" width="42" height="36" rx="10" fill="var(--card)" stroke={theme.color} strokeWidth="2.5" />
        
        {/* Face Screen */}
        <rect x="11" y="16" width="34" height="24" rx="6" fill="var(--surface-2)" stroke={theme.color} strokeWidth="1.5" />
        
        {/* Eyes Content based on state */}
        {(() => {
          if (state === "welcome") {
            // Winking/Happy eyes
            return (
              <>
                {/* Left eye: happy arch */}
                <path d="M16 26C16 26 17.5 24 19.5 24C21.5 24 23 26 23 26" stroke={theme.color} strokeWidth="2.5" strokeLinecap="round" />
                {/* Right eye: happy arch */}
                <path d="M33 26C33 26 34.5 24 36.5 24C38.5 24 40 26 40 26" stroke={theme.color} strokeWidth="2.5" strokeLinecap="round" />
                {/* Happy mouth */}
                <path d="M25 33C25 33 26.5 35 28 35C29.5 35 31 33 31 33" stroke={theme.color} strokeWidth="2" strokeLinecap="round" />
              </>
            );
          }
          if (state === "scanning") {
            // Scanning eyes and laser
            return (
              <>
                {/* Horizontal line eyes */}
                <line x1="16" y1="26" x2="22" y2="26" stroke={theme.color} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="34" y1="26" x2="40" y2="26" stroke={theme.color} strokeWidth="2.5" strokeLinecap="round" />
                {/* Moving red/purple scanner laser line */}
                <motion.line 
                  x1="13" y1="18" x2="43" y2="18" 
                  stroke="rgb(239, 68, 68)" 
                  strokeWidth="1.5"
                  animate={{ y: [0, 19, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
              </>
            );
          }
          if (state === "analytical") {
            // Spinning data circles
            return (
              <>
                <motion.circle 
                  cx="19.5" cy="26" r="3.5" 
                  stroke={theme.color} strokeWidth="2" strokeDasharray="3 3"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
                <motion.circle 
                  cx="36.5" cy="26" r="3.5" 
                  stroke={theme.color} strokeWidth="2" strokeDasharray="3 3"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
                {/* Thinking dots */}
                <motion.circle cx="28" cy="34" r="1.5" fill={theme.color} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
                <motion.circle cx="31" cy="34" r="1.5" fill={theme.color} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} />
                <motion.circle cx="25" cy="34" r="1.5" fill={theme.color} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.6 }} />
              </>
            );
          }
          if (state === "alert") {
            // Pulsing alarm exclamation mark eyes
            return (
              <>
                <motion.path 
                  d="M19.5 22V26M19.5 29H19.55" 
                  stroke={theme.color} strokeWidth="2.5" strokeLinecap="round"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                />
                <motion.path 
                  d="M36.5 22V26M36.5 29H36.55" 
                  stroke={theme.color} strokeWidth="2.5" strokeLinecap="round"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                />
                {/* Alert mouth */}
                <rect x="25" y="32" width="6" height="3" rx="1.5" fill={theme.color} />
              </>
            );
          }
          if (state === "helper") {
            // Checkmark eyes and smile
            return (
              <>
                {/* Smiley/Normal eyes */}
                <circle cx="19" cy="25" r="2.5" fill={theme.color} />
                <circle cx="37" cy="25" r="2.5" fill={theme.color} />
                {/* Big happy mouth */}
                <path d="M23 31C23 31 25.5 34 28 34C30.5 34 33 31 33 31" stroke={theme.color} strokeWidth="2" strokeLinecap="round" />
              </>
            );
          }
          if (state === "network") {
            // Interconnected nodes eyes
            return (
              <>
                {/* Connectors */}
                <line x1="19" y1="25" x2="37" y2="25" stroke={theme.color} strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx="19" cy="25" r="3" fill={theme.color} />
                <circle cx="37" cy="25" r="3" fill={theme.color} />
                {/* Network sub-node */}
                <circle cx="28" cy="22" r="2" fill={theme.color} />
                <line x1="19" y1="25" x2="28" y2="22" stroke={theme.color} strokeWidth="1" />
                <line x1="37" y1="25" x2="28" y2="22" stroke={theme.color} strokeWidth="1" />
                {/* Mouth */}
                <line x1="25" y1="32" x2="31" y2="32" stroke={theme.color} strokeWidth="1.5" strokeLinecap="round" />
              </>
            );
          }
          if (state === "secure") {
            // Lock shape in center of face
            return (
              <>
                {/* Normal eyes */}
                <circle cx="19" cy="23" r="2" fill={theme.color} />
                <circle cx="37" cy="23" r="2" fill={theme.color} />
                {/* Lock body */}
                <rect x="25" y="30" width="6" height="5" rx="1" fill="none" stroke={theme.color} strokeWidth="2" />
                {/* Lock shackle */}
                <path d="M26 30V28C26 26.8954 26.8954 26 28 26C29.1046 26 30 26.8954 30 28V30" fill="none" stroke={theme.color} strokeWidth="1.5" />
              </>
            );
          }
          if (state === "architecture") {
            // Chip and micro tracks
            return (
              <>
                <rect x="17" y="23" width="5" height="5" rx="1" stroke={theme.color} strokeWidth="2" fill="none" />
                <rect x="34" y="23" width="5" height="5" rx="1" stroke={theme.color} strokeWidth="2" fill="none" />
                {/* Microchip tracks */}
                <line x1="28" y1="20" x2="28" y2="34" stroke={theme.color} strokeWidth="1.5" />
                <line x1="22" y1="28" x2="34" y2="28" stroke={theme.color} strokeWidth="1.5" />
              </>
            );
          }
          if (state === "business") {
            // Chart / Currency sign eyes
            return (
              <>
                <text x="15" y="29" fill={theme.color} fontSize="9" fontWeight="bold" fontFamily="sans-serif">Rp</text>
                <text x="31" y="29" fill={theme.color} fontSize="9" fontWeight="bold" fontFamily="sans-serif">Rp</text>
                {/* Upward chart mouth */}
                <path d="M22 34L26 31L30 33L34 29" stroke={theme.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </>
            );
          }
          // Default
          return (
            <>
              <circle cx="19" cy="26" r="3" fill={theme.color} />
              <circle cx="37" cy="26" r="3" fill={theme.color} />
              <line x1="24" y1="33" x2="32" y2="33" stroke={theme.color} strokeWidth="2" strokeLinecap="round" />
            </>
          );
        })()}
      </svg>
    </motion.div>
  );
}

export function Tour() {
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
    const targetRoute = STEPS[step].route;
    if (currentPath !== targetRoute) {
      navigate({ to: targetRoute });
    }
  }, [step, open, navigate, currentPath]);

  const botTheme = getBotStateTheme(STEPS[step]?.botState || "welcome");

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
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                    </span>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      SAFER BOT · LANGKAH {step + 1} DARI {STEPS.length}
                    </div>
                  </div>
                  <button onClick={() => tourStore.close()} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Body Content */}
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
                        {/* SAFER BOT Mascot rendering on the left */}
                        <SaferBotAvatar state={STEPS[step].botState} />
                        
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold tracking-tight text-foreground transition-colors duration-300" style={{ color: botTheme.color }}>
                            {STEPS[step].title}
                          </h3>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {STEPS[step].body}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-3.5">
                  {/* Progress Dots */}
                  <div className="flex gap-1.5">
                    {STEPS.map((_, i) => (
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
                  
                  {/* Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => tourStore.prevStep()}
                      disabled={step === 0}
                      className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-semibold text-muted-foreground disabled:opacity-30 disabled:pointer-events-none hover:bg-accent hover:text-foreground transition-all"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Kembali
                    </button>
                    <button
                      onClick={() => tourStore.nextStep(STEPS.length)}
                      className="inline-flex h-8 items-center gap-1 rounded-md px-3.5 text-xs font-bold text-white transition-all shadow-sm active:scale-95"
                      style={{ backgroundColor: botTheme.color }}
                    >
                      {step < STEPS.length - 1 ? (
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

          {/* Backdrop for step 1 only to focus attention on the welcome */}
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
