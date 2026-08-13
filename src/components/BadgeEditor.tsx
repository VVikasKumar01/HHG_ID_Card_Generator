import React, { useState } from "react";
import { BuilderBadgeData, BadgeThemeId } from "../types";
import { SAMPLE_BUILDER_TITLES } from "../data/builderTitles";
import { Sparkles, Loader2, Shield, RefreshCw, Terminal, Luggage, Rocket, Github, Twitter, Layers, Phone } from "lucide-react";

interface BadgeEditorProps {
  badgeData: BuilderBadgeData;
  setBadgeData: React.Dispatch<React.SetStateAction<BuilderBadgeData>>;
  selectedTheme?: BadgeThemeId;
  setSelectedTheme?: (theme: BadgeThemeId) => void;
}

const BUILDER_CLASSES = [
  "TERMINAL WIZARD",
  "PROTOCOL ARCHITECT",
  "AI ALCHEMIST",
  "FULLSTACK NOMAD",
  "FRONTEND CRAFTSMAN",
  "DEPIN PIONEER",
  "SOLANA NINJA",
  "RUST SPEEDRUNNER",
];

export const BadgeEditor: React.FC<BadgeEditorProps> = ({
  badgeData,
  setBadgeData,
}) => {
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  const handleGenerateTitle = async () => {
    setIsGeneratingTitle(true);
    try {
      const response = await fetch("/api/generate-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: badgeData.name,
          role: badgeData.role,
          stack: badgeData.stack,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.title) {
          setBadgeData((prev) => ({ ...prev, builderTitle: data.title }));
        }
      } else {
        const randomTitle =
          SAMPLE_BUILDER_TITLES[
            Math.floor(Math.random() * SAMPLE_BUILDER_TITLES.length)
          ];
        setBadgeData((prev) => ({ ...prev, builderTitle: randomTitle }));
      }
    } catch {
      const randomTitle =
        SAMPLE_BUILDER_TITLES[
          Math.floor(Math.random() * SAMPLE_BUILDER_TITLES.length)
        ];
      setBadgeData((prev) => ({ ...prev, builderTitle: randomTitle }));
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const generateRandomSerial = () => {
    const num = Math.floor(Math.random() * 8999) + 1000;
    const serialStr = num.toString();
    setBadgeData((prev) => ({
      ...prev,
      serialNumber: serialStr.substring(0, 3),
      builderId: `#HH-GOA-${serialStr}`,
    }));
  };

  return (
    <div className="space-y-5 text-[#111827]">
      {/* PROFILE & IDENTITY PASS DETAILS */}
      <div className="bg-[#fffdf2] border-2 border-[#111827] rounded-2xl p-4 sm:p-5 space-y-4 shadow-[2px_2px_0px_#111827]">
        <label className="text-xs font-mono-retro font-black uppercase tracking-wider text-[#ff007a] flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>Identity Credentials & Details</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="badge-user-name" className="block text-[11px] font-mono-retro font-bold text-[#111827] mb-1 uppercase">
              Your Name
            </label>
            <input
              id="badge-user-name"
              type="text"
              value={badgeData.name}
              onChange={(e) =>
                setBadgeData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Alex Rivera"
              className="w-full bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] placeholder-[#111827]/40 focus:outline-none focus:border-[#ff007a] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="badge-user-role" className="block text-[11px] font-mono-retro font-bold text-[#111827] mb-1 uppercase">
              Primary Role / Skill
            </label>
            <input
              id="badge-user-role"
              type="text"
              value={badgeData.role}
              onChange={(e) =>
                setBadgeData((prev) => ({ ...prev, role: e.target.value }))
              }
              placeholder="e.g. Full Stack Developer"
              className="w-full bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] placeholder-[#111827]/40 focus:outline-none focus:border-[#ff007a] transition-colors"
            />
          </div>
        </div>

        {/* Project Name & Builder Class */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="project-name-input" className="block text-[11px] font-mono-retro font-bold text-[#111827] mb-1 uppercase flex items-center gap-1">
              <Rocket className="w-3 h-3 text-[#ff007a]" />
              <span>Startup / Project Name</span>
            </label>
            <input
              id="project-name-input"
              type="text"
              value={badgeData.projectName || ""}
              onChange={(e) => setBadgeData((prev) => ({ ...prev, projectName: e.target.value }))}
              placeholder="e.g. Solana Agent Kit"
              className="w-full bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] placeholder-[#111827]/40 focus:outline-none focus:border-[#ff007a] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="builder-class-select" className="block text-[11px] font-mono-retro font-bold text-[#111827] mb-1 uppercase flex items-center gap-1">
              <Terminal className="w-3 h-3 text-[#ff007a]" />
              <span>Builder Class</span>
            </label>
            <select
              id="builder-class-select"
              value={badgeData.builderClass || "TERMINAL WIZARD"}
              onChange={(e) =>
                setBadgeData((prev) => ({ ...prev, builderClass: e.target.value }))
              }
              className="w-full bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#ff007a] transition-colors"
            >
              {BUILDER_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Beach Bag Items */}
        <div>
          <label htmlFor="beach-bag-input" className="block text-[11px] font-mono-retro font-bold text-[#111827] mb-1 uppercase flex items-center gap-1">
            <Luggage className="w-3 h-3 text-[#ff007a]" />
            <span>Beach Bag Essentials (Comma separated)</span>
          </label>
          <input
            id="beach-bag-input"
            type="text"
            value={(badgeData.beachBag || ["COCONUT", "VS CODE", "LO-FI BEATS"]).join(", ")}
            onChange={(e) =>
              setBadgeData((prev) => ({
                ...prev,
                beachBag: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              }))
            }
            placeholder="COCONUT, VS CODE, LO-FI BEATS"
            className="w-full bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] placeholder-[#111827]/40 focus:outline-none focus:border-[#ff007a] transition-colors"
          />
        </div>

        {/* Currently Shipping */}
        <div>
          <label htmlFor="currently-shipping-input" className="block text-[11px] font-mono-retro font-bold text-[#111827] mb-1 uppercase flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#ff007a]" />
            <span>Currently Shipping</span>
          </label>
          <input
            id="currently-shipping-input"
            type="text"
            value={badgeData.currentlyShipping || "BUILDING THE FUTURE"}
            onChange={(e) =>
              setBadgeData((prev) => ({ ...prev, currentlyShipping: e.target.value }))
            }
            placeholder="e.g. AI Agents on Edge"
            className="w-full bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] placeholder-[#111827]/40 focus:outline-none focus:border-[#ff007a] transition-colors"
          />
        </div>

        {/* Builder Title with AI Generator */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="builder-title-input" className="text-[11px] font-mono-retro font-bold text-[#111827] uppercase">
              Builder Tagline / Title
            </label>
            <button
              type="button"
              onClick={handleGenerateTitle}
              disabled={isGeneratingTitle}
              className="text-[11px] font-black text-[#ff007a] hover:underline flex items-center gap-1 transition-colors disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-[#ff007a] cursor-pointer"
            >
              {isGeneratingTitle ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3 text-[#ffd200]" />
              )}
              <span>✨ Generate with AI</span>
            </button>
          </div>

          <input
            id="builder-title-input"
            type="text"
            value={badgeData.builderTitle}
            onChange={(e) =>
              setBadgeData((prev) => ({ ...prev, builderTitle: e.target.value }))
            }
            placeholder="e.g. LLM Whisperer & Sunset Chaser"
            className="w-full bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] placeholder-[#111827]/40 focus:outline-none focus:border-[#ff007a] transition-colors"
          />
        </div>

        {/* Handles, Contact & Serial */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#111827]/10">
          <div>
            <label htmlFor="x-handle-input" className="block text-[11px] font-mono-retro font-bold text-[#111827] mb-1 uppercase flex items-center gap-1">
              <Twitter className="w-3 h-3 text-[#1d9bf0]" />
              <span>X Handle</span>
            </label>
            <input
              id="x-handle-input"
              type="text"
              value={badgeData.xHandle || ""}
              onChange={(e) =>
                setBadgeData((prev) => ({ ...prev, xHandle: e.target.value }))
              }
              placeholder="e.g. alex_builder"
              className="w-full bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] placeholder-[#111827]/40 focus:outline-none focus:border-[#ff007a] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="github-handle-input" className="block text-[11px] font-mono-retro font-bold text-[#111827] mb-1 uppercase flex items-center gap-1">
              <Github className="w-3 h-3 text-[#111827]" />
              <span>GitHub Handle</span>
            </label>
            <input
              id="github-handle-input"
              type="text"
              value={badgeData.githubHandle || ""}
              onChange={(e) =>
                setBadgeData((prev) => ({ ...prev, githubHandle: e.target.value }))
              }
              placeholder="e.g. alexrivera"
              className="w-full bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] placeholder-[#111827]/40 focus:outline-none focus:border-[#ff007a] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="contact-no-input" className="block text-[11px] font-mono-retro font-bold text-[#111827] mb-1 uppercase flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#e6005c]" />
              <span>Contact No.</span>
            </label>
            <input
              id="contact-no-input"
              type="text"
              value={badgeData.contactNo || ""}
              onChange={(e) =>
                setBadgeData((prev) => ({ ...prev, contactNo: e.target.value }))
              }
              placeholder="e.g. +91 98765 43210"
              className="w-full bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] placeholder-[#111827]/40 focus:outline-none focus:border-[#ff007a] transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="builder-id-input" className="text-[11px] font-mono-retro font-bold text-[#111827] uppercase">
                ID Pass #
              </label>
              <button
                type="button"
                onClick={generateRandomSerial}
                className="text-[10px] font-mono-retro font-bold text-[#111827]/70 hover:text-[#ff007a] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Randomize</span>
              </button>
            </div>
            <div className="flex items-center gap-1 bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-mono-retro font-black text-[#111827]">
              <span>#</span>
              <input
                id="builder-id-input"
                type="text"
                value={badgeData.builderId || `#HH-GOA-${badgeData.serialNumber || "7757"}`}
                onChange={(e) =>
                  setBadgeData((prev) => ({
                    ...prev,
                    builderId: e.target.value,
                  }))
                }
                className="bg-transparent text-[#ff007a] focus:outline-none w-full font-black text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
