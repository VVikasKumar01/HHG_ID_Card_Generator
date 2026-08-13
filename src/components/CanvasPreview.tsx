import React, { useEffect, useState, useCallback } from "react";
import { FrameStyleId, BadgeThemeId, ImageAdjustments, BuilderBadgeData } from "../types";
import { renderFrameCanvas, renderBadgeCanvas } from "../utils/canvasRenderer";
import confetti from "canvas-confetti";
import { Download, Copy, Check, Twitter, Sparkles, ZoomIn, ZoomOut, Move, RotateCcw, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface CanvasPreviewProps {
  activeTab: "frame" | "badge";
  currentImage: string | null;
  selectedStyle: FrameStyleId;
  selectedTheme: BadgeThemeId;
  adjustments: ImageAdjustments;
  setAdjustments: React.Dispatch<React.SetStateAction<ImageAdjustments>>;
  badgeData: BuilderBadgeData;
  onOpenShareModal: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  activeTab,
  currentImage,
  selectedStyle,
  selectedTheme,
  adjustments,
  setAdjustments,
  badgeData,
  onOpenShareModal,
  canvasRef,
}) => {
  const [copiedImage, setCopiedImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);

  // Re-render canvas whenever controls, image, style, tab, or flip state change
  const draw = useCallback(async () => {
    if (!canvasRef.current) return;
    if (activeTab === "frame") {
      await renderFrameCanvas(canvasRef.current, currentImage, selectedStyle, adjustments, badgeData);
    } else {
      await renderBadgeCanvas(canvasRef.current, currentImage, badgeData, selectedTheme, adjustments, isFlipped);
    }
  }, [activeTab, currentImage, selectedStyle, selectedTheme, adjustments, badgeData, isFlipped, canvasRef]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Handle Download Action
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename =
        activeTab === "frame"
          ? "HH-Goa-2026-PFP-Frame.png"
          : `HH-Goa-2026-Pass-${isFlipped ? "Back" : "Front"}-${(badgeData.name || "Builder").replace(/\s+/g, "-")}.png`;

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD200", "#FF007A", "#0D5235", "#FFFFFF"],
      });
    }, "image/png");
  };

  // Handle Copy to Clipboard Action
  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob }),
          ]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2000);
        } catch {
          alert("Clipboard copy not supported by browser, please use Download PNG!");
        }
      }, "image/png");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Mouse Drag-to-Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!currentImage || isFlipped) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !currentImage || isFlipped) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

    setAdjustments((prev) => ({
      ...prev,
      panX: prev.panX + dx,
      panY: prev.panY + dy,
    }));
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch Drag-to-Pan handlers for Mobile Devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!currentImage || isFlipped || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !currentImage || isFlipped || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });

    setAdjustments((prev) => ({
      ...prev,
      panX: prev.panX + dx,
      panY: prev.panY + dy,
    }));
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    if (!currentImage || isFlipped) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setAdjustments((prev) => ({
      ...prev,
      zoom: Math.min(Math.max(0.5, prev.zoom + delta), 2.5),
    }));
  };

  const handleResetPosition = () => {
    setAdjustments((prev) => ({
      ...prev,
      panX: 0,
      panY: 0,
      zoom: 1,
    }));
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {/* Canvas Wrapper Card - Expanded Size */}
      <div className={`relative w-full ${activeTab === "frame" ? "max-w-[480px]" : "max-w-[850px]"} bg-[#fffdf2] border-2 border-[#111827] rounded-2xl p-3 sm:p-5 shadow-[6px_6px_0px_#111827] flex flex-col items-center text-[#111827]`}>
        {/* Top Hint & Flip Control Bar */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono-retro font-bold mb-3 px-1">
          <span className="flex items-center gap-1.5 text-[#ff007a]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RESULT ({activeTab === "frame" ? "1000×1000 PFP" : isFlipped ? "CARD BACK" : "CARD FRONT"})</span>
          </span>

          {activeTab === "badge" && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffd200] border-2 border-[#111827] text-[#111827] font-black text-xs rounded-xl shadow-[2px_2px_0px_#111827] hover:bg-[#ffe033] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>FLIP TO {isFlipped ? "FRONT" : "BACK"}</span>
            </motion.button>
          )}

          {activeTab === "frame" && (
            <span className="flex items-center gap-1 text-[#111827]/70">
              <Move className="w-3 h-3 text-[#ff007a]" /> Drag to pan photo
            </span>
          )}
        </div>

        {/* Real Canvas Rendering Container */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          tabIndex={0}
          role="region"
          aria-label="Live Canvas Result Preview"
          className={`relative w-full overflow-hidden rounded-xl bg-[#0d5235] border-2 border-[#111827] shadow-inner group touch-none focus:outline-none focus:ring-2 focus:ring-[#ff007a] ${
            currentImage && !isFlipped ? "cursor-grab active:cursor-grabbing" : ""
          }`}
          style={{
            aspectRatio: activeTab === "frame" ? "1 / 1" : "3 / 2",
          }}
        >
          <canvas
            ref={canvasRef}
            aria-label="Generated profile graphic"
            className="w-full h-full object-contain pointer-events-none"
          />

          {/* Quick On-Canvas Zoom & Reset Overlay Controls (Only on front view with image) */}
          {currentImage && activeTab === "frame" && (
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setAdjustments((prev) => ({
                    ...prev,
                    zoom: Math.min(2.5, prev.zoom + 0.15),
                  }));
                }}
                className="w-8 h-8 rounded-lg bg-[#ffd200] border-2 border-[#111827] text-[#111827] flex items-center justify-center font-bold shadow-[2px_2px_0px_#111827] hover:bg-[#ffe033]"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setAdjustments((prev) => ({
                    ...prev,
                    zoom: Math.max(0.5, prev.zoom - 0.15),
                  }));
                }}
                className="w-8 h-8 rounded-lg bg-[#ffd200] border-2 border-[#111827] text-[#111827] flex items-center justify-center font-bold shadow-[2px_2px_0px_#111827] hover:bg-[#ffe033]"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetPosition();
                }}
                className="w-8 h-8 rounded-lg bg-white border-2 border-[#111827] text-[#111827] flex items-center justify-center font-bold shadow-[2px_2px_0px_#111827] hover:bg-[#ff007a] hover:text-white transition-colors"
                title="Center Photo"
                aria-label="Center Photo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons Bar */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-2.5 mt-4">
          {/* Flip Button for ID Badge Tab */}
          {activeTab === "badge" && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFlipped((prev) => !prev)}
              id="flip-btn"
              style={{ height: "50.61px" }}
              className="w-full py-3 px-3 rounded-xl bg-[#ffd200] border-2 border-[#111827] text-[#111827] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#ffe033] shadow-[2px_2px_0px_#111827]"
            >
              <RefreshCw className="w-4 h-4 stroke-[2.5]" />
              <span className="flex items-center justify-center text-xs">
                Flip ({isFlipped ? "Back" : "Front"})
              </span>
            </motion.button>
          )}

          {/* Download Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            id="download-btn"
            style={{ height: "50.61px" }}
            className={`w-full py-3 px-3 rounded-xl hh-btn-yellow text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 ${
              activeTab === "frame" ? "sm:col-span-1" : ""
            }`}
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span style={{ fontSize: "12px" }} className="flex items-center justify-center">Download PNG</span>
          </motion.button>

          {/* Share on X Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onOpenShareModal}
            id="share-btn"
            style={{ height: "50.61px" }}
            className="w-full py-3 px-3 rounded-xl hh-btn-pink text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <Twitter className="w-4 h-4 fill-current" />
            <span style={{ fontSize: "11px" }} className="flex items-center justify-center">#FrameInGoa</span>
          </motion.button>

          {/* Copy Image Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyImage}
            id="copy-btn"
            style={{ height: "50.61px" }}
            className="w-full py-3 px-3 rounded-xl bg-white border-2 border-[#111827] text-[#111827] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#ffd200] transition-colors shadow-[2px_2px_0px_#111827]"
          >
            {copiedImage ? (
              <>
                <Check className="w-4 h-4 text-[#0d5235]" />
                <span style={{ fontSize: "11px" }} className="text-[#0d5235]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#111827]" />
                <span style={{ fontSize: "11px" }}>Copy Image</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

