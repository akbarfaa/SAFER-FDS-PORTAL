import { Link } from "@tanstack/react-router";
import { Users, Award, Send, Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface InvestorGovernanceProps {
  onOpenConsultModal: () => void;
}

export function InvestorGovernance({ onOpenConsultModal }: InvestorGovernanceProps) {
  const { language } = useTranslation();
  const isEn = language === "en";

  return (
    <div className="space-y-10">
      {/* Team Capability */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-sm">
        <div className="border-b border-border pb-4">
          <h2 className="text-xl font-bold text-foreground">
            {isEn ? "Team Capability & Organizational Expansion" : "Kapabilitas Tim & Rencana Ekspansi Organisasi"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isEn
              ? "Informatics Students, Universitas Trilogi — NIIT Certified Software Engineers (CEP CCIT FTUI)"
              : "Mahasiswa Teknik Informatika Univ. Trilogi Tersertifikasi Software Engineer NIIT (CEP CCIT FTUI)"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
            <div className="font-bold text-foreground text-sm">Akbar Fadhila</div>
            <div className="text-xs font-semibold text-primary">Product, AI & Project Manager Lead</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isEn
                ? "Architects end-to-end AI pipelines, 4 FastAPI microservices, V3 models (.ubj & .txt on Tencent Cloud VPS), and manages project execution (Shadow Mode to Auto Intervention), 6-12 mo roadmap, and modular deployment."
                : "Merancang arsitektur end-to-end, FastAPI 4 microservices, model V3 (.ubj & .txt di VPS Tencent Cloud), serta mengelola alur manajemen proyek (Shadow Mode hingga Auto Intervention), roadmap 6–12 bulan, dan deployment modular."}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
            <div className="font-bold text-foreground text-sm">Neyla Lian Syatifa</div>
            <div className="text-xs font-semibold text-purple-400">UX Design & Business Domain Lead</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isEn
                ? "Designs dashboard system, investigation workflows, Fraud Graph, and usability testing. Leads BI/OJK/PPATK compliance, Human-in-the-Loop alignment, B2B SaaS monetization, and ASPI association outreach."
                : "Merancang sistem desain dashboard, alur investigasi, Fraud Graph, dan pengujian usability. Memimpin kepatuhan regulasi (BI, OJK, PPATK) berbasis human-in-the-loop, skema B2B SaaS, dan asosiasi ASPI."}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
            <div className="font-bold text-foreground text-sm">Amadeus Christiano</div>
            <div className="text-xs font-semibold text-cyan-400">Frontend & Client Demo Lead</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isEn
                ? "Develops React/TypeScript UI (0 build errors), Monitoring Dashboard, Audit Queue, Risk Simulator, Fraud Graph, ensures intuitive analyst UX, and leads technical client demonstrations."
                : "Mengembangkan komponen React/TypeScript (0 error build), Monitoring Dashboard, Audit Queue, Risk Simulator, dan Fraud Graph, memastikan UX ramah analis, serta memimpin demonstrasi teknis ke calon klien."}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/80 p-5 space-y-2 text-xs">
          <div className="font-bold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />{" "}
            {isEn ? "Team Expansion Plan & Advisory Mentorship:" : "Rencana Ekspansi Tim & Pendampingan Ahli:"}
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {isEn
              ? "Looking ahead, the development team will expand from 3 to 5 members (adding 1 DevOps Engineer and 1 Fullstack Engineer) accompanied by Business Advisory Mentors and Banking Regulatory Legal Mentors."
              : "Ke depan, tim developer akan diperluas dari 3 menjadi 5 orang (menambah 1 DevOps Engineer dan 1 Fullstack Engineer) dengan pendampingan Mentor Bisnis untuk skala komersial dan Mentor Hukum Regulasi Perbankan."}
          </p>
        </div>
      </div>

      {/* Investment Ask CTA Banner */}
      <div className="rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-purple-500/10 p-8 md:p-12 text-center space-y-5 shadow-2xl">
        <Award className="h-12 w-12 text-primary mx-auto" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {isEn ? "Interested in Strategic Discussions or Investment?" : "Tertarik Berdiskusi atau Berinvestasi di SAFER?"}
        </h2>
        <p className="max-w-2xl mx-auto text-xs md:text-sm text-muted-foreground leading-relaxed">
          {isEn
            ? "We welcome discussions for Pre-Seed funding (Rp 150 Million), pilot project partnerships, or business advisory. Reach out directly to SAFER founders."
            : "Kami membuka pintu diskusi untuk pendanaan Pre-Seed (Rp 150 Juta), kemitraan strategis pilot project, maupun advisori bisnis. Hubungi tim pendiri SAFER secara langsung."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          <button
            onClick={onOpenConsultModal}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-xl hover:bg-primary/90 transition-all hover:scale-105"
          >
            <Send className="h-4 w-4" /> {isEn ? "Investor Inquiry Form" : "Formulir Konsultasi Investor"}
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
          >
            <Globe className="h-4 w-4 text-muted-foreground" />{" "}
            {isEn ? "Return to SAFER Main Landing Portal" : "Masuk ke Portal Landing Page Utama SAFER"}
          </Link>
        </div>
      </div>
    </div>
  );
}
