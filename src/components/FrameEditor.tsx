import React from "react";
import { FrameStyleId, ImageAdjustments } from "../types";
import { FramePicker } from "./FramePicker";
import { Sliders, RotateCw, FlipHorizontal, Sun, RefreshCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface FrameEditorProps {
  selectedStyle: FrameStyleId;
  setSelectedStyle: (style: FrameStyleId) => void;
  adjustments: ImageAdjustments;
  setAdjustments: React.Dispatch<React.SetStateAction<ImageAdjustments>>;
}

export const FrameEditor: React.FC<FrameEditorProps> = ({
  selectedStyle,
  setSelectedStyle,
  adjustments,
  setAdjustments,
}) => {
  const handleRotate = () => {
    setAdjustments((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  };

  const handleFlip = () => {
    setAdjustments((prev) => ({
      ...prev,
      flipH: !prev.flipH,
    }));
  };

  const handleNudge = (dx: number, dy: number) => {
    setAdjustments((prev) => ({
      ...prev,
      panX: prev.panX + dx,
      panY: prev.panY + dy,
    }));
  };

  const resetAdjustments = () => {
    setAdjustments({
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
  };

  return (
    <div className="space-y-5 text-[#111827]">
      {/* PFP Frame Template Chooser (6 Styles) */}
      <FramePicker
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
      />

      {/* Manual Fine-Tuning Controls */}
      <div className="bg-[#fffdf2] border-2 border-[#111827] rounded-2xl p-4 sm:p-5 space-y-4 shadow-[2px_2px_0px_#111827]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono-retro font-black uppercase tracking-wider text-[#ff007a] flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Position & Scale Controls</span>
          </label>
          <button
            type="button"
            onClick={resetAdjustments}
            className="text-[11px] font-mono-retro font-bold text-[#111827]/70 hover:text-[#ff007a] flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>

        {/* Precision Nudge D-Pad for Keyboard/Touch Alignment */}
        <div className="bg-white border-2 border-[#111827] p-3 rounded-xl flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-[#111827]">Nudge Photo Position:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleNudge(-10, 0)}
              className="p-1.5 rounded-lg bg-[#ffd200] border-2 border-[#111827] text-[#111827] hover:bg-[#ffe033]"
              title="Nudge Left"
              aria-label="Nudge Left"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => handleNudge(0, -10)}
                className="p-1.5 rounded-lg bg-[#ffd200] border-2 border-[#111827] text-[#111827] hover:bg-[#ffe033]"
                title="Nudge Up"
                aria-label="Nudge Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleNudge(0, 10)}
                className="p-1.5 rounded-lg bg-[#ffd200] border-2 border-[#111827] text-[#111827] hover:bg-[#ffe033]"
                title="Nudge Down"
                aria-label="Nudge Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleNudge(10, 0)}
              className="p-1.5 rounded-lg bg-[#ffd200] border-2 border-[#111827] text-[#111827] hover:bg-[#ffe033]"
              title="Nudge Right"
              aria-label="Nudge Right"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Zoom Slider & Orientation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between text-xs text-[#111827] mb-1 font-bold">
              <label htmlFor="zoom-scale-range">Zoom Scale</label>
              <span className="text-[#ff007a] font-mono-retro">
                {adjustments.zoom.toFixed(2)}x
              </span>
            </div>
            <input
              id="zoom-scale-range"
              type="range"
              min="0.5"
              max="2.5"
              step="0.05"
              value={adjustments.zoom}
              onChange={(e) =>
                setAdjustments((prev) => ({
                  ...prev,
                  zoom: parseFloat(e.target.value),
                }))
              }
              className="w-full accent-[#ff007a] bg-[#111827]/20 h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff007a]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRotate}
              className="flex-1 py-2 rounded-xl hh-btn-yellow text-xs flex items-center justify-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#ff007a]" />
              <span>Rotate 90°</span>
            </button>

            <button
              type="button"
              onClick={handleFlip}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border-2 border-[#111827] ${
                adjustments.flipH
                  ? "bg-[#ff007a] text-white shadow-[2px_2px_0px_#111827]"
                  : "bg-white text-[#111827] hover:bg-[#ffd200]"
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span>Flip</span>
            </button>
          </div>
        </div>

        {/* Pan Offset Sliders */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#111827]/10">
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#111827]/80 mb-1">
              <label htmlFor="pan-x-range">Pan Horizontal</label>
              <span className="font-mono-retro">{adjustments.panX}px</span>
            </div>
            <input
              id="pan-x-range"
              type="range"
              min="-250"
              max="250"
              step="5"
              value={adjustments.panX}
              onChange={(e) =>
                setAdjustments((prev) => ({
                  ...prev,
                  panX: parseInt(e.target.value, 10),
                }))
              }
              className="w-full accent-[#ff007a] bg-[#111827]/20 h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff007a]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#111827]/80 mb-1">
              <label htmlFor="pan-y-range">Pan Vertical</label>
              <span className="font-mono-retro">{adjustments.panY}px</span>
            </div>
            <input
              id="pan-y-range"
              type="range"
              min="-250"
              max="250"
              step="5"
              value={adjustments.panY}
              onChange={(e) =>
                setAdjustments((prev) => ({
                  ...prev,
                  panY: parseInt(e.target.value, 10),
                }))
              }
              className="w-full accent-[#ff007a] bg-[#111827]/20 h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff007a]"
            />
          </div>
        </div>

        {/* Brightness / Contrast */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#111827]/10">
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#111827]/80 mb-1">
              <label htmlFor="brightness-range" className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-[#ff007a]" />
                <span>Brightness</span>
              </label>
              <span className="font-mono-retro">{adjustments.brightness}%</span>
            </div>
            <input
              id="brightness-range"
              type="range"
              min="50"
              max="150"
              step="2"
              value={adjustments.brightness}
              onChange={(e) =>
                setAdjustments((prev) => ({
                  ...prev,
                  brightness: parseInt(e.target.value, 10),
                }))
              }
              className="w-full accent-[#ff007a] bg-[#111827]/20 h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff007a]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#111827]/80 mb-1">
              <label htmlFor="contrast-range">Contrast</label>
              <span className="font-mono-retro">{adjustments.contrast}%</span>
            </div>
            <input
              id="contrast-range"
              type="range"
              min="50"
              max="150"
              step="2"
              value={adjustments.contrast}
              onChange={(e) =>
                setAdjustments((prev) => ({
                  ...prev,
                  contrast: parseInt(e.target.value, 10),
                }))
              }
              className="w-full accent-[#ff007a] bg-[#111827]/20 h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff007a]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
