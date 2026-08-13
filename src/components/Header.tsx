import React, { useState, useEffect } from "react";
import { AppTab } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, UserCheck, Sparkles, MapPin, Calendar, ExternalLink } from "lucide-react";

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [showDevanagari, setShowDevanagari] = useState(true);

  // Auto-toggle Goa between Devanagari (गोवा) and English (GOA) every 1.8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowDevanagari((prev) => !prev);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#025938] text-[#fffdf5] pt-4 pb-10 px-4 sm:px-6 lg:px-8 relative border-b-2 border-[#ffd200]/30 select-none overflow-hidden">
      {/* Background Layer: Custom Goa Sunset Vector Illustration Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Goa Beach Illustration Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-65 scale-105 transform"
          style={{ backgroundImage: `url('/SunRise.png')` }}
        />
        {/* Soft Emerald Gradient Overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#023d26]/75 via-[#025938]/50 to-[#023d26]/85" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ffd200]/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Top Navigation Row */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-6 sm:mb-8 relative z-20">
        {/* Left Logo: 2:47PM STUDIO Branding Image */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <img
              src="/2:47pm.png"
              alt="2:47PM STUDIO"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain mix-blend-screen filter contrast-125 brightness-110 select-none"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#023320] border border-[#ffd200]/40 text-[#ffd200] text-xs font-mono-retro font-bold">
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
            <span>GOA 2026 · AI × CRYPTO</span>
          </div>
        </div>

        {/* Right Controls: CHECK HYPE + APPLY Button */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="https://hhgoa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 font-mono-retro text-xs sm:text-sm font-bold text-[#fffdf5] hover:text-[#ffd200] tracking-widest transition-colors uppercase"
          >
            <span>CHECK HYPE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => {
              setActiveTab("badge");
              setTimeout(() => {
                const el = document.getElementById("builder-id-pass-section") || document.getElementById("tab-builder-badge");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }, 50);
            }}
            className="woven-ribbon-border relative inline-block bg-[#ffd200] text-[#000000] px-5 py-2 text-sm sm:text-base font-hero-serif font-black tracking-widest uppercase hover:brightness-105 transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            CREATE
          </button>
        </div>
      </div>

      {/* Main Hero Pro Showcase Frame */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Banner Visual Layer combining hero assets */}
        <div className="relative rounded-3xl bg-[#013521]/80 backdrop-blur-md border-2 border-[#ffd200]/50 p-4 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Subtle Beach Image Accent within the card */}
          <div 
            className="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none mix-blend-overlay rounded-3xl overflow-hidden"
            style={{ backgroundImage: `url('/SunRise.png')` }}
          />

          {/* Main Hero Banner Center Artwork */}
          <div className="relative z-10 text-center flex flex-col items-center">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff007a]/20 border border-[#ff007a] text-[#ffd200] font-mono-retro text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#ff007a] animate-pulse" />
              <span>Builder Kit 2026</span>
            </div>

            {/* Title Image Asset: Hacker House Banner */}
            <div className="relative w-full max-w-4xl mx-auto my-1 flex justify-center items-center">
              <img
                src="/Hacker house.png"
                alt="Hacker House Goa"
                className="w-full h-auto max-h-[160px] sm:max-h-[220px] md:max-h-[280px] object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)] select-none"
                referrerPolicy="no-referrer"
              />

              {/* Overlaid Continuously Toggling गोवा (Devanagari) / GOA (English) Badge */}
              <div 
                onClick={() => setShowDevanagari((prev) => !prev)}
                className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer select-none group"
                title="Click to toggle Goa manually"
              >
                <AnimatePresence mode="wait">
                  {showDevanagari ? (
                    <motion.span
                      key="devanagari-goa"
                      initial={{ scale: 0.3, rotate: -15, opacity: 0 }}
                      animate={{ scale: 1, rotate: -3, opacity: 1 }}
                      exit={{ scale: 0.3, rotate: 15, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 22 }}
                      className="font-devanagari text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-[#ff007a] font-black inline-block group-hover:scale-110 transition-transform"
                      style={{
                        textShadow:
                          "0px 0px 0px #ffd200, 3px 3px 0px #ffffff, -3px -3px 0px #ffffff, 3px -3px 0px #ffffff, -3px 3px 0px #ffffff, 0px 8px 25px rgba(0,0,0,0.85)",
                        WebkitTextStroke: "2.5px #ffffff",
                      }}
                    >
                      गोवा
                    </motion.span>
                  ) : (
                    <motion.span
                      key="english-goa"
                      initial={{ scale: 0.3, rotate: 15, opacity: 0 }}
                      animate={{ scale: 1, rotate: -3, opacity: 1 }}
                      exit={{ scale: 0.3, rotate: -15, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 22 }}
                      className="font-hero-serif text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-[#ffd200] font-black inline-block tracking-wider group-hover:scale-110 transition-transform"
                      style={{
                        textShadow:
                          "0px 0px 0px #ff007a, 3px 3px 0px #ffffff, -3px -3px 0px #ffffff, 3px -3px 0px #ffffff, -3px 3px 0px #ffffff, 0px 8px 25px rgba(0,0,0,0.85)",
                        WebkitTextStroke: "2.5px #ff007a",
                      }}
                    >
                      GOA
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Event Info Bar */}
            <div className="w-full max-w-3xl mt-4 pt-3 border-t-2 border-[#ffd200]/40 flex flex-wrap items-center justify-between text-xs sm:text-sm font-mono-retro font-bold text-[#ffd200] tracking-widest gap-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#ff007a]" />
                <span>GOA, INDIA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#ff007a]" />
                <span>28 – 31 OCT 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff007a] animate-ping" />
                <span>2:47 PM STUDIO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Mode Switcher Tabs */}
      <div className="pt-8 max-w-lg mx-auto relative z-20">
        <div
          role="tablist"
          aria-label="Generator Mode Selector"
          className="flex items-center p-1.5 bg-[#023320] rounded-xl border-2 border-[#ffd200] shadow-2xl relative"
        >
          <button
            id="tab-pfp-frame"
            role="tab"
            aria-selected={activeTab === "frame"}
            aria-controls="panel-pfp-frame"
            onClick={() => setActiveTab("frame")}
            className={`relative flex-1 py-3 px-4 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 z-10 focus:outline-none focus:ring-2 focus:ring-[#ffd200] ${
              activeTab === "frame" ? "text-[#000000]" : "text-[#fffdf5]/90 hover:text-[#ffd200]"
            }`}
          >
            {activeTab === "frame" && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 bg-[#ffd200] rounded-lg shadow-md -z-10 border border-[#000000]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <UserCheck className="w-4 h-4 text-[#ff007a]" />
            <span>PFP PROFILE FRAME</span>
          </button>

          <button
            id="tab-builder-badge"
            role="tab"
            aria-selected={activeTab === "badge"}
            aria-controls="panel-builder-badge"
            onClick={() => setActiveTab("badge")}
            className={`relative flex-1 py-3 px-4 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 z-10 focus:outline-none focus:ring-2 focus:ring-[#ffd200] ${
              activeTab === "badge" ? "text-[#000000]" : "text-[#fffdf5]/90 hover:text-[#ffd200]"
            }`}
          >
            {activeTab === "badge" && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 bg-[#ffd200] rounded-lg shadow-md -z-10 border border-[#000000]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <CreditCard className="w-4 h-4 text-[#ff007a]" />
            <span>BUILDER ID CARD</span>
          </button>
        </div>
      </div>
    </header>
  );
};



