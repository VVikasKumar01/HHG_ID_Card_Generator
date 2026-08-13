import React, { useState, useRef, useEffect } from "react";
import { AppTab, FrameStyleId, BadgeThemeId, ImageAdjustments, BuilderBadgeData, ShareState } from "./types";
import { Header } from "./components/Header";
import { PhotoUploader } from "./components/PhotoUploader";
import { FrameEditor } from "./components/FrameEditor";
import { BadgeEditor } from "./components/BadgeEditor";
import { CanvasPreview } from "./components/CanvasPreview";
import { ShareModal } from "./components/ShareModal";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("frame");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<FrameStyleId>("goa_beach_poster");
  const [selectedTheme, setSelectedTheme] = useState<BadgeThemeId>("hacker_house_green");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Share State
  const [shareState, setShareState] = useState<ShareState>({
    isSharing: false,
    shareUrl: null,
    ogImageUrl: null,
    copied: false,
  });

  // Photo Adjustments state
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    zoom: 1,
    panX: 0,
    panY: 0,
    rotation: 0,
    flipH: false,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    filterPreset: "none",
  });

  // Builder Badge Data state
  const [badgeData, setBadgeData] = useState<BuilderBadgeData>(() => {
    const saved = localStorage.getItem("hh_goa_badge_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      name: "ALEX RIVERA",
      role: "Full-Stack Engineer",
      stack: "TypeScript, AI Agents, React",
      builderTitle: "LLM Whisperer & Sunset Chaser",
      serialNumber: "042",
      xHandle: "alex_builder",
      githubHandle: "alexrivera",
      contactNo: "+91 98765 43210",
      projectName: "GOA AI AGENT KIT",
      builderClass: "TERMINAL WIZARD",
      beachBag: ["COCONUT", "VS CODE", "LO-FI BEATS"],
      currentlyShipping: "BUILDING THE FUTURE",
      builderId: "#HH-GOA-7757",
      accessTier: "VIP BUILDER",
      foilStyle: "hologram",
      hasSmartChip: true,
      verifiedBadge: true,
    };
  });

  // Persist badge data on change
  useEffect(() => {
    localStorage.setItem("hh_goa_badge_data", JSON.stringify(badgeData));
  }, [badgeData]);

  // Handle Share Link Creation API call
  const handleCreateShareLink = async () => {
    if (!canvasRef.current) return;
    setShareState((prev) => ({ ...prev, isSharing: true }));

    try {
      const dataUrl = canvasRef.current.toDataURL("image/png", 0.8);
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData: dataUrl,
          name: badgeData.name,
          title: badgeData.builderTitle,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setShareState((prev) => ({
          ...prev,
          isSharing: false,
          shareUrl: result.shareUrl || window.location.href,
          ogImageUrl: result.ogImageUrl || null,
        }));
      } else {
        throw new Error("API share error");
      }
    } catch (err) {
      console.warn("Falling back to local URL:", err);
      setShareState((prev) => ({
        ...prev,
        isSharing: false,
        shareUrl: window.location.href,
      }));
    }
  };

  const handleCopyLink = () => {
    const urlToCopy = shareState.shareUrl || window.location.href;
    navigator.clipboard.writeText(urlToCopy);
    setShareState((prev) => ({ ...prev, copied: true }));
    setTimeout(() => {
      setShareState((prev) => ({ ...prev, copied: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-palm-green text-[#fffdf5] font-sans selection:bg-[#ffd200] selection:text-[#111827] flex flex-col antialiased">
      {/* Top Header Banner */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* MAIN FRAME GENERATOR CARD */}
        <section id="builder-id-pass-section" className="space-y-4 scroll-mt-6">
          <div className="relative bg-[#f5f0e6] text-[#111827] border-2 border-[#111827] rounded-2xl p-5 sm:p-8 shadow-[6px_6px_0px_#111827]">
            {/* Pink Pin Accent Dot on top-left corner */}
            <div className="absolute -top-2.5 left-6 w-5 h-5 rounded-full bg-[#ff007a] border-2 border-[#111827] shadow-sm z-10" />

            {/* Card Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff007a]" />
                <h2 className="text-2xl sm:text-3xl font-black font-display text-[#111827] tracking-tight">
                  {activeTab === "frame" ? "Customize Profile Frame" : "Create Builder ID Pass"}
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-mono-retro text-[#111827]/80 leading-relaxed font-semibold">
                {activeTab === "frame"
                  ? "Upload your photo, fine-tune position & color grading, and download your verified #FrameInGoa PFP."
                  : "Fill in your builder credentials, pick your theme, and generate your high-signal event pass."}
              </p>
            </div>

            {/* Interactive Workspace Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6 pt-6 border-t-2 border-[#111827]/10">
              {/* Left Column: Upload & Controls (5 cols for badge, 6 cols for frame) */}
              <div className={`${activeTab === "frame" ? "lg:col-span-6" : "lg:col-span-5"} space-y-5`}>
                <PhotoUploader
                  currentImage={currentImage}
                  onImageSelected={(imgData) => setCurrentImage(imgData)}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "frame" ? (
                      <FrameEditor
                        selectedStyle={selectedStyle}
                        setSelectedStyle={setSelectedStyle}
                        adjustments={adjustments}
                        setAdjustments={setAdjustments}
                      />
                    ) : (
                      <BadgeEditor
                        badgeData={badgeData}
                        setBadgeData={setBadgeData}
                        selectedTheme={selectedTheme}
                        setSelectedTheme={setSelectedTheme}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Column: Live Interactive Canvas Preview (7 cols for badge, 6 cols for frame) */}
              <div className={`${activeTab === "frame" ? "lg:col-span-6" : "lg:col-span-7"} lg:sticky lg:top-6 space-y-4`}>
                <CanvasPreview
                  activeTab={activeTab}
                  currentImage={currentImage}
                  selectedStyle={selectedStyle}
                  selectedTheme={selectedTheme}
                  adjustments={adjustments}
                  setAdjustments={setAdjustments}
                  badgeData={badgeData}
                  onOpenShareModal={() => setIsShareModalOpen(true)}
                  canvasRef={canvasRef}
                />
              </div>
            </div>
          </div>

          {/* Under-Card Callout */}
          <div className="text-center font-mono-retro text-xs sm:text-sm text-[#fffdf5]/90 pt-2 font-medium">
            Post your frame on X with <span className="text-[#ff007a] font-bold">#FrameInGoa</span> & tag <span className="text-[#ffd200] font-bold">@HackerHouseGoa</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-[#083421] border-t-2 border-[#ffd200]/30 py-8 text-center text-xs font-mono-retro text-[#fffdf5]/70">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#ffd200] font-bold">HH GOA 2026</span>
            <span>·</span>
            <span className="text-[#ff007a] font-bold">#FrameInGoa</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span>BRAND KIT</span>
            <span>·</span>
            <span>Built for HH Goa 2026 builders & attendees.</span>
          </div>
        </div>
      </footer>

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareModal
          shareState={shareState}
          onClose={() => setIsShareModalOpen(false)}
          onShare={handleCreateShareLink}
          onCopyLink={handleCopyLink}
          badgeData={badgeData}
          activeTab={activeTab}
          canvasRef={canvasRef}
        />
      )}
    </div>
  );
}
