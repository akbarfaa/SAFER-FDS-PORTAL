/**
 * Landing Page Route — Thin Orchestrator
 * Composes landing components from @/features/landing.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useReveal } from "@/hooks/useReveal";
import { LeadRegistrationModal } from "@/components/safer/LeadRegistrationModal";
import {
  SandboxBanner,
  SiteNav,
  Hero,
  ProblemSection,
  CapabilitiesSection,
  DashboardPreview,
  IntegrationFlow,
  RegulatorySection,
  BusinessSection,
  EcosystemVision,
  CTA,
  Footer,
} from "@/features/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAFER — Smart AI Fraud & Economic Risk Intelligence Platform" },
      {
        name: "description",
        content:
          "Enterprise AI Fraud Detection System (FDS) for Indonesian banks, digital banking, and fintech. Real-time transaction scoring under 150ms, Explainable AI, and Graph Intelligence.",
      },
      {
        name: "keywords",
        content:
          "fraud detection system, fds perbankan, AI fraud intelligence, uu pdp compliance, bi-fast fraud prevention, qris fraud detection, mule accounts, rekening bagong, graph intelligence",
      },
      { property: "og:title", content: "SAFER — Smart AI Fraud & Economic Risk Intelligence" },
      {
        property: "og:description",
        content: "Stop payment fraud and money laundering in real-time with explainable AI and network graph intelligence built for Indonesia's digital finance.",
      },
      { property: "og:image", content: "https://safer.web.id/og-image.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SAFER — Smart AI Fraud & Economic Risk Intelligence" },
      { name: "twitter:description", content: "Real-time AI Fraud Detection System for Indonesia's digital banking and fintech ecosystems." },
      { name: "twitter:image", content: "https://safer.web.id/og-image.png" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const pageRef = useReveal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isB2b, setIsB2b] = useState(false);

  useEffect(() => {
    // Enable B2B mode via URL query parameter if present
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "partner" || params.get("demo") === "b2b") {
      localStorage.setItem("safer_b2b_enabled", "true");
      localStorage.setItem("safer_role", "admin");
    }

    const b2bEnabled = localStorage.getItem("safer_b2b_enabled") === "true";
    setIsB2b(b2bEnabled);
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      <SandboxBanner />
      <SiteNav onDemoRequest={() => setIsModalOpen(true)} isB2b={isB2b} />
      <Hero onDemoRequest={() => setIsModalOpen(true)} isB2b={isB2b} />
      <ProblemSection />
      <CapabilitiesSection />
      <DashboardPreview />
      <IntegrationFlow />
      <RegulatorySection />
      <BusinessSection />
      <EcosystemVision />
      <CTA onDemoRequest={() => setIsModalOpen(true)} isB2b={isB2b} />
      <Footer />
      <LeadRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
