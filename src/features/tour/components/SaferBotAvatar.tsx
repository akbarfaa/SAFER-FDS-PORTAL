/**
 * Tour Feature — SAFER BOT Mascot Animated Avatar SVG
 */
import { motion } from "framer-motion";
import { getBotStateTheme } from "../constants";

export function SaferBotAvatar({ state }: { state: string }) {
  const theme = getBotStateTheme(state);

  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
      className="relative shrink-0 w-16 h-16 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 rounded-full blur-md transition-all duration-500"
        style={{ backgroundColor: theme.glow }}
      />

      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 select-none">
        <motion.path
          d="M28 12V6M28 6C29.6569 6 31 4.65685 31 3C31 1.34315 29.6569 0 28 0C26.3431 0 25 1.34315 25 3C25 4.65685 26.3431 6 28 6Z"
          fill={theme.color}
          stroke={theme.color}
          strokeWidth="1"
          animate={state === "welcome" ? { rotate: [0, -12, 12, -12, 12, 0] } : {}}
          transition={{ repeat: Infinity, repeatDelay: 1.5, duration: 1.2 }}
          style={{ originX: "28px", originY: "12px" }}
        />

        {state === "alert" ? (
          <motion.rect x="3" y="20" width="4" height="12" rx="2" fill={theme.color} animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} />
        ) : (
          <rect x="3" y="20" width="4" height="12" rx="2" fill={theme.color} />
        )}

        {state === "alert" ? (
          <motion.rect x="49" y="20" width="4" height="12" rx="2" fill={theme.color} animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} />
        ) : (
          <rect x="49" y="20" width="4" height="12" rx="2" fill={theme.color} />
        )}

        <rect x="7" y="12" width="42" height="36" rx="10" fill="var(--card)" stroke={theme.color} strokeWidth="2.5" />
        <rect x="11" y="16" width="34" height="24" rx="6" fill="var(--surface-2)" stroke={theme.color} strokeWidth="1.5" />

        {(() => {
          if (state === "welcome") {
            return (
              <>
                <path d="M16 26C16 26 17.5 24 19.5 24C21.5 24 23 26 23 26" stroke={theme.color} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M33 26C33 26 34.5 24 36.5 24C38.5 24 40 26 40 26" stroke={theme.color} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M25 33C25 33 26.5 35 28 35C29.5 35 31 33 31 33" stroke={theme.color} strokeWidth="2" strokeLinecap="round" />
              </>
            );
          }
          if (state === "scanning") {
            return (
              <>
                <line x1="16" y1="26" x2="22" y2="26" stroke={theme.color} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="34" y1="26" x2="40" y2="26" stroke={theme.color} strokeWidth="2.5" strokeLinecap="round" />
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
            return (
              <>
                <motion.circle cx="19.5" cy="26" r="3.5" stroke={theme.color} strokeWidth="2" strokeDasharray="3 3" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} />
                <motion.circle cx="36.5" cy="26" r="3.5" stroke={theme.color} strokeWidth="2" strokeDasharray="3 3" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} />
                <motion.circle cx="28" cy="34" r="1.5" fill={theme.color} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
                <motion.circle cx="31" cy="34" r="1.5" fill={theme.color} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} />
                <motion.circle cx="25" cy="34" r="1.5" fill={theme.color} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.6 }} />
              </>
            );
          }
          if (state === "alert") {
            return (
              <>
                <motion.path d="M19.5 22V26M19.5 29H19.55" stroke={theme.color} strokeWidth="2.5" strokeLinecap="round" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                <motion.path d="M36.5 22V26M36.5 29H36.55" stroke={theme.color} strokeWidth="2.5" strokeLinecap="round" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                <rect x="25" y="32" width="6" height="3" rx="1.5" fill={theme.color} />
              </>
            );
          }
          if (state === "helper") {
            return (
              <>
                <circle cx="19" cy="25" r="2.5" fill={theme.color} />
                <circle cx="37" cy="25" r="2.5" fill={theme.color} />
                <path d="M23 31C23 31 25.5 34 28 34C30.5 34 33 31 33 31" stroke={theme.color} strokeWidth="2" strokeLinecap="round" />
              </>
            );
          }
          if (state === "network") {
            return (
              <>
                <line x1="19" y1="25" x2="37" y2="25" stroke={theme.color} strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx="19" cy="25" r="3" fill={theme.color} />
                <circle cx="37" cy="25" r="3" fill={theme.color} />
                <circle cx="28" cy="22" r="2" fill={theme.color} />
                <line x1="19" y1="25" x2="28" y2="22" stroke={theme.color} strokeWidth="1" />
                <line x1="37" y1="25" x2="28" y2="22" stroke={theme.color} strokeWidth="1" />
                <line x1="25" y1="32" x2="31" y2="32" stroke={theme.color} strokeWidth="1.5" strokeLinecap="round" />
              </>
            );
          }
          if (state === "secure") {
            return (
              <>
                <circle cx="19" cy="23" r="2" fill={theme.color} />
                <circle cx="37" cy="23" r="2" fill={theme.color} />
                <rect x="25" y="30" width="6" height="5" rx="1" fill="none" stroke={theme.color} strokeWidth="2" />
                <path d="M26 30V28C26 26.8954 26.8954 26 28 26C29.1046 26 30 26.8954 30 28V30" fill="none" stroke={theme.color} strokeWidth="1.5" />
              </>
            );
          }
          if (state === "architecture") {
            return (
              <>
                <rect x="17" y="23" width="5" height="5" rx="1" stroke={theme.color} strokeWidth="2" fill="none" />
                <rect x="34" y="23" width="5" height="5" rx="1" stroke={theme.color} strokeWidth="2" fill="none" />
                <line x1="28" y1="20" x2="28" y2="34" stroke={theme.color} strokeWidth="1.5" />
                <line x1="22" y1="28" x2="34" y2="28" stroke={theme.color} strokeWidth="1.5" />
              </>
            );
          }
          if (state === "business") {
            return (
              <>
                <text x="15" y="29" fill={theme.color} fontSize="9" fontWeight="bold" fontFamily="sans-serif">Rp</text>
                <text x="31" y="29" fill={theme.color} fontSize="9" fontWeight="bold" fontFamily="sans-serif">Rp</text>
                <path d="M22 34L26 31L30 33L34 29" stroke={theme.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </>
            );
          }
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
