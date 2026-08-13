var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "15mb" }));
var sharedCards = /* @__PURE__ */ new Map();
function pruneOldShares() {
  if (sharedCards.size > 100) {
    const keys = Array.from(sharedCards.keys());
    for (let i = 0; i < keys.length - 100; i++) {
      sharedCards.delete(keys[i]);
    }
  }
}
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", name: "HH Goa 2026 Frame Generator" });
});
app.post("/api/generate-title", async (req, res) => {
  try {
    const { name, stack, role } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallbackTitles = [
        "Goa Kernel Hacker",
        "Full-Stack DeGen",
        "LLM Whisperer",
        "Solana Alchemist",
        "Zero-Knowledge Ninja",
        "Rust Speedrunner",
        "Autonomous Agent Dev",
        "Chaos Engineer & Beach Bum",
        "Shader Architect",
        "Protocol Wizard"
      ];
      const randomTitle = fallbackTitles[Math.floor(Math.random() * fallbackTitles.length)];
      return res.json({ title: randomTitle });
    }
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const prompt = `Generate a short, witty 2-4 word "Builder Title" for a hackathon attendee badge at HH Goa 2026 (Hacker House Goa).
Attendee details:
Name: ${name || "Anonymous Builder"}
Role: ${role || "Full-Stack Developer"}
Tech Stack / Interests: ${stack || "TypeScript, AI, Web3"}

The title should sound punchy, heroic, or funny (like "LLM Whisperer", "Solana Alchemist", "Kernel Hacker & Sunset Chaser", "Autonomous Agent Dev", "Bytecode Beachcomber"). Return ONLY the title text, nothing else, no quotes.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    const titleText = response.text ? response.text.trim().replace(/^["']|["']$/g, "") : "HH Goa 2026 Elite Builder";
    return res.json({ title: titleText });
  } catch (error) {
    console.error("Gemini title generation error:", error);
    res.json({ title: "HH Goa 2026 Elite Builder" });
  }
});
app.post("/api/share", (req, res) => {
  try {
    const { imageData, title = "HH Goa 2026 Frame", type = "frame" } = req.body;
    if (!imageData || !imageData.startsWith("data:image/")) {
      return res.status(400).json({ error: "Invalid image data" });
    }
    const id = Math.random().toString(36).substring(2, 10);
    sharedCards.set(id, {
      id,
      imageData,
      title,
      type,
      createdAt: Date.now()
    });
    pruneOldShares();
    const host = req.get("host") || `localhost:${PORT}`;
    const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
    const appUrl = process.env.APP_URL || `${protocol}://${host}`;
    const shareUrl = `${appUrl}/share/${id}`;
    const ogImageUrl = `${appUrl}/api/og-image/${id}`;
    res.json({ id, shareUrl, ogImageUrl });
  } catch (err) {
    console.error("Share error:", err);
    res.status(500).json({ error: "Failed to generate share link" });
  }
});
app.get("/api/og-image/:id", (req, res) => {
  const card = sharedCards.get(req.params.id);
  if (!card) {
    return res.status(404).send("Image not found");
  }
  const matches = card.imageData.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return res.status(400).send("Invalid image encoding");
  }
  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], "base64");
  res.setHeader("Content-Type", mimeType);
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(buffer);
});
app.get("/share/:id", (req, res) => {
  const card = sharedCards.get(req.params.id);
  const host = req.get("host") || `localhost:${PORT}`;
  const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
  const appUrl = process.env.APP_URL || `${protocol}://${host}`;
  const ogImageUrl = card ? `${appUrl}/api/og-image/${req.params.id}` : `${appUrl}/icon.png`;
  const pageTitle = card ? `${card.title} \u2014 HH Goa 2026` : "HH Goa 2026 Frame Generator";
  const tweetText = encodeURIComponent("I'm heading to HH Goa 2026! \u{1F334}\u{1F525} 28\u201331 Oct 2026 in Goa. #FrameInGoa\nCheck out my builder frame:");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  
  <!-- Open Graph / Facebook / X -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="Hacker House Goa 2026 \xB7 28\u201331 Oct 2026 \xB7 2:47pm Studio. Less Noise. More Signal." />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:width" content="1000" />
  <meta property="og:image:height" content="1000" />
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="Hacker House Goa 2026 \xB7 28\u201331 Oct 2026 \xB7 2:47pm Studio #FrameInGoa" />
  <meta name="twitter:image" content="${ogImageUrl}" />
  
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      color: #f8fafc;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
    }
    .card-container {
      max-width: 480px;
      padding: 24px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(12px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      margin: 20px;
    }
    img {
      width: 100%;
      height: auto;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.6);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    h1 {
      font-size: 1.5rem;
      margin: 16px 0 8px;
      background: linear-gradient(135deg, #ff6b35, #ffb703);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    .btn-group {
      display: flex;
      gap: 12px;
      margin-top: 20px;
      flex-wrap: wrap;
    }
    .btn {
      flex: 1;
      padding: 12px 18px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-primary {
      background: linear-gradient(135deg, #ff6b35, #e63946);
      color: white;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
  </style>
</head>
<body>
  <div class="card-container">
    <a href="/" style="text-decoration:none; color:#ffb703; font-weight:700; font-size:0.8rem; letter-spacing:1px; text-transform:uppercase;">\u{1F334} HH GOA 2026</a>
    <h1>${card ? card.title : "HH Goa 2026 Frame"}</h1>
    <p>Hacker House Goa \xB7 28\u201331 Oct 2026 \xB7 2:47pm Studio<br>Less Noise. More Signal.</p>
    
    ${card ? `<img src="${card.imageData}" alt="HH Goa 2026 Frame">` : `<p>Frame not found or expired.</p>`}
    
    <div class="btn-group">
      <a class="btn btn-primary" href="https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(`${appUrl}/share/${req.params.id}`)}" target="_blank" rel="noopener">
        Share on X #FrameInGoa
      </a>
      <a class="btn btn-secondary" href="/">
        Make Your Own
      </a>
    </div>
  </div>
</body>
</html>`;
  res.send(html);
});
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
start();
//# sourceMappingURL=server.cjs.map
