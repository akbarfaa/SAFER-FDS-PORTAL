import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

export const Route = createFileRoute("/b2b-demo")({
  head: () => ({
    meta: [
      { title: "B2B Partner Activation Gateway · SAFER" },
      { name: "description", content: "Mengaktifkan portal kredensial partner B2B SAFER FDS." },
    ],
  }),
  component: B2BActivationPage,
});

function B2BActivationPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Memverifikasi gateway partner...");

  useEffect(() => {
    // Enable B2B mode
    localStorage.setItem("safer_b2b_enabled", "true");
    // Default to admin role to see all features in sidebar
    localStorage.setItem("safer_role", "admin");

    const timer1 = setTimeout(() => {
      setStatus("Mengaktifkan portal registrasi kredensial B2B...");
    }, 1000);

    const timer2 = setTimeout(() => {
      setStatus("Menyiapkan sandbox khusus partner...");
    }, 2000);

    const timer3 = setTimeout(() => {
      navigate({ to: "/" });
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#070b13] p-4 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-[#1e293b] bg-[#0b1329]/60 p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-10 w-10 text-primary animate-pulse" />
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-75" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white mb-2">
          B2B Staging Gateway Unlocked
        </h1>
        
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Mengarahkan Anda ke Portal Kemitraan SAFER FDS. Anda sekarang dapat mendaftarkan instansi, mendapatkan Client ID/Secret, dan menguji coba dengan kuota staging.
        </p>

        <div className="flex items-center justify-center gap-2.5 text-sm text-primary font-medium">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{status}</span>
        </div>
      </div>
    </div>
  );
}
