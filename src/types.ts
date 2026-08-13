export type AppTab = "frame" | "badge";

export type FrameStyleId =
  | "goa_beach_poster"
  | "sunset_horizon"
  | "tropical_oasis"
  | "azulejo_heritage"
  | "hibiscus_palms"
  | "coastal_sunset";

export interface FrameStyleConfig {
  id: FrameStyleId;
  name: string;
  tagline: string;
  badgeColor: string;
  borderColor: string;
  previewGradient: string;
}

export type BadgeThemeId = "hacker_house_green" | "sunset_palms" | "cyber_night" | "coastal_breeze";

export interface BadgeThemeConfig {
  id: BadgeThemeId;
  name: string;
  tagline: string;
  bgGradient: string;
  primaryColor: string;
  accentColor: string;
  borderColor: string;
}

export interface ImageAdjustments {
  zoom: number; // 0.5 to 3
  panX: number; // -300 to 300
  panY: number; // -300 to 300
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  brightness: number; // 50 to 150 (100 normal)
  contrast: number; // 50 to 150 (100 normal)
  saturation: number; // 0 to 200 (100 normal)
  filterPreset: "none" | "sunset" | "cyber" | "bw" | "warm" | "vivid";
}

export interface BuilderBadgeData {
  name: string;
  role: string;
  stack: string;
  builderTitle: string;
  serialNumber: string; // e.g. "042"
  builderClass?: string; // e.g. "TERMINAL WIZARD"
  beachBag?: string[]; // e.g. ["COCONUT", "VS CODE", "LO-FI BEATS"]
  currentlyShipping?: string; // e.g. "BUILDING THE FUTURE"
  builderId?: string; // e.g. "#HH-GOA-7757"
  githubHandle?: string;
  xHandle?: string;
  contactNo?: string; // e.g. "+91 98765 43210"
  projectName?: string; // e.g. "Solana Agent Kit"
  accessTier?: "VIP BUILDER" | "KEYNOTE SPEAKER" | "CORE CONTRIBUTOR" | "FELLOW" | "TRACK JUDGE" | "HACKER DELEGATE";
  foilStyle?: "hologram" | "gold" | "cyber" | "silver" | "none";
  hasSmartChip?: boolean;
  verifiedBadge?: boolean;
}

export interface ShareState {
  isSharing: boolean;
  shareUrl: string | null;
  ogImageUrl: string | null;
  copied: boolean;
}
