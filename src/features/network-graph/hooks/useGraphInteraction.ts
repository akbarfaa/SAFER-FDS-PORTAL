/**
 * Network Graph — Interaction Hook
 * Handles zoom, pan, drag, fullscreen state, and toast notifications.
 */
import { useState, useRef, type PointerEvent } from "react";

export function useGraphInteraction() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hovered, setHovered] = useState<{ id: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" } | null>(null);

  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === "circle" || (e.target as HTMLElement).tagName === "text") return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const showToast = (message: string, type: "success" | "warning" = "success") => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    showToast("Tampilan visualisasi direset ke pusat.");
  };

  const zoomIn = () => setZoom((z) => Math.min(2.2, z + 0.15));
  const zoomOut = () => setZoom((z) => Math.max(0.4, z - 0.15));
  const toggleFullscreen = () => setIsFullscreen((f) => !f);

  return {
    zoom,
    pan,
    isFullscreen,
    hovered,
    toast,
    containerRef,
    setHovered,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    showToast,
    resetView,
    zoomIn,
    zoomOut,
    toggleFullscreen,
  };
}
