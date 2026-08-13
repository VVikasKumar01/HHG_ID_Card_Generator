import React from "react";
import { FrameStyleId } from "../types";
import { Palette, Check } from "lucide-react";

interface FramePickerProps {
  selectedStyle: FrameStyleId;
  setSelectedStyle: (style: FrameStyleId) => void;
}

export interface FrameOption {
  id: FrameStyleId;
  num: string;
  name: string;
  tagline: string;
  renderThumbnail: () => React.ReactNode;
}

export const FRAME_OPTIONS: FrameOption[] = [
  {
    id: "goa_beach_poster",
    num: "#1",
    name: "Goa Beach Poster",
    tagline: "Masterpiece",
    renderThumbnail: () => (
      <svg viewBox="0 0 160 160" className="w-full h-full rounded-lg overflow-hidden">
        {/* Background Canvas */}
        <rect width="160" height="160" fill="#f6f0e2" />
        <rect width="160" height="160" fill="none" stroke="#083421" strokeWidth="6" />
        <rect x="5" y="5" width="150" height="150" fill="none" stroke="#ffd200" strokeWidth="2" />
        
        {/* Sun & Rays */}
        <circle cx="80" cy="55" r="38" fill="#ffd200" opacity="0.9" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
          <line
            key={i}
            x1="80"
            y1="55"
            x2={80 + 55 * Math.cos((deg * Math.PI) / 180)}
            y2={55 + 55 * Math.sin((deg * Math.PI) / 180)}
            stroke="#f5a623"
            strokeWidth="2"
            opacity="0.6"
          />
        ))}

        {/* Ocean & Beach Sand */}
        <path d="M 0 115 Q 40 108 80 115 Q 120 122 160 115 L 160 160 L 0 160 Z" fill="#f0d890" />
        <path d="M 0 130 Q 40 122 80 130 Q 120 138 160 130 L 160 160 L 0 160 Z" fill="#e5c875" />

        {/* Center Photo Cutout */}
        <circle cx="80" cy="80" r="42" fill="#083421" stroke="#ffd200" strokeWidth="3" />
        <circle cx="80" cy="80" r="39" fill="none" stroke="#ff007a" strokeWidth="1.5" />

        {/* Left Palm Tree */}
        <path d="M 22 140 Q 28 100 35 75" fill="none" stroke="#0d5235" strokeWidth="5" strokeLinecap="round" />
        <path d="M 35 75 Q 10 65 5 75 M 35 75 Q 15 50 22 45 M 35 75 Q 38 45 48 50 M 35 75 Q 52 62 55 75" fill="none" stroke="#0d5235" strokeWidth="3" strokeLinecap="round" />

        {/* Right Palm Tree */}
        <path d="M 138 140 Q 132 100 125 75" fill="none" stroke="#0d5235" strokeWidth="5" strokeLinecap="round" />
        <path d="M 125 75 Q 150 65 155 75 M 125 75 Q 145 50 138 45 M 125 75 Q 122 45 112 50 M 125 75 Q 108 62 105 75" fill="none" stroke="#0d5235" strokeWidth="3" strokeLinecap="round" />

        {/* Hibiscus Corner Flowers */}
        {/* Top Left */}
        <circle cx="14" cy="14" r="9" fill="#ff007a" />
        <circle cx="14" cy="14" r="3" fill="#ffd200" />
        {/* Top Right */}
        <circle cx="146" cy="14" r="9" fill="#ff007a" />
        <circle cx="146" cy="14" r="3" fill="#ffd200" />
        {/* Bottom Left */}
        <circle cx="14" cy="146" r="9" fill="#ff007a" />
        <circle cx="14" cy="146" r="3" fill="#ffd200" />
        {/* Bottom Right */}
        <circle cx="146" cy="146" r="9" fill="#ff007a" />
        <circle cx="146" cy="146" r="3" fill="#ffd200" />
      </svg>
    ),
  },
  {
    id: "sunset_horizon",
    num: "#2",
    name: "Sunset Horizon",
    tagline: "Spacious",
    renderThumbnail: () => (
      <svg viewBox="0 0 160 160" className="w-full h-full rounded-lg overflow-hidden">
        {/* Sunset Sky */}
        <defs>
          <linearGradient id="sunsetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff3e0" />
            <stop offset="50%" stopColor="#ffcc80" />
            <stop offset="100%" stopColor="#ffab91" />
          </linearGradient>
        </defs>
        <rect width="160" height="160" fill="url(#sunsetGrad)" />
        <rect width="160" height="160" fill="none" stroke="#4a1204" strokeWidth="6" />

        {/* Big Setting Sun */}
        <circle cx="80" cy="70" r="45" fill="#ff9800" opacity="0.85" />
        <circle cx="80" cy="70" r="35" fill="#ffd54f" opacity="0.9" />

        {/* Beach Dunes */}
        <path d="M 0 120 Q 50 110 100 122 Q 130 128 160 118 L 160 160 L 0 160 Z" fill="#f0b27a" />

        {/* Center Photo Cutout */}
        <circle cx="80" cy="80" r="42" fill="#083421" stroke="#ff5722" strokeWidth="3" />
        <circle cx="80" cy="80" r="39" fill="none" stroke="#ffd200" strokeWidth="1.5" />

        {/* Symmetrical Palms */}
        <path d="M 18 150 Q 30 100 42 62" fill="none" stroke="#4a1204" strokeWidth="4.5" />
        <path d="M 42 62 Q 20 50 15 60 M 42 62 Q 28 38 35 32 M 42 62 Q 48 38 58 42" fill="none" stroke="#388e3c" strokeWidth="3" />

        <path d="M 142 150 Q 130 100 118 62" fill="none" stroke="#4a1204" strokeWidth="4.5" />
        <path d="M 118 62 Q 140 50 145 60 M 118 62 Q 132 38 125 32 M 118 62 Q 112 38 102 42" fill="none" stroke="#388e3c" strokeWidth="3" />

        {/* Bottom Corner Hibiscus */}
        <circle cx="20" cy="142" r="10" fill="#e91e63" />
        <circle cx="20" cy="142" r="3" fill="#ffeb3b" />
        <circle cx="140" cy="142" r="10" fill="#e91e63" />
        <circle cx="140" cy="142" r="3" fill="#ffeb3b" />
      </svg>
    ),
  },
  {
    id: "tropical_oasis",
    num: "#3",
    name: "Tropical Oasis",
    tagline: "Intricate",
    renderThumbnail: () => (
      <svg viewBox="0 0 160 160" className="w-full h-full rounded-lg overflow-hidden">
        <rect width="160" height="160" fill="#f5f5ee" />
        <rect width="160" height="160" fill="none" stroke="#083421" strokeWidth="6" />

        {/* Sky / Sun */}
        <circle cx="80" cy="45" r="22" fill="#ffd200" opacity="0.8" />

        {/* Portuguese Villa Left */}
        <rect x="8" y="65" width="32" height="45" fill="#fffdf5" stroke="#083421" strokeWidth="2" />
        <polygon points="4,65 24,50 44,65" fill="#d32f2f" stroke="#083421" strokeWidth="1.5" />
        <rect x="14" y="75" width="8" height="12" rx="4" fill="#0d5235" />
        <rect x="26" y="75" width="8" height="12" rx="4" fill="#0d5235" />

        {/* Portuguese Villa Right */}
        <rect x="120" y="65" width="32" height="45" fill="#fff3e0" stroke="#083421" strokeWidth="2" />
        <polygon points="116,65 136,50 156,65" fill="#d32f2f" stroke="#083421" strokeWidth="1.5" />
        <rect x="126" y="75" width="8" height="12" rx="4" fill="#0d5235" />

        {/* Center Cutout */}
        <circle cx="80" cy="80" r="42" fill="#fffdf5" stroke="#083421" strokeWidth="3" />
        <circle cx="80" cy="80" r="39" fill="none" stroke="#ffd200" strokeWidth="1.5" />

        {/* Beach dune + Sailboat & Scooter */}
        <path d="M 0 125 Q 80 115 160 125 L 160 160 L 0 160 Z" fill="#ffd200" />
        {/* Sailboat */}
        <polygon points="70,145 90,145 85,152 75,152" fill="#083421" />
        <polygon points="80,130 80,144 92,144" fill="#ff007a" />
        {/* Scooter */}
        <ellipse cx="110" cy="148" rx="8" ry="4" fill="#ff007a" />

        {/* Hibiscus flowers */}
        <circle cx="14" cy="146" r="8" fill="#ff007a" />
        <circle cx="146" cy="146" r="8" fill="#ff007a" />
      </svg>
    ),
  },
  {
    id: "azulejo_heritage",
    num: "#4",
    name: "Azulejo Heritage",
    tagline: "Vintage",
    renderThumbnail: () => (
      <svg viewBox="0 0 160 160" className="w-full h-full rounded-lg overflow-hidden">
        {/* Azulejo Blue Tile Border */}
        <rect width="160" height="160" fill="#003e7e" />
        
        {/* Tile Diamond Pattern */}
        <g opacity="0.35" stroke="#ffffff" strokeWidth="1" fill="none">
          <path d="M 0 0 L 20 20 L 0 40 L 20 60 L 0 80 L 20 100 L 0 120 L 20 140 L 0 160" />
          <path d="M 160 0 L 140 20 L 160 40 L 140 60 L 160 80 L 140 100 L 160 120 L 140 140 L 160 160" />
          <path d="M 0 0 L 20 0 L 40 20 L 60 0 L 80 20 L 100 0 L 120 20 L 140 0 L 160 0" />
          <path d="M 0 160 L 20 160 L 40 140 L 60 160 L 80 140 L 100 160 L 120 140 L 140 160 L 160 160" />
        </g>

        {/* Sunburst Floral Radial Rays */}
        <g transform="translate(80, 80)">
          {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map((angle, i) => (
            <polygon
              key={i}
              points="0,-60 6,-45 -6,-45"
              fill={i % 2 === 0 ? "#ff007a" : "#ffd200"}
              transform={`rotate(${angle})`}
            />
          ))}
        </g>

        {/* Center Cutout */}
        <circle cx="80" cy="80" r="42" fill="#ffffff" stroke="#002b5b" strokeWidth="4" />
        <circle cx="80" cy="80" r="38" fill="none" stroke="#ffd200" strokeWidth="2" />

        {/* Ribbon Banner at bottom */}
        <path d="M 25 130 Q 80 122 135 130 L 128 148 Q 80 140 32 148 Z" fill="#ff007a" stroke="#ffffff" strokeWidth="1.5" />
        <text x="80" y="141" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="monospace">
          HACKER HOUSE GOA '26
        </text>
      </svg>
    ),
  },
  {
    id: "hibiscus_palms",
    num: "#5",
    name: "Hibiscus Palms",
    tagline: "Artistic",
    renderThumbnail: () => (
      <svg viewBox="0 0 160 160" className="w-full h-full rounded-lg overflow-hidden">
        <rect width="160" height="160" fill="#0d4229" />
        <rect width="160" height="160" fill="none" stroke="#f0d890" strokeWidth="4" />

        {/* Sunset Circle Glow */}
        <circle cx="80" cy="72" r="58" fill="#f0a020" opacity="0.9" />

        {/* Center Photo Cutout */}
        <circle cx="80" cy="80" r="42" fill="#083421" stroke="#f0d890" strokeWidth="4" />

        {/* Surfboards on left */}
        <ellipse cx="22" cy="115" rx="5" ry="22" fill="#ff007a" transform="rotate(-15 22 115)" />
        <ellipse cx="32" cy="118" rx="5" ry="20" fill="#00f0ff" transform="rotate(-10 32 118)" />

        {/* Scooter on right */}
        <ellipse cx="132" cy="125" rx="10" ry="5" fill="#ff007a" />
        <circle cx="125" cy="130" r="4" fill="#000000" />
        <circle cx="139" cy="130" r="4" fill="#000000" />

        {/* Dense Hibiscus flowers around frame */}
        <circle cx="20" cy="20" r="10" fill="#ff007a" />
        <circle cx="140" cy="20" r="10" fill="#ff007a" />
        <circle cx="20" cy="140" r="10" fill="#ffd200" />
        <circle cx="140" cy="140" r="10" fill="#ffd200" />

        <text x="80" y="148" textAnchor="middle" fill="#f0d890" fontSize="7" fontWeight="bold" fontFamily="monospace">
          TROPICAL PARADISE
        </text>
      </svg>
    ),
  },
  {
    id: "coastal_sunset",
    num: "#6",
    name: "Coastal Sunset",
    tagline: "Vibrant",
    renderThumbnail: () => (
      <svg viewBox="0 0 160 160" className="w-full h-full rounded-lg overflow-hidden">
        {/* Background Canvas */}
        <rect width="160" height="160" fill="#f6f0e2" />
        <rect width="160" height="160" fill="none" stroke="#083421" strokeWidth="6" />

        {/* Coastal Waters */}
        <path d="M 0 100 Q 40 85 80 100 Q 120 115 160 100 L 160 160 L 0 160 Z" fill="#00a896" />
        <path d="M 0 120 Q 40 110 80 120 Q 120 130 160 120 L 160 160 L 0 160 Z" fill="#028090" />

        {/* Center Photo Cutout */}
        <circle cx="80" cy="80" r="42" fill="#083421" stroke="#f0d890" strokeWidth="3" />
        <circle cx="80" cy="80" r="39" fill="none" stroke="#e63946" strokeWidth="1.5" />

        {/* Palm Frond Canopy */}
        <path d="M 0 0 Q 40 30 80 15" fill="none" stroke="#05668d" strokeWidth="4" />
        <path d="M 160 0 Q 120 30 80 15" fill="none" stroke="#05668d" strokeWidth="4" />

        {/* Hibiscus flowers */}
        <circle cx="16" cy="16" r="9" fill="#e63946" />
        <circle cx="144" cy="16" r="9" fill="#e63946" />
        <circle cx="16" cy="144" r="9" fill="#ffb703" />
        <circle cx="144" cy="144" r="9" fill="#ffb703" />
      </svg>
    ),
  },
];

export const FramePicker: React.FC<FramePickerProps> = ({
  selectedStyle,
  setSelectedStyle,
}) => {
  const currentOption = FRAME_OPTIONS.find((opt) => opt.id === selectedStyle) || FRAME_OPTIONS[0];

  return (
    <div className="bg-[#083421] border-2 border-[#115e3b] rounded-2xl p-3.5 sm:p-5 text-[#fffdf5] shadow-[4px_4px_0px_#111827]">
      {/* Section Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-[#115e3b]">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#ffd200]" />
          <span className="text-xs sm:text-sm font-mono-retro font-black tracking-wider uppercase text-[#ffd200]">
            CHOOSE PFP FRAME TEMPLATE (6 STYLES)
          </span>
        </div>

        <div className="text-[11px] font-mono-retro font-bold text-[#f0d890]/90">
          Selected: <span className="text-[#ffd200]">{currentOption.num} — {currentOption.name}</span>
        </div>
      </div>

      {/* 6 Template Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {FRAME_OPTIONS.map((option) => {
          const isSelected = selectedStyle === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedStyle(option.id)}
              className={`relative group rounded-xl p-2 transition-all text-left flex flex-col items-center cursor-pointer border-2 ${
                isSelected
                  ? "bg-[#0d4a30] border-[#ffd200] ring-2 ring-[#ffd200]/40 shadow-[0_0_12px_rgba(255,210,0,0.25)]"
                  : "bg-[#062c1b] border-[#115e3b] hover:border-[#ffd200]/60 hover:bg-[#0a3822]"
              }`}
            >
              {/* Checkmark Badge on Selected */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10 w-5 h-5 rounded-full bg-[#ffd200] text-[#083421] flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Frame Thumbnail Preview */}
              <div className="w-full aspect-square relative mb-2 overflow-hidden rounded-lg border border-[#083421]">
                {option.renderThumbnail()}
              </div>

              {/* Card Label */}
              <span className="text-[12px] font-bold text-white text-center leading-tight truncate w-full">
                {option.name}
              </span>

              {/* Card Subtitle */}
              <span className="text-[10px] font-mono-retro text-[#f0d890]/80 text-center mt-0.5">
                {option.tagline}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
