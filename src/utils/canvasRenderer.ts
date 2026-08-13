import { FrameStyleId, BadgeThemeId, ImageAdjustments, BuilderBadgeData } from "../types";

const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): Promise<HTMLImageElement | null> {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src)!);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * Renders the PFP Frame (Format A) onto an HTML5 Canvas.
 * Canvas dimensions: 1000 x 1000 px.
 */
export async function renderFrameCanvas(
  canvas: HTMLCanvasElement,
  imageSrc: string | null,
  frameStyle: FrameStyleId,
  adjustments: ImageAdjustments,
  badgeData?: BuilderBadgeData
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = 1000;
  canvas.width = size;
  canvas.height = size;

  // Clear canvas
  ctx.clearRect(0, 0, size, size);

  // 1. DRAW FRAME BACKGROUND ARTWORK FIRST (Sunburst, sky, tiles, villas, dunes, waves)
  drawFrameBackground(ctx, size, frameStyle, badgeData);

  // 2. DRAW USER UPLOADER PHOTO ON TOP OF BACKGROUND ARTWORK
  const center = size / 2;
  const photoRadius = 320; // Photo portal radius

  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, photoRadius, 0, Math.PI * 2);
  ctx.clip();

  if (imageSrc) {
    const img = await loadImage(imageSrc);
    if (img) {
      ctx.save();
      const scaleToCover = Math.max((photoRadius * 2) / img.width, (photoRadius * 2) / img.height);
      const scaledWidth = img.width * scaleToCover * adjustments.zoom;
      const scaledHeight = img.height * scaleToCover * adjustments.zoom;

      const centerX = center + adjustments.panX;
      const centerY = center + adjustments.panY;

      ctx.translate(centerX, centerY);
      ctx.rotate((adjustments.rotation * Math.PI) / 180);
      if (adjustments.flipH) {
        ctx.scale(-1, 1);
      }

      // Filter processing
      let filterString = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;
      if (adjustments.filterPreset === "sunset") {
        filterString += " sepia(25%) hue-rotate(-10deg)";
      } else if (adjustments.filterPreset === "cyber") {
        filterString += " hue-rotate(180deg) saturate(140%)";
      } else if (adjustments.filterPreset === "bw") {
        filterString += " grayscale(100%) contrast(120%)";
      } else if (adjustments.filterPreset === "warm") {
        filterString += " sepia(15%) saturate(110%)";
      } else if (adjustments.filterPreset === "vivid") {
        filterString += " saturate(160%) contrast(110%)";
      }
      ctx.filter = filterString;

      ctx.drawImage(img, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
      ctx.filter = "none";
      ctx.restore();
    }
  } else {
    // Placeholder avatar inside circle
    drawPlaceholderAvatarInside(ctx, center - photoRadius, center - photoRadius, photoRadius * 2, "#ffd200");
  }
  ctx.restore();

  // 3. DRAW FRAME FOREGROUND OVERLAYS ON TOP OF PHOTO BOUNDARY (Frame ring, text, badges, corner flowers)
  drawFrameForeground(ctx, size, frameStyle, badgeData);
}

/**
 * Renders the Builder ID Card Horizontal Layout onto an HTML5 Canvas using reference.png as the template.
 * Canvas dimensions: 1536 x 1024 px.
 */
export async function renderBadgeCanvas(
  canvas: HTMLCanvasElement,
  imageSrc: string | null,
  badgeData: BuilderBadgeData,
  themeId: BadgeThemeId,
  adjustments: ImageAdjustments,
  isFlipped: boolean = false
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = 1577;
  const h = 997;
  canvas.width = w;
  canvas.height = h;

  ctx.clearRect(0, 0, w, h);

  // If card is flipped to backside, render id_back.webp
  if (isFlipped) {
    const backImg = (await loadImage("/id_back.webp")) || (await loadImage("id_back.webp"));
    if (backImg) {
      ctx.drawImage(backImg, 0, 0, w, h);
    } else {
      ctx.fillStyle = "#025938";
      ctx.fillRect(0, 0, w, h);
    }
    return;
  }

  // 1. Load and draw reference.png background template (Clean unfilled card template)
  const templateImg = (await loadImage("/reference.png")) || (await loadImage("reference.png"));
  if (templateImg) {
    ctx.drawImage(templateImg, 0, 0, w, h);
  } else {
    // Fallback background fill if template image fails to load
    ctx.fillStyle = "#093322";
    ctx.fillRect(0, 0, w, h);
  }

  // 2. USER PHOTO CIRCLE PORTAL (Center: 320, 390, Radius: 210)
  // If user uploaded a photo, render it clipped into the photo frame!
  // If user has not uploaded a photo (imageSrc is null), keep the clean default avatar silhouette from reference.png!
  if (imageSrc) {
    const photoCenterX = 310;
    const photoCenterY = 412;
    const photoRadius = 199;

    ctx.save();
    ctx.beginPath();
    ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
    ctx.clip();

    const img = await loadImage(imageSrc);
    if (img) {
      ctx.save();
      const scaleToCover = Math.max((photoRadius * 2) / img.width, (photoRadius * 2) / img.height);
      const scaledWidth = img.width * scaleToCover * adjustments.zoom;
      const scaledHeight = img.height * scaleToCover * adjustments.zoom;

      const cx = photoCenterX + adjustments.panX;
      const cy = photoCenterY + adjustments.panY;

      ctx.translate(cx, cy);
      ctx.rotate((adjustments.rotation * Math.PI) / 180);
      if (adjustments.flipH) {
        ctx.scale(-1, 1);
      }

      let filterString = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;
      if (adjustments.filterPreset === "sunset") filterString += " sepia(25%) hue-rotate(-10deg)";
      else if (adjustments.filterPreset === "cyber") filterString += " hue-rotate(180deg) saturate(140%)";
      else if (adjustments.filterPreset === "bw") filterString += " grayscale(100%) contrast(120%)";
      else if (adjustments.filterPreset === "warm") filterString += " sepia(15%) saturate(110%)";
      else if (adjustments.filterPreset === "vivid") filterString += " saturate(160%) contrast(110%)";
      ctx.filter = filterString;

      ctx.drawImage(img, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
      ctx.filter = "none";
      ctx.restore();
    }
    ctx.restore();
  }

  // 3. DYNAMIC TEXT OVERLAYS AFTER COLON (White text matching reference_id_after.png)
  const textColor = "#ffffff";
  const fields = [
    { y: 398, value: (badgeData.name || "").toUpperCase() },
    { y: 475, value: (badgeData.role || "").toUpperCase() },
    { y: 551, value: (badgeData.builderClass || "").toUpperCase() },
    { y: 628, value: (badgeData.currentlyShipping || badgeData.beachBag?.[2] || "").toUpperCase() },
  ];

  ctx.textAlign = "left";

  fields.forEach(({ y, value }) => {
    if (value) {
      // Auto-scale font size if text is long
      let fontSize = 24;
      ctx.font = `900 ${fontSize}px 'JetBrains Mono', 'Courier New', monospace`;
      while (ctx.measureText(value).width > 340 && fontSize > 11) {
        fontSize -= 1;
        ctx.font = `900 ${fontSize}px 'JetBrains Mono', 'Courier New', monospace`;
      }

      ctx.fillStyle = textColor;
      ctx.fillText(value, 862, y);
    }
  });

  // 4. BOTTOM ROW (BUILDER ID box + Contacts beside it)
  const builderIdText = badgeData.builderId || (badgeData.serialNumber ? `#HH-GOA-${badgeData.serialNumber}` : "#HH-GOA-8883");

  if (builderIdText) {
    const boxX = 95;
    const boxY = 790;
    const boxW = 290;
    const boxH = 120;

    ctx.save();

    // ── Builder ID Card Box ──
    ctx.fillStyle = "#f6f0e2";
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 14);
    ctx.fill();
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Header Banner
    ctx.fillStyle = "#083421";
    ctx.beginPath();
    ctx.roundRect(boxX + 14, boxY + 12, boxW - 28, 30, 8);
    ctx.fill();
    ctx.strokeStyle = "#ffd200";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffd200";
    ctx.font = "900 12px 'JetBrains Mono', monospace";
    ctx.fillText("★  BUILDER ID  ★", boxX + boxW / 2, boxY + 32);

    // ID Text — large, vertically centered below header
    const idAreaTop = boxY + 50;
    const idAreaBottom = boxY + boxH;
    const idAreaCenterY = idAreaTop + (idAreaBottom - idAreaTop) / 2;

    let bIdFontSize = 28;
    ctx.font = `900 ${bIdFontSize}px 'JetBrains Mono', 'Courier New', monospace`;
    while (ctx.measureText(builderIdText).width > boxW - 30 && bIdFontSize > 14) {
      bIdFontSize -= 1;
      ctx.font = `900 ${bIdFontSize}px 'JetBrains Mono', 'Courier New', monospace`;
    }
    ctx.fillStyle = "#111827";
    ctx.textBaseline = "middle";
    ctx.fillText(builderIdText, boxX + boxW / 2, idAreaCenterY);
    ctx.textBaseline = "alphabetic";

    ctx.restore();
  }

  // ── Contacts Section (beside Builder ID box) ──
  const contactsX = 415;
  const contactsTopY = 775;
  const lineHeight = 32;

  ctx.save();
  ctx.textAlign = "left";

  // "CONTACTS" Heading
  ctx.fillStyle = "#ffd200";
  ctx.font = "900 18px 'JetBrains Mono', monospace";
  ctx.fillText("CONTACTS", contactsX, contactsTopY + 16);

  // Gold divider line under heading
  ctx.strokeStyle = "#ffd200";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(contactsX, contactsTopY + 24);
  ctx.lineTo(contactsX + 180, contactsTopY + 24);
  ctx.stroke();

  // Row 1: X Handle (black 𝕏 logo with crisp white handle text)
  const xText = badgeData.xHandle ? (badgeData.xHandle.startsWith("@") ? badgeData.xHandle : `@${badgeData.xHandle}`) : "";
  if (xText) {
    const rowY = contactsTopY + 24 + lineHeight;
    ctx.fillStyle = "#000000";
    ctx.font = "900 18px 'JetBrains Mono', monospace";
    const label = `𝕏  ${xText}`;
    let fs = 18;
    while (ctx.measureText(label).width > 310 && fs > 11) {
      fs -= 1;
      ctx.font = `900 ${fs}px 'JetBrains Mono', monospace`;
    }
    ctx.fillText(label, contactsX, rowY);
  }

  // Row 2: GitHub Handle
  const ghText = badgeData.githubHandle || "";
  if (ghText) {
    const rowY = contactsTopY + 24 + lineHeight * 2;
    ctx.fillStyle = "#000000";
    ctx.font = "900 18px 'JetBrains Mono', monospace";
    const label = `⌨  ${ghText}`;
    let fs = 18;
    while (ctx.measureText(label).width > 310 && fs > 11) {
      fs -= 1;
      ctx.font = `900 ${fs}px 'JetBrains Mono', monospace`;
    }
    ctx.fillText(label, contactsX, rowY);
  }

  // Row 3: Phone Number
  const contactText = badgeData.contactNo || "";
  if (contactText) {
    const rowY = contactsTopY + 24 + lineHeight * 3;
    ctx.fillStyle = "#000000";
    ctx.font = "900 18px 'JetBrains Mono', monospace";
    const label = `📞  ${contactText}`;
    let fs = 18;
    while (ctx.measureText(label).width > 310 && fs > 11) {
      fs -= 1;
      ctx.font = `900 ${fs}px 'JetBrains Mono', monospace`;
    }
    ctx.fillText(label, contactsX, rowY);
  }

  ctx.restore();
}

// Smart Emoji Mapping for Beach Bag items
function getSmartItemEmoji(item: string): string {
  const upper = item.toUpperCase();
  if (upper.includes("COCONUT")) return "🥥";
  if (upper.includes("CODE") || upper.includes("LAPTOP") || upper.includes("VS") || upper.includes("MAC")) return "💻";
  if (upper.includes("BEATS") || upper.includes("HEADPHONE") || upper.includes("MUSIC") || upper.includes("LO-FI")) return "🎧";
  if (upper.includes("SUNGLASS") || upper.includes("SHADES") || upper.includes("GLASSES")) return "🕶️";
  if (upper.includes("PASSPORT") || upper.includes("ID") || upper.includes("VISA")) return "🛂";
  if (upper.includes("SOLANA") || upper.includes("CRYPTO") || upper.includes("WEB3")) return "⚡";
  if (upper.includes("BEER") || upper.includes("DRINK") || upper.includes("CHAI") || upper.includes("COFFEE")) return "🍺";
  if (upper.includes("SURF") || upper.includes("BOARD")) return "🏄";
  if (upper.includes("AI") || upper.includes("ROBOT") || upper.includes("AGENT")) return "🤖";
  if (upper.includes("SANDAL") || upper.includes("FLIP")) return "🩴";
  if (upper.includes("CAMERA") || upper.includes("PHOTO")) return "📷";
  return "🌴";
}

/**
 * Draws Frame Background Artwork BEFORE the user's photo is rendered.
 */
function drawFrameBackground(
  ctx: CanvasRenderingContext2D,
  size: number,
  frameStyle: FrameStyleId,
  badgeData?: BuilderBadgeData
) {
  if (frameStyle === "sunset_horizon") {
    drawSunsetHorizonBackground(ctx, size, badgeData);
  } else if (frameStyle === "tropical_oasis") {
    drawTropicalOasisBackground(ctx, size, badgeData);
  } else if (frameStyle === "azulejo_heritage") {
    drawAzulejoHeritageBackground(ctx, size, badgeData);
  } else if (frameStyle === "hibiscus_palms") {
    drawHibiscusPalmsBackground(ctx, size, badgeData);
  } else if (frameStyle === "coastal_sunset") {
    drawCoastalSunsetBackground(ctx, size, badgeData);
  } else {
    drawGoaBeachPosterBackground(ctx, size, badgeData);
  }
}

/**
 * Draws Frame Foreground Overlays ON TOP of the user's photo.
 */
function drawFrameForeground(
  ctx: CanvasRenderingContext2D,
  size: number,
  frameStyle: FrameStyleId,
  badgeData?: BuilderBadgeData
) {
  if (frameStyle === "sunset_horizon") {
    drawSunsetHorizonForeground(ctx, size, badgeData);
  } else if (frameStyle === "tropical_oasis") {
    drawTropicalOasisForeground(ctx, size, badgeData);
  } else if (frameStyle === "azulejo_heritage") {
    drawAzulejoHeritageForeground(ctx, size, badgeData);
  } else if (frameStyle === "hibiscus_palms") {
    drawHibiscusPalmsForeground(ctx, size, badgeData);
  } else if (frameStyle === "coastal_sunset") {
    drawCoastalSunsetForeground(ctx, size, badgeData);
  } else {
    drawGoaBeachPosterForeground(ctx, size, badgeData);
  }
}

// ----------------------------------------------------
// TEMPLATE #1: GOA BEACH POSTER
// ----------------------------------------------------
function drawGoaBeachPosterBackground(ctx: CanvasRenderingContext2D, size: number, badgeData?: BuilderBadgeData) {
  const center = size / 2;
  const palette = {
    bg: "#f6f0e2",
    borderDark: "#083421",
    accent: "#ffd200",
    pink: "#ff007a",
    sand: "#f0d890",
    ocean: "#028090",
  };

  ctx.save();

  // Canvas Fill
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, size, size);

  // Outer Poster Canvas Frame Border
  ctx.strokeStyle = palette.borderDark;
  ctx.lineWidth = 18;
  ctx.strokeRect(9, 9, size - 18, size - 18);

  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(22, 22, size - 44, size - 44);

  // Top Sunburst Rays behind Photo Top
  ctx.save();
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.arc(center, 180, 140, 0, Math.PI * 2);
  ctx.fill();

  for (let deg = 0; deg < 360; deg += 20) {
    const rad = (deg * Math.PI) / 180;
    ctx.strokeStyle = palette.accent + "55";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(center, 180);
    ctx.lineTo(center + Math.cos(rad) * 450, 180 + Math.sin(rad) * 450);
    ctx.stroke();
  }
  ctx.restore();

  // Bottom Beach Sand & Ocean Wave Base
  ctx.fillStyle = palette.sand;
  ctx.beginPath();
  ctx.moveTo(0, 800);
  ctx.quadraticCurveTo(250, 750, 500, 810);
  ctx.quadraticCurveTo(750, 870, 1000, 800);
  ctx.lineTo(1000, 1000);
  ctx.lineTo(0, 1000);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = palette.ocean;
  ctx.beginPath();
  ctx.moveTo(0, 860);
  ctx.quadraticCurveTo(300, 820, 600, 880);
  ctx.quadraticCurveTo(800, 920, 1000, 870);
  ctx.lineTo(1000, 1000);
  ctx.lineTo(0, 1000);
  ctx.closePath();
  ctx.fill();

  // Left Palm Tree Vector
  drawPalmTreeVector(ctx, 110, 920, 1.45);
  // Right Palm Tree Vector
  drawPalmTreeVector(ctx, 890, 920, 1.45);

  ctx.restore();
}

function drawGoaBeachPosterForeground(ctx: CanvasRenderingContext2D, size: number, badgeData?: BuilderBadgeData) {
  const center = size / 2;
  const frameRingRadius = 380;
  const frameRingWidth = 60;

  const palette = {
    borderDark: "#083421",
    accent: "#ffd200",
    pink: "#ff007a",
  };

  ctx.save();

  // Main Circular Photo Frame Ring
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius, 0, Math.PI * 2);
  ctx.arc(center, center, frameRingRadius - frameRingWidth, 0, Math.PI * 2, true);
  ctx.fill();

  ctx.strokeStyle = palette.borderDark;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius - frameRingWidth, 0, Math.PI * 2);
  ctx.stroke();

  // Beaded Dots Ring
  const beads = 32;
  ctx.fillStyle = palette.pink;
  for (let i = 0; i < beads; i++) {
    const ang = (i * Math.PI * 2) / beads;
    const bx = center + (frameRingRadius - frameRingWidth / 2) * Math.cos(ang);
    const by = center + (frameRingRadius - frameRingWidth / 2) * Math.sin(ang);
    ctx.beginPath();
    ctx.arc(bx, by, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = palette.borderDark;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Curved Top Text
  ctx.fillStyle = palette.borderDark;
  ctx.font = "900 38px 'Arial Black', sans-serif";
  drawCurvedText(ctx, "HACKER HOUSE GOA", center, center, frameRingRadius - 28, -Math.PI / 2, 0.08, true);

  // Curved Bottom Text
  ctx.font = "900 24px 'JetBrains Mono', monospace";
  drawCurvedText(ctx, "✦ BUILD IN GOA ✦ SHIP FROM PARADISE ✦", center, center, frameRingRadius - 28, Math.PI / 2, 0.055, false);

  // 4 Corner Hibiscus Clusters
  drawDetailedHibiscus(ctx, 80, 80, 24, palette.pink, palette.accent);
  drawDetailedHibiscus(ctx, size - 80, 80, 24, palette.pink, palette.accent);
  drawDetailedHibiscus(ctx, 80, size - 80, 24, palette.pink, palette.accent);
  drawDetailedHibiscus(ctx, size - 80, size - 80, 24, palette.pink, palette.accent);

  // Header User Handle Overlay
  const userX = badgeData?.xHandle ? `@${badgeData.xHandle.replace("@", "")}` : "@BUILDERINGOA";
  ctx.textAlign = "left";
  ctx.fillStyle = palette.accent;
  ctx.font = "900 22px 'JetBrains Mono', monospace";
  ctx.fillText("GOA BEACH POSTER", 110, 62);
  ctx.fillStyle = "#fffdf5";
  ctx.font = "bold 16px 'JetBrains Mono', monospace";
  ctx.fillText(userX.toUpperCase(), 110, 90);

  ctx.textAlign = "right";
  ctx.fillStyle = "#fffdf5";
  ctx.font = "bold 18px 'JetBrains Mono', monospace";
  ctx.fillText("HHGOA.COM", size - 110, 60);
  ctx.fillStyle = palette.pink;
  ctx.font = "900 32px sans-serif";
  ctx.fillText("गोवा", size - 110, 98);

  // Bottom Center Pill Badge
  const badgeY = center + 260;
  ctx.fillStyle = palette.borderDark;
  ctx.beginPath();
  ctx.roundRect(center - 190, badgeY, 380, 68, 34);
  ctx.fill();
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = palette.accent;
  ctx.font = "900 26px 'Playfair Display', Georgia, serif";
  ctx.fillText("PARADISE SHIPPED", center - 25, badgeY + 44);
  ctx.fillStyle = palette.pink;
  ctx.font = "900 28px sans-serif";
  ctx.fillText("गोवा", center + 130, badgeY + 43);

  ctx.restore();
}

// ----------------------------------------------------
// TEMPLATE #2: SUNSET HORIZON
// ----------------------------------------------------
function drawSunsetHorizonBackground(ctx: CanvasRenderingContext2D, size: number, badgeData?: BuilderBadgeData) {
  const center = size / 2;
  const palette = {
    darkBg: "#4a1204",
    orange: "#ff9800",
    gold: "#ffd54f",
    magenta: "#e91e63",
    sand: "#ffcc80",
    teal: "#00a896",
  };

  ctx.save();

  // Dark Canvas Fill
  ctx.fillStyle = palette.darkBg;
  ctx.fillRect(0, 0, size, size);

  // Giant Sunset Sun in Center Background
  ctx.fillStyle = palette.orange;
  ctx.beginPath();
  ctx.arc(center, 400, 310, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.gold;
  ctx.beginPath();
  ctx.arc(center, 400, 240, 0, Math.PI * 2);
  ctx.fill();

  // Sunset Clouds Bands
  ctx.fillStyle = "rgba(74, 18, 4, 0.35)";
  ctx.fillRect(80, 220, 840, 18);
  ctx.fillRect(120, 280, 760, 14);
  ctx.fillRect(160, 330, 680, 12);

  // Outer Mahogany Border
  ctx.strokeStyle = palette.darkBg;
  ctx.lineWidth = 22;
  ctx.strokeRect(11, 11, size - 22, size - 22);

  // Arching Symmetrical Palm Trees Canopy
  ctx.strokeStyle = palette.darkBg;
  ctx.lineWidth = 16;
  ctx.lineCap = "round";

  // Left Trunk
  ctx.beginPath();
  ctx.moveTo(120, 950);
  ctx.quadraticCurveTo(180, 480, 380, 140);
  ctx.stroke();

  // Right Trunk
  ctx.beginPath();
  ctx.moveTo(880, 950);
  ctx.quadraticCurveTo(820, 480, 620, 140);
  ctx.stroke();

  // Overhanging Palm Canopy Leaves Top Center
  ctx.fillStyle = "#2d5a27";
  ctx.strokeStyle = palette.darkBg;
  ctx.lineWidth = 2;

  for (let side = -1; side <= 1; side += 2) {
    const cx = center + side * 140;
    for (let f = 0; f < 5; f++) {
      ctx.save();
      ctx.translate(cx, 130);
      ctx.rotate((side * f * 0.35) - 0.2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(side * 80, -40, side * 140, 0);
      ctx.quadraticCurveTo(side * 80, 30, 0, 0);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  // Sunset Dunes at Bottom
  ctx.fillStyle = palette.sand;
  ctx.beginPath();
  ctx.moveTo(0, 780);
  ctx.quadraticCurveTo(500, 720, 1000, 780);
  ctx.lineTo(1000, 1000);
  ctx.lineTo(0, 1000);
  ctx.closePath();
  ctx.fill();

  // Surfboards Leaning on Left Dune
  // Surfboard 1 (Magenta)
  ctx.save();
  ctx.translate(220, 830);
  ctx.rotate(-0.2);
  ctx.fillStyle = palette.magenta;
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 85, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = palette.darkBg;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = palette.gold;
  ctx.fillRect(-22, -10, 44, 18);
  ctx.restore();

  // Surfboard 2 (Teal)
  ctx.save();
  ctx.translate(260, 840);
  ctx.rotate(-0.08);
  ctx.fillStyle = palette.teal;
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 75, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = palette.darkBg;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawSunsetHorizonForeground(ctx: CanvasRenderingContext2D, size: number, badgeData?: BuilderBadgeData) {
  const center = size / 2;
  const frameRingRadius = 380;
  const frameRingWidth = 60;

  const palette = {
    darkBg: "#4a1204",
    orange: "#ff9800",
    gold: "#ffd54f",
  };

  ctx.save();

  // Photo Ring Frame
  ctx.fillStyle = palette.darkBg;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius, 0, Math.PI * 2);
  ctx.arc(center, center, frameRingRadius - frameRingWidth, 0, Math.PI * 2, true);
  ctx.fill();

  ctx.strokeStyle = palette.orange;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = palette.gold;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius - frameRingWidth, 0, Math.PI * 2);
  ctx.stroke();

  // Header Title Curved Text
  ctx.fillStyle = palette.gold;
  ctx.font = "900 38px 'Arial Black', sans-serif";
  drawCurvedText(ctx, "SUNSET HORIZON", center, center, frameRingRadius - 28, -Math.PI / 2, 0.08, true);

  ctx.font = "900 24px 'JetBrains Mono', monospace";
  drawCurvedText(ctx, "✦ GOLDEN HOUR ✦ SHIPPED FROM GOA ✦", center, center, frameRingRadius - 28, Math.PI / 2, 0.055, false);

  // Bottom Golden Hour Pill Banner
  const badgeY = center + 265;
  ctx.fillStyle = palette.orange;
  ctx.beginPath();
  ctx.roundRect(center - 210, badgeY, 420, 68, 34);
  ctx.fill();
  ctx.strokeStyle = palette.darkBg;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = palette.darkBg;
  ctx.font = "900 26px 'Playfair Display', Georgia, serif";
  ctx.fillText("GOLDEN HOUR BUILDER", center, badgeY + 44);

  ctx.restore();
}

// ----------------------------------------------------
// TEMPLATE #3: TROPICAL OASIS
// ----------------------------------------------------
function drawTropicalOasisBackground(ctx: CanvasRenderingContext2D, size: number, badgeData?: BuilderBadgeData) {
  const center = size / 2;
  const palette = {
    bg: "#025938",
    villaBg: "#fffdf5",
    roofRed: "#d32f2f",
    greenWindow: "#0d5235",
    borderDark: "#083421",
    accentYellow: "#ffd200",
    pink: "#ff007a",
    sea: "#028090",
  };

  ctx.save();

  // Background Canvas Fill
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, size, size);

  // Outer Dark Emerald Frame
  ctx.strokeStyle = palette.borderDark;
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, size - 20, size - 20);

  // Left Goan Portuguese Villa Structure
  ctx.fillStyle = palette.villaBg;
  ctx.fillRect(20, 320, 180, 480);
  ctx.strokeStyle = palette.borderDark;
  ctx.lineWidth = 3.5;
  ctx.strokeRect(20, 320, 180, 480);

  // Red Tile Roof
  ctx.fillStyle = palette.roofRed;
  ctx.beginPath();
  ctx.moveTo(5, 320);
  ctx.lineTo(110, 210);
  ctx.lineTo(215, 320);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Arched Green Windows on Left Villa
  ctx.fillStyle = palette.greenWindow;
  for (let wY = 380; wY <= 680; wY += 100) {
    ctx.beginPath();
    ctx.roundRect(50, wY, 40, 60, [20, 20, 0, 0]);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(110, wY, 40, 60, [20, 20, 0, 0]);
    ctx.fill();
    ctx.stroke();
  }

  // Right Goan Yellow Villa Structure
  ctx.fillStyle = "#ffe082";
  ctx.fillRect(800, 320, 180, 480);
  ctx.strokeRect(800, 320, 180, 480);

  // Red Tile Roof
  ctx.fillStyle = palette.roofRed;
  ctx.beginPath();
  ctx.moveTo(785, 320);
  ctx.lineTo(890, 210);
  ctx.lineTo(995, 320);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Windows & Balcony on Right Villa
  ctx.fillStyle = palette.greenWindow;
  ctx.beginPath();
  ctx.roundRect(850, 380, 80, 100, [30, 30, 0, 0]);
  ctx.fill();
  ctx.stroke();

  // Bay & Beach Foreground
  ctx.fillStyle = palette.accentYellow;
  ctx.fillRect(0, 780, size, 220);

  ctx.fillStyle = palette.sea;
  ctx.beginPath();
  ctx.ellipse(center, 870, 320, 85, 0, 0, Math.PI * 2);
  ctx.fill();

  // Floating Sailboat on Bay
  drawSailboatVector(ctx, 480, 870, { borderDark: palette.borderDark, cardBg: "#ffffff" });

  // Vespa Scooter Parked on Right Sand
  drawScooterVector(ctx, 720, 910, { pink: palette.pink, borderDark: palette.borderDark, accent: palette.accentYellow });

  ctx.restore();
}

function drawTropicalOasisForeground(ctx: CanvasRenderingContext2D, size: number, badgeData?: BuilderBadgeData) {
  const center = size / 2;
  const frameRingRadius = 380;
  const frameRingWidth = 60;

  const palette = {
    villaBg: "#fffdf5",
    borderDark: "#083421",
    accentYellow: "#ffd200",
    pink: "#ff007a",
  };

  ctx.save();

  // Photo Frame Ring
  ctx.fillStyle = palette.borderDark;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius, 0, Math.PI * 2);
  ctx.arc(center, center, frameRingRadius - frameRingWidth, 0, Math.PI * 2, true);
  ctx.fill();

  ctx.strokeStyle = palette.accentYellow;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius - 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = palette.villaBg;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius - frameRingWidth, 0, Math.PI * 2);
  ctx.stroke();

  // Header Title Text
  ctx.fillStyle = palette.accentYellow;
  ctx.font = "900 38px 'Arial Black', sans-serif";
  drawCurvedText(ctx, "TROPICAL OASIS GOA", center, center, frameRingRadius - 28, -Math.PI / 2, 0.08, true);

  ctx.fillStyle = palette.villaBg;
  ctx.font = "900 24px 'JetBrains Mono', monospace";
  drawCurvedText(ctx, "✦ CODE IN PARADISE ✦ SHIP ALWAYS ✦", center, center, frameRingRadius - 28, Math.PI / 2, 0.055, false);

  // Bottom Banner
  const badgeY = center + 260;
  ctx.fillStyle = palette.pink;
  ctx.beginPath();
  ctx.roundRect(center - 190, badgeY, 380, 68, 34);
  ctx.fill();
  ctx.strokeStyle = palette.borderDark;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 26px 'Playfair Display', Georgia, serif";
  ctx.fillText("TROPICAL BUILDER", center, badgeY + 44);

  ctx.restore();
}

// ----------------------------------------------------
// TEMPLATE #4: AZULEJO HERITAGE
// ----------------------------------------------------
function drawAzulejoHeritageBackground(ctx: CanvasRenderingContext2D, size: number, badgeData?: BuilderBadgeData) {
  const center = size / 2;
  const frameRingRadius = 380;

  const palette = {
    tileBlue: "#003e7e",
    deepBlue: "#001b3a",
    white: "#ffffff",
    gold: "#ffd200",
    pink: "#ff007a",
  };

  ctx.save();

  // Portuguese Azulejo Outer Tile Border Pattern
  ctx.fillStyle = palette.tileBlue;
  ctx.fillRect(0, 0, size, size);

  // Azulejo Diamond Lattice Grid
  ctx.strokeStyle = palette.white + "55";
  ctx.lineWidth = 2.5;

  const tileSize = 60;
  for (let x = 0; x <= size; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + tileSize, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - tileSize, size);
    ctx.stroke();
  }

  // 24-Point Radial Sunflower / Dahlia Petal Burst
  ctx.save();
  ctx.translate(center, center);
  const petals = 24;
  for (let p = 0; p < petals; p++) {
    const angle = (p * Math.PI * 2) / petals;
    ctx.save();
    ctx.rotate(angle);

    ctx.fillStyle = p % 2 === 0 ? palette.gold : palette.pink;
    ctx.beginPath();
    ctx.moveTo(0, -frameRingRadius - 50);
    ctx.quadraticCurveTo(28, -frameRingRadius + 10, 0, -frameRingRadius + 60);
    ctx.quadraticCurveTo(-28, -frameRingRadius + 10, 0, -frameRingRadius - 50);
    ctx.fill();
    ctx.strokeStyle = palette.deepBlue;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }
  ctx.restore();

  ctx.restore();
}

function drawAzulejoHeritageForeground(ctx: CanvasRenderingContext2D, size: number, badgeData?: BuilderBadgeData) {
  const center = size / 2;
  const frameRingRadius = 380;
  const frameRingWidth = 60;

  const palette = {
    deepBlue: "#001b3a",
    white: "#ffffff",
    gold: "#ffd200",
    pink: "#ff007a",
  };

  ctx.save();

  // Photo Frame Ceramic Ring
  ctx.fillStyle = palette.deepBlue;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius, 0, Math.PI * 2);
  ctx.arc(center, center, frameRingRadius - frameRingWidth, 0, Math.PI * 2, true);
  ctx.fill();

  ctx.strokeStyle = palette.gold;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = palette.white;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius - frameRingWidth, 0, Math.PI * 2);
  ctx.stroke();

  // Curved Header Text
  ctx.fillStyle = palette.gold;
  ctx.font = "900 38px 'Arial Black', sans-serif";
  drawCurvedText(ctx, "AZULEJO HERITAGE", center, center, frameRingRadius - 28, -Math.PI / 2, 0.08, true);

  ctx.fillStyle = palette.white;
  ctx.font = "900 24px 'JetBrains Mono', monospace";
  drawCurvedText(ctx, "✦ PORTUGUESE GOAN TILE ✦ HH GOA '26 ✦", center, center, frameRingRadius - 28, Math.PI / 2, 0.055, false);

  // 3D Layered Pink Waving Ribbon Banner at Bottom
  const ribbonY = center + 250;
  ctx.fillStyle = palette.pink;
  ctx.beginPath();
  ctx.moveTo(center - 240, ribbonY + 15);
  ctx.quadraticCurveTo(center, ribbonY - 10, center + 240, ribbonY + 15);
  ctx.lineTo(center + 220, ribbonY + 75);
  ctx.quadraticCurveTo(center, ribbonY + 50, center - 220, ribbonY + 75);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = palette.white;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = palette.white;
  ctx.font = "900 28px 'Playfair Display', Georgia, serif";
  ctx.fillText("HACKER HOUSE GOA '26", center, ribbonY + 45);

  ctx.restore();
}

// ----------------------------------------------------
// TEMPLATE #5: HIBISCUS PALMS
// ----------------------------------------------------
function drawHibiscusPalmsBackground(ctx: CanvasRenderingContext2D, size: number, badgeData?: BuilderBadgeData) {
  const center = size / 2;
  const frameRingRadius = 380;

  const palette = {
    darkGreen: "#0d4229",
    straw: "#f0d890",
    orange: "#ff9800",
    darkBorder: "#082416",
  };

  ctx.save();

  // Dark Green Tropical Canvas Fill
  ctx.fillStyle = palette.darkGreen;
  ctx.fillRect(0, 0, size, size);

  // Bamboo Stalk Outer Frame
  ctx.strokeStyle = palette.straw;
  ctx.lineWidth = 18;
  ctx.strokeRect(10, 10, size - 20, size - 20);

  ctx.strokeStyle = palette.darkBorder;
  ctx.lineWidth = 3;
  ctx.strokeRect(19, 19, size - 38, size - 38);

  // Bamboo Nodes
  ctx.fillStyle = palette.darkBorder;
  for (let node = 100; node < size; node += 150) {
    ctx.fillRect(0, node, 20, 6);
    ctx.fillRect(size - 20, node, 20, 6);
    ctx.fillRect(node, 0, 6, 20);
    ctx.fillRect(node, size - 20, 6, 20);
  }

  // Background Sunset Glow Disk
  ctx.fillStyle = palette.orange + "dd";
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius + 20, 0, Math.PI * 2);
  ctx.fill();

  // Leaning Palm on Left Background
  drawPalmTreeVector(ctx, 100, 920, 1.2);

  ctx.restore();
}

function drawHibiscusPalmsForeground(ctx: CanvasRenderingContext2D, size: number, badgeData?: BuilderBadgeData) {
  const center = size / 2;
  const frameRingRadius = 380;

  const palette = {
    straw: "#f0d890",
    pink: "#ff007a",
    orange: "#ff9800",
    yellow: "#ffd200",
  };

  ctx.save();

  // 360° Full Hibiscus Garland Ring (16 Flowers around Photo Ring)
  const flowers = 16;
  for (let f = 0; f < flowers; f++) {
    const ang = (f * Math.PI * 2) / flowers;
    const fx = center + (frameRingRadius - 10) * Math.cos(ang);
    const fy = center + (frameRingRadius - 10) * Math.sin(ang);

    const color = f % 3 === 0 ? palette.pink : f % 3 === 1 ? palette.orange : palette.yellow;
    drawDetailedHibiscus(ctx, fx, fy, 28, color, palette.yellow);
  }

  // Photo Ring Inner Stroke
  ctx.strokeStyle = palette.straw;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius - 60, 0, Math.PI * 2);
  ctx.stroke();

  // Curved Header Text
  ctx.fillStyle = palette.straw;
  ctx.font = "900 38px 'Arial Black', sans-serif";
  drawCurvedText(ctx, "GOA, INDIA ✦ TROPICAL", center, center, frameRingRadius - 28, -Math.PI / 2, 0.08, true);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 24px 'JetBrains Mono', monospace";
  drawCurvedText(ctx, "✦ TROPICAL PARADISE ✦ BUILD IN GOA ✦", center, center, frameRingRadius - 28, Math.PI / 2, 0.055, false);

  // Bottom Badge Banner
  const badgeY = center + 260;
  ctx.fillStyle = palette.pink;
  ctx.beginPath();
  ctx.roundRect(center - 190, badgeY, 380, 68, 34);
  ctx.fill();
  ctx.strokeStyle = palette.straw;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = palette.straw;
  ctx.font = "900 26px 'Playfair Display', Georgia, serif";
  ctx.fillText("TROPICAL PARADISE", center, badgeY + 44);

  ctx.restore();
}

// ----------------------------------------------------
// TEMPLATE #6: COASTAL SUNSET
// ----------------------------------------------------
function drawCoastalSunsetBackground(ctx: CanvasRenderingContext2D, size: number, badgeData?: BuilderBadgeData) {
  const center = size / 2;
  const palette = {
    turquoise: "#00a896",
    navy: "#003049",
    cream: "#f6f0e2",
  };

  ctx.save();

  // Cream Canvas Fill
  ctx.fillStyle = palette.cream;
  ctx.fillRect(0, 0, size, size);

  // Ocean Wave Layers across Bottom
  ctx.fillStyle = palette.turquoise;
  ctx.beginPath();
  ctx.moveTo(0, 750);
  ctx.quadraticCurveTo(250, 700, 500, 760);
  ctx.quadraticCurveTo(750, 820, 1000, 750);
  ctx.lineTo(1000, 1000);
  ctx.lineTo(0, 1000);
  ctx.fill();

  ctx.fillStyle = palette.navy;
  ctx.beginPath();
  ctx.moveTo(0, 840);
  ctx.quadraticCurveTo(300, 800, 600, 860);
  ctx.quadraticCurveTo(800, 910, 1000, 840);
  ctx.lineTo(1000, 1000);
  ctx.lineTo(0, 1000);
  ctx.fill();

  // Overhead Tropical Jungle Palm Canopy
  ctx.fillStyle = "#028090";
  ctx.strokeStyle = palette.navy;
  ctx.lineWidth = 2;

  for (let i = 0; i < 7; i++) {
    const x = i * 160 + 20;
    ctx.save();
    ctx.translate(x, 0);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(60, 120, 120, 180);
    ctx.quadraticCurveTo(20, 140, 0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Outer Border
  ctx.strokeStyle = palette.navy;
  ctx.lineWidth = 18;
  ctx.strokeRect(9, 9, size - 18, size - 18);

  ctx.restore();
}

function drawCoastalSunsetForeground(ctx: CanvasRenderingContext2D, size: number, badgeData?: BuilderBadgeData) {
  const center = size / 2;
  const frameRingRadius = 380;
  const frameRingWidth = 60;

  const palette = {
    navy: "#003049",
    coral: "#e63946",
    sandGold: "#f0d890",
    cream: "#f6f0e2",
  };

  ctx.save();

  // Photo Portal Ring (Coral Red & Gold)
  ctx.fillStyle = palette.coral;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius, 0, Math.PI * 2);
  ctx.arc(center, center, frameRingRadius - frameRingWidth, 0, Math.PI * 2, true);
  ctx.fill();

  ctx.strokeStyle = palette.sandGold;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = palette.navy;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(center, center, frameRingRadius - frameRingWidth, 0, Math.PI * 2);
  ctx.stroke();

  // Curved Header Text
  ctx.fillStyle = palette.sandGold;
  ctx.font = "900 38px 'Arial Black', sans-serif";
  drawCurvedText(ctx, "COASTAL SUNSET", center, center, frameRingRadius - 28, -Math.PI / 2, 0.08, true);

  ctx.fillStyle = palette.cream;
  ctx.font = "900 24px 'JetBrains Mono', monospace";
  drawCurvedText(ctx, "✦ BREEZY OCEAN VIBES ✦ BUILD IN GOA ✦", center, center, frameRingRadius - 28, Math.PI / 2, 0.055, false);

  // Corner Hibiscus Clusters
  drawDetailedHibiscus(ctx, 80, 80, 24, palette.coral, palette.sandGold);
  drawDetailedHibiscus(ctx, size - 80, 80, 24, palette.coral, palette.sandGold);
  drawDetailedHibiscus(ctx, 80, size - 80, 24, palette.coral, palette.sandGold);
  drawDetailedHibiscus(ctx, size - 80, size - 80, 24, palette.coral, palette.sandGold);

  // Bottom Banner
  const badgeY = center + 260;
  ctx.fillStyle = palette.navy;
  ctx.beginPath();
  ctx.roundRect(center - 190, badgeY, 380, 68, 34);
  ctx.fill();
  ctx.strokeStyle = palette.sandGold;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = palette.sandGold;
  ctx.font = "900 26px 'Playfair Display', Georgia, serif";
  ctx.fillText("COASTAL SHIPPED", center, badgeY + 44);

  ctx.restore();
}

// Helper function to draw a 5-petal tropical Hibiscus flower
function drawDetailedHibiscus(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  petalColor: string,
  centerColor: string
) {
  ctx.save();

  // 5 Rounded Heart-Shaped Petals
  ctx.fillStyle = petalColor;
  ctx.strokeStyle = "#082416";
  ctx.lineWidth = 2;

  for (let p = 0; p < 5; p++) {
    const ang = (p * Math.PI * 2) / 5 - Math.PI / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ang);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(radius * 0.8, -radius * 1.2, radius * 1.3, 0);
    ctx.quadraticCurveTo(radius * 0.8, radius * 1.2, 0, 0);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // Center Pistil / Stamen
  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Yellow Dots on Stamen
  ctx.fillStyle = "#ffffff";
  for (let d = 0; d < 5; d++) {
    const dang = (d * Math.PI * 2) / 5;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(dang) * (radius * 0.25), cy + Math.sin(dang) * (radius * 0.25), 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}


// Helper curved text drawing function
function drawCurvedText(
  ctx: CanvasRenderingContext2D,
  str: string,
  centerX: number,
  centerY: number,
  radius: number,
  angleRad: number,
  letterSpacing: number = 0.08,
  clockwise: boolean = true
) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const n = str.length;
  const startAngle = angleRad - ((n - 1) * letterSpacing) / 2;

  for (let i = 0; i < n; i++) {
    const char = str[i];
    const currAngle = startAngle + i * letterSpacing;
    ctx.save();
    ctx.translate(centerX + radius * Math.cos(currAngle), centerY + radius * Math.sin(currAngle));
    ctx.rotate(currAngle + (clockwise ? Math.PI / 2 : -Math.PI / 2));
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

// Helper drawing utilities

function drawPlaceholderAvatarInside(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.fillStyle = "#0d5235";
  ctx.fillRect(x, y, size, size);

  ctx.fillStyle = color + "40";
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2 - 30, size * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2 + size * 0.45, size * 0.42, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fffdf5";
  ctx.font = "bold 16px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("UPLOAD PHOTO", x + size / 2, y + size / 2 + 10);
}

function drawDecorativePhotoRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  palette: any
) {
  ctx.save();
  // Outer yellow ring background
  const ringWidth = 26;
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + ringWidth, 0, Math.PI * 2);
  ctx.fill();

  // Patterned triangles/beads on ring
  const numBeads = 36;
  ctx.fillStyle = palette.pink;
  for (let i = 0; i < numBeads; i++) {
    const angle = (i * Math.PI * 2) / numBeads;
    const bx = cx + (radius + ringWidth / 2) * Math.cos(angle);
    const by = cy + (radius + ringWidth / 2) * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(bx, by, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner & Outer borders
  ctx.strokeStyle = palette.borderDark;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + ringWidth, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawScooterVector(ctx: CanvasRenderingContext2D, x: number, y: number, palette?: any) {
  ctx.save();
  ctx.translate(x, y);

  const bodyColor = palette?.pink || "#ff007a";
  const borderColor = palette?.borderDark || "#083421";
  const accentColor = palette?.accent || "#ffd200";

  // Headlight Beam Cone Glow
  ctx.fillStyle = "rgba(255, 250, 200, 0.35)";
  ctx.beginPath();
  ctx.moveTo(48, -28);
  ctx.lineTo(160, -60);
  ctx.lineTo(180, 20);
  ctx.closePath();
  ctx.fill();

  // Scooter Wheels
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(-50, 30, 20, 0, Math.PI * 2);
  ctx.arc(50, 30, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(-50, 30, 10, 0, Math.PI * 2);
  ctx.arc(50, 30, 10, 0, Math.PI * 2);
  ctx.fill();

  // Scooter Body
  ctx.fillStyle = bodyColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;

  // Rear body curved shell
  ctx.beginPath();
  ctx.ellipse(-30, 10, 45, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Floorboard
  ctx.fillRect(-20, 20, 50, 10);
  ctx.strokeRect(-20, 20, 50, 10);

  // Front shield
  ctx.beginPath();
  ctx.moveTo(30, 20);
  ctx.lineTo(45, -20);
  ctx.lineTo(25, -20);
  ctx.lineTo(15, 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Front mudguard
  ctx.beginPath();
  ctx.arc(50, 20, 16, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Headlight & Handlebars
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.arc(42, -28, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Seat
  ctx.fillStyle = "#4a2e12";
  ctx.beginPath();
  ctx.roundRect(-55, -12, 45, 12, 6);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawPalmTreeVector(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Curved Trunk
  ctx.strokeStyle = "#8b5a2b";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-20, -70, -10, -140);
  ctx.stroke();

  // Trunk Segment Rings
  ctx.strokeStyle = "#5c3a19";
  ctx.lineWidth = 3;
  for (let i = 1; i <= 5; i++) {
    const ty = -i * 25;
    ctx.beginPath();
    ctx.arc(-10 - i * 2, ty, 8, 0, Math.PI);
    ctx.stroke();
  }

  // Coconuts
  ctx.fillStyle = "#ffd200";
  ctx.beginPath();
  ctx.arc(-14, -135, 8, 0, Math.PI * 2);
  ctx.arc(-4, -135, 8, 0, Math.PI * 2);
  ctx.fill();

  // Lush Palm Fronds
  ctx.fillStyle = "#025938";
  ctx.strokeStyle = "#083421";
  ctx.lineWidth = 2;

  const fronds = [
    { angle: -0.8, len: 75 },
    { angle: -0.3, len: 85 },
    { angle: 0.3, len: 85 },
    { angle: 0.8, len: 75 },
    { angle: 1.4, len: 65 },
    { angle: -1.4, len: 65 },
  ];

  fronds.forEach((f) => {
    ctx.save();
    ctx.translate(-10, -140);
    ctx.rotate(f.angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(f.len / 2, -25, f.len, 0);
    ctx.quadraticCurveTo(f.len / 2, 15, 0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });

  ctx.restore();
}

function drawPalmFrondsVector(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = "#025938";
  ctx.strokeStyle = "#083421";
  ctx.lineWidth = 2;

  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.rotate(-0.4 + i * 0.3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(50, -30, 100, -10);
    ctx.quadraticCurveTo(50, 10, 0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

function drawSignpostSticker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  palette: any
) {
  ctx.save();
  ctx.translate(x, y);

  // Wooden Pole
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(45, -70, 14, 180);
  ctx.strokeStyle = palette.borderDark;
  ctx.lineWidth = 2;
  ctx.strokeRect(45, -70, 14, 180);

  // Signboards
  const drawSign = (text: string, sy: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(0, sy, 104, 32, 6);
    ctx.fill();
    ctx.strokeStyle = palette.borderDark;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = color === palette.accent ? palette.borderDark : "#fffdf5";
    ctx.font = "900 13px sans-serif";
    ctx.fillText(text, 52, sy + 21);
  };

  drawSign("BUILD", -60, palette.accent);
  drawSign("SHIP", -20, palette.pink);
  drawSign("REPEAT", 20, "#025938");

  // "LET'S BUILD!" badge leaning against post
  ctx.save();
  ctx.translate(-25, 40);
  ctx.rotate(-0.15);
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.roundRect(0, 0, 96, 32, 6);
  ctx.fill();
  ctx.strokeStyle = palette.borderDark;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = palette.borderDark;
  ctx.font = "900 12px sans-serif";
  ctx.fillText("LET'S BUILD!", 48, 20);
  ctx.restore();

  ctx.restore();
}

function drawSailboatVector(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  palette: any
) {
  ctx.save();
  ctx.translate(x, y);

  // Waves line
  ctx.strokeStyle = palette.borderDark;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-35, 10);
  ctx.quadraticCurveTo(-15, 18, 0, 10);
  ctx.quadraticCurveTo(15, 2, 35, 10);
  ctx.stroke();

  // Boat Hull
  ctx.fillStyle = palette.borderDark;
  ctx.beginPath();
  ctx.moveTo(-25, 0);
  ctx.lineTo(25, 0);
  ctx.lineTo(15, 12);
  ctx.lineTo(-18, 12);
  ctx.closePath();
  ctx.fill();

  // Sail
  ctx.fillStyle = palette.cardBg;
  ctx.beginPath();
  ctx.moveTo(2, -2);
  ctx.lineTo(2, -42);
  ctx.lineTo(22, -8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = palette.borderDark;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

function drawQRCodeVector(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = "#fffdf5";
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, size, size);

  ctx.fillStyle = color;
  const grid = 7;
  const cell = size / grid;

  const drawFinder = (fx: number, fy: number) => {
    ctx.fillRect(x + fx * cell, y + fy * cell, cell * 2.2, cell * 2.2);
    ctx.fillStyle = "#fffdf5";
    ctx.fillRect(x + (fx + 0.4) * cell, y + (fy + 0.4) * cell, cell * 1.4, cell * 1.4);
    ctx.fillStyle = color;
    ctx.fillRect(x + (fx + 0.7) * cell, y + (fy + 0.7) * cell, cell * 0.8, cell * 0.8);
  };

  drawFinder(0.3, 0.3);
  drawFinder(4.5, 0.3);
  drawFinder(0.3, 4.5);

  const pattern = [
    [1, 0, 1, 1, 0],
    [0, 1, 0, 1, 1],
    [1, 1, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1]
  ];

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (pattern[r][c]) {
        ctx.fillRect(x + (c + 1) * cell, y + (r + 1) * cell, cell * 0.8, cell * 0.8);
      }
    }
  }

  ctx.fillStyle = "#ff007a";
  ctx.font = `${size * 0.22}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🌴", x + size / 2, y + size / 2);

  ctx.restore();
}

function drawBarcodeVector(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  const bars = [2, 4, 1, 3, 2, 5, 2, 1, 4, 2, 1, 3, 5, 2, 1, 4, 2, 3, 1, 2, 4, 2];
  let currX = x;
  const totalWeight = bars.reduce((a, b) => a + b, 0);
  const barUnit = w / (totalWeight * 1.2);

  bars.forEach((weight, i) => {
    if (i % 2 === 0) {
      ctx.fillRect(currX, y, weight * barUnit, h);
    }
    currX += weight * barUnit * 1.2;
  });

  ctx.restore();
}

function drawSmartICChip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number = 72, h: number = 56) {
  ctx.save();
  ctx.translate(x, y);

  // Outer chip base - Brushed gold / metallic copper
  const goldGrad = ctx.createLinearGradient(0, 0, w, h);
  goldGrad.addColorStop(0, "#ffe066");
  goldGrad.addColorStop(0.3, "#f0b800");
  goldGrad.addColorStop(0.7, "#ffd700");
  goldGrad.addColorStop(1, "#c89000");

  ctx.fillStyle = goldGrad;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 10);
  ctx.fill();
  ctx.strokeStyle = "#4a3500";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Circuit contact pin pads (8 pin grid pattern)
  ctx.strokeStyle = "#8a6000";
  ctx.lineWidth = 1.5;

  // Center division line
  ctx.beginPath();
  ctx.moveTo(w / 2, 4);
  ctx.lineTo(w / 2, h - 4);
  ctx.stroke();

  // Horizontal divisions
  ctx.beginPath();
  ctx.moveTo(4, h * 0.33);
  ctx.lineTo(w - 4, h * 0.33);
  ctx.moveTo(4, h * 0.66);
  ctx.lineTo(w - 4, h * 0.66);
  ctx.stroke();

  // Microchip core contact box in center
  ctx.fillStyle = "#e0a000";
  ctx.beginPath();
  ctx.roundRect(w * 0.3, h * 0.28, w * 0.4, h * 0.44, 5);
  ctx.fill();
  ctx.stroke();

  // Corner bevel dot
  ctx.fillStyle = "#fff8d0";
  ctx.beginPath();
  ctx.arc(8, 8, 3, 0, Math.PI * 2);
  ctx.fill();

  // Micro text label below chip
  ctx.fillStyle = "#083421";
  ctx.font = "900 8px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("RFID • SECURE", w / 2, h + 11);

  ctx.restore();
}

function drawAccessTierBadge(ctx: CanvasRenderingContext2D, x: number, y: number, tier: string, palette: any) {
  ctx.save();
  ctx.translate(x, y);

  const tierName = (tier || "VIP BUILDER").toUpperCase();
  const text = `✦ ${tierName} ✦`;

  ctx.font = "900 13px 'JetBrains Mono', monospace";
  const tw = ctx.measureText(text).width;
  const pw = Math.max(160, tw + 32);
  const ph = 32;

  // Gold / Metallic Gradient Pill
  const pillGrad = ctx.createLinearGradient(-pw / 2, 0, pw / 2, ph);
  if (tierName.includes("VIP") || tierName.includes("KEYNOTE")) {
    pillGrad.addColorStop(0, "#ffd700");
    pillGrad.addColorStop(0.5, "#fff2a3");
    pillGrad.addColorStop(1, "#ffab00");
  } else if (tierName.includes("CORE") || tierName.includes("FELLOW")) {
    pillGrad.addColorStop(0, "#ff007a");
    pillGrad.addColorStop(1, "#99004d");
  } else {
    pillGrad.addColorStop(0, palette.borderDark);
    pillGrad.addColorStop(1, palette.subText);
  }

  ctx.fillStyle = pillGrad;
  ctx.beginPath();
  ctx.roundRect(-pw / 2, 0, pw, ph, 16);
  ctx.fill();
  ctx.strokeStyle = palette.borderDark;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Text inside Tier Badge
  ctx.textAlign = "center";
  ctx.fillStyle = (tierName.includes("VIP") || tierName.includes("KEYNOTE")) ? "#083421" : "#ffffff";
  ctx.fillText(text, 0, 21);

  ctx.restore();
}

function drawVerifiedBadgeIcon(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number = 14) {
  ctx.save();
  ctx.translate(x, y);

  // Scalloped 12-point starburst verified badge background
  ctx.fillStyle = "#1d9bf0"; // Verified X/Twitter Blue
  ctx.beginPath();
  const points = 12;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.82;
    const a = (i * Math.PI) / points;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // Outer Gold Ring
  ctx.strokeStyle = "#ffd200";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Checkmark inside
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-radius * 0.35, 0);
  ctx.lineTo(-radius * 0.05, radius * 0.32);
  ctx.lineTo(radius * 0.4, -radius * 0.32);
  ctx.stroke();

  ctx.restore();
}

function drawHolographicFoilOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, style: string) {
  if (style === "none") return;

  ctx.save();

  if (style === "hologram") {
    // Shimmering 45-degree diagonal multi-color hologram gradient band
    const holoGrad = ctx.createLinearGradient(0, 0, width, height);
    holoGrad.addColorStop(0, "rgba(255, 0, 122, 0)");
    holoGrad.addColorStop(0.25, "rgba(0, 240, 255, 0.18)");
    holoGrad.addColorStop(0.45, "rgba(255, 210, 0, 0.28)");
    holoGrad.addColorStop(0.55, "rgba(255, 0, 122, 0.25)");
    holoGrad.addColorStop(0.75, "rgba(0, 255, 128, 0.18)");
    holoGrad.addColorStop(1, "rgba(0, 240, 255, 0)");

    ctx.fillStyle = holoGrad;
    ctx.fillRect(0, 0, width, height);

    // Diagonal security watermark print
    ctx.save();
    ctx.rotate(-0.18);
    ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
    ctx.font = "900 15px 'JetBrains Mono', monospace";
    for (let y = -200; y < height + 400; y += 75) {
      ctx.fillText("✦ HH GOA 2026 OFFICIAL DELEGATE • VERIFIED SECURITY PASSPORT ✦", -100, y);
    }
    ctx.restore();
  } else if (style === "gold") {
    // 24K Gold Metallic Foil sheen
    const goldGrad = ctx.createLinearGradient(0, 0, width, height * 0.8);
    goldGrad.addColorStop(0, "rgba(255, 215, 0, 0)");
    goldGrad.addColorStop(0.4, "rgba(255, 235, 120, 0.22)");
    goldGrad.addColorStop(0.6, "rgba(255, 180, 0, 0.28)");
    goldGrad.addColorStop(1, "rgba(255, 215, 0, 0)");

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);
  } else if (style === "cyber") {
    // Cyber Neon Green/Cyan sheen
    const cyberGrad = ctx.createLinearGradient(width * 0.2, 0, width * 0.8, height);
    cyberGrad.addColorStop(0, "rgba(0, 240, 255, 0)");
    cyberGrad.addColorStop(0.5, "rgba(0, 240, 255, 0.22)");
    cyberGrad.addColorStop(0.7, "rgba(255, 0, 122, 0.18)");
    cyberGrad.addColorStop(1, "rgba(0, 255, 128, 0)");

    ctx.fillStyle = cyberGrad;
    ctx.fillRect(0, 0, width, height);
  } else if (style === "silver") {
    // Chrome Silver sheen
    const silverGrad = ctx.createLinearGradient(0, 0, width, height);
    silverGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    silverGrad.addColorStop(0.45, "rgba(255, 255, 255, 0.28)");
    silverGrad.addColorStop(0.55, "rgba(180, 200, 220, 0.18)");
    silverGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = silverGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // Corner Security Watermark Sparkles
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  const sparkles = [
    { x: 180, y: 140 },
    { x: width - 220, y: 160 },
    { x: width - 180, y: height - 180 },
    { x: 220, y: height - 200 },
  ];
  sparkles.forEach((s) => {
    ctx.font = "18px sans-serif";
    ctx.fillText("✨", s.x, s.y);
  });

  ctx.restore();
}
