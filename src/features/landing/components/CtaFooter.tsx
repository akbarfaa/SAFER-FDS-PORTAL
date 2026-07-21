/**
 * Landing Page — CTA & Footer
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/safer/Logo";

export function CTA({ onDemoRequest, isB2b }: { onDemoRequest: () => void; isB2b: boolean }) {
  return (
    <section className="border-b border-border min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h2 className="reveal text-display text-4xl font-semibold tracking-tight md:text-5xl">
          See SAFER work on your transaction patterns.
        </h2>
        <p className="reveal reveal-delay-1 mx-auto mt-4 max-w-2xl text-muted-foreground">
          Explore the live console, simulate fraud scenarios and walk through the fraud graph — no signup required.
        </p>
        <div className="reveal reveal-delay-2 mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/simulator"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Launch Risk Simulator <ArrowRight className="h-4 w-4" />
          </Link>
          {isB2b ? (
            <button
              onClick={onDemoRequest}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-medium transition-all hover:bg-accent hover:border-primary/45"
            >
              Hubungi Kami &amp; Request Key
            </button>
          ) : (
            <Link
              to="/dashboard"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-medium transition-all hover:bg-accent hover:border-primary/45"
            >
              Open Live Console
            </Link>
          )}
          <Link
            to="/network"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-transparent px-5 text-sm font-medium transition-colors hover:bg-accent/10"
          >
            Explore Fraud Graph
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Logo />
            <p className="mt-3 max-w-md text-xs text-muted-foreground">
              SAFER — Smart AI Fraud &amp; Economic Risk Intelligence. Built for Indonesia&apos;s digital financial ecosystem.
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SAFER. Prototype for demonstration purposes.
          </div>
        </div>
        <div className="rounded-lg border border-warning/20 bg-warning/5 p-4 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-warning">Pernyataan Penyangkalan (Disclaimer Industri):</span> Seluruh data transaksi, nama nasabah, nomor rekening, alamat IP, data logikal perangkat, dan visualisasi jaringan hubungan yang disajikan dalam purwarupa (prototype) FDS SAFER ini adalah data sintetis rekayasa buatan. Purwarupa ini dibuat khusus untuk keperluan demonstrasi dan simulasi operasional deteksi fraud industri keuangan digital Indonesia. Tidak menggunakan data nasabah riil atau transaksi finansial nyata dari institusi manapun.
        </div>
      </div>
    </footer>
  );
}
