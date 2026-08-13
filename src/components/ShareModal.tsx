import React, { useEffect, useState, useCallback } from "react";
import { ShareState, BuilderBadgeData } from "../types";
import { X, Copy, Check, Twitter, Sparkles, ExternalLink, Loader2 } from "lucide-react";

interface ShareModalProps {
  shareState: ShareState;
  onClose: () => void;
  onShare: () => Promise<void>;
  onCopyLink: () => void;
  badgeData: BuilderBadgeData;
  activeTab: "frame" | "badge";
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  shareState,
  onClose,
  onShare,
  onCopyLink,
  badgeData,
  activeTab,
  canvasRef,
}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // Generate a thumbnail preview from canvas when modal opens
  useEffect(() => {
    if (canvasRef.current) {
      try {
        const dataUrl = canvasRef.current.toDataURL("image/png", 0.7);
        setThumbnailUrl(dataUrl);
      } catch (err) {
        console.error("Failed to generate preview thumbnail:", err);
      }
    }
  }, [canvasRef]);

  // Handle Escape Key to Close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Generate X (Twitter) Tweet Intent
  const tweetText = encodeURIComponent(
    `I just created my verified ${
      activeTab === "frame" ? "PFP Profile Frame" : "Builder ID Pass"
    } for @HackerHouseGoa 2026 by 2:47pm Studio! 🌴🌅\n\nBuild in Goa, ship from paradise.\n\nMake yours here: `
  );

  const shareLinkToUse = shareState.shareUrl || window.location.href;
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(
    shareLinkToUse
  )}&hashtags=FrameInGoa,HackerHouseGoa2026,BuildInGoa`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share your profile pass"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#fffdf2] border-3 border-[#111827] rounded-2xl p-5 sm:p-6 text-[#111827] shadow-[6px_6px_0px_#111827] relative space-y-4"
      >
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border-2 border-[#111827] flex items-center justify-center text-[#111827] hover:bg-[#ff007a] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff007a]"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-[#ff007a]">
          <Sparkles className="w-5 h-5 fill-current" />
          <h2 className="text-lg font-mono-retro font-black uppercase tracking-wider">
            Share Your #FrameInGoa
          </h2>
        </div>

        {/* Live Thumbnail Preview */}
        {thumbnailUrl && (
          <div className="w-full flex justify-center">
            <div
              className="relative max-h-48 overflow-hidden rounded-xl border-2 border-[#111827] bg-[#0d5235] shadow-md"
              style={{ aspectRatio: activeTab === "frame" ? "1 / 1" : "16 / 9" }}
            >
              <img
                src={thumbnailUrl}
                alt="Generated pass preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Subtitle */}
        <p className="text-xs font-semibold text-[#111827]/80 leading-relaxed">
          Post your verified {badgeData.name ? `${badgeData.name}'s` : "Hacker House"} pass on X (Twitter) & tag{" "}
          <span className="font-bold text-[#ff007a]">@HackerHouseGoa</span> to get featured on the builder wall!
        </p>

        {/* Generate Live Share Link Button if not created yet */}
        {!shareState.shareUrl && (
          <button
            type="button"
            onClick={onShare}
            disabled={shareState.isSharing}
            className="w-full py-3 px-4 rounded-xl hh-btn-yellow text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {shareState.isSharing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#ff007a]" />
                <span>Generating Unique Link...</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                <span>Create Shareable Pass Link</span>
              </>
            )}
          </button>
        )}

        {/* Share Link Input Box */}
        {shareState.shareUrl && (
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono-retro font-bold text-[#111827] uppercase">
              Your Public Pass Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareState.shareUrl}
                className="flex-1 bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-mono-retro text-[#111827] focus:outline-none"
              />
              <button
                type="button"
                onClick={onCopyLink}
                className="px-3.5 py-2 rounded-xl bg-[#ffd200] border-2 border-[#111827] font-bold text-xs flex items-center gap-1 hover:bg-[#ffe033] shadow-[2px_2px_0px_#111827]"
              >
                {shareState.copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#0d5235]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#111827]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Main Share Button Actions */}
        <div className="pt-2 flex flex-col gap-2">
          <a
            href={twitterIntentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl hh-btn-pink text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 text-center"
          >
            <Twitter className="w-4 h-4 fill-current" />
            <span>Post on X (Twitter)</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-white border-2 border-[#111827] text-xs font-black uppercase text-[#111827] hover:bg-[#ffd200] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
