/**
 * Network Route — Thin Orchestrator
 * Composes feature modules from @/features/network-graph.
 * All business logic lives in hooks; all UI in feature components.
 */
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/safer/AppShell";
import { Check, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import {
  GraphCanvas,
  GraphToolbar,
  GraphSidebar,
  useGraphData,
  useGraphInteraction,
} from "@/features/network-graph";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Fraud Graph · SAFER" },
      { name: "description", content: "Graph intelligence visualization of fraud networks and mule accounts." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NetworkPage,
});

function NetworkPage() {
  const { t } = useTranslation();

  // Data layer
  const data = useGraphData();

  // Interaction layer
  const interaction = useGraphInteraction();

  return (
    <AppShell title={t('network.title')} subtitle={t('network.subtitle')} hideLayout={interaction.isFullscreen}>

      {/* Toast Notification */}
      <AnimatePresence>
        {interaction.toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-lg border border-border bg-card px-4 py-3 shadow-lg backdrop-blur"
          >
            {interaction.toast.type === "success" ? (
              <div className="grid h-6 w-6 place-items-center rounded-full bg-success/20 text-success">
                <Check className="h-3.5 w-3.5" />
              </div>
            ) : (
              <div className="grid h-6 w-6 place-items-center rounded-full bg-warning/20 text-warning">
                <Info className="h-3.5 w-3.5" />
              </div>
            )}
            <span className="text-xs font-semibold text-foreground">{interaction.toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div className={`grid gap-4 transition-all duration-300 ${
        interaction.isFullscreen
          ? "fixed inset-0 z-50 w-screen h-screen p-6 bg-background flex flex-row overflow-hidden gap-4"
          : "lg:grid-cols-4"
      }`}>

        {/* Graph Area (3/4 width) */}
        <div className={`rounded-lg border border-border bg-card overflow-hidden flex flex-col relative transition-all duration-300 ${
          interaction.isFullscreen ? "flex-1 h-full" : "lg:col-span-3"
        }`}>
          <GraphToolbar
            scenarioName={data.scenario.name}
            scenarioSeverity={data.scenario.severity}
            isInvestigated={data.isInvestigated}
            isFullscreen={interaction.isFullscreen}
            zoom={interaction.zoom}
            onToggleFullscreen={interaction.toggleFullscreen}
            onResetView={interaction.resetView}
            onZoomIn={interaction.zoomIn}
            onZoomOut={interaction.zoomOut}
          />
          <GraphCanvas
            nodes={data.dynamicNodes}
            edges={data.dynamicEdges}
            selected={data.selected}
            hovered={interaction.hovered as any}
            loading={data.loading}
            zoom={interaction.zoom}
            pan={interaction.pan}
            isFullscreen={interaction.isFullscreen}
            containerRef={interaction.containerRef}
            scenarioNodes={data.scenario.nodes}
            onSelectNode={data.setSelected}
            onHoverNode={interaction.setHovered as any}
            onPointerDown={interaction.handlePointerDown}
            onPointerMove={interaction.handlePointerMove}
            onPointerUp={interaction.handlePointerUp}
          />
        </div>

        {/* Sidebar (1/4 width) */}
        <GraphSidebar
          scenarios={data.scenarios}
          activeScenarioIdx={data.activeScenarioIdx}
          selected={data.selected}
          dynamicEdges={data.dynamicEdges}
          dynamicInsights={data.dynamicInsights}
          isInvestigated={data.isInvestigated}
          isFullscreen={interaction.isFullscreen}
          scenarioTxIds={data.scenarioTxIds}
          allTxs={data.allTxs}
          onSelectScenario={data.setActiveScenarioIdx}
          onInvestigate={() => {
            data.handleInvestigateCluster();
            interaction.showToast(`Jaringan ${data.scenario.name} telah dimasukkan ke Antrean Audit untuk diinvestigasi.`, "success");
          }}
          onShowToast={interaction.showToast}
        />
      </div>
    </AppShell>
  );
}
