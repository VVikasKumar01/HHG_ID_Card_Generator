# 🌴 Hacker House Goa 2026 - Builder ID Card & Frame Generator 🌴

> A web application for creating custom Builder ID Passes and PFP Frames for **Hacker House Goa 2026**.

![Hacker House Goa Builder ID Card](public/reference_id_after.png)

---

## ✨ Features

- 🪪 **Official Builder ID Card**: Pixel-perfect canvas rendering based on official Hacker House Goa 2026 reference templates.
- 🔄 **3D Card Flip Preview**: Interactive 3D flip card toggle to view the front badge and backside (`id_back.webp`).
- 📸 **Photo Editing & Filters**: Upload custom photos with real-time circular portal clipping, pan, zoom, rotation, horizontal flip, and visual filters (Sunset, Cyberpunk, Black & White, Warm, Vivid).
- 📇 **Custom Builder Details**: Customize your Name, Role, Builder Class, Lo-Fi Beats / Currently Shipping status, and unique Builder ID.
- 📱 **Contacts Section**: Showcases your **𝕏 Handle** (with black 𝕏 branding), **GitHub Handle**, and **Phone Number** clearly on the badge.
- 🤖 **AI Builder Title Generator**: Integrates with Google Gemini API to suggest creative builder titles and roles.
- ⚡ **High-Res Download**: Export crisp, high-resolution PNG badges ready for print or digital sharing.
- 🚀 **Automated GitHub Actions CI/CD**: Automatic build and deployment to GitHub Pages on push to `main`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Canvas Rendering**: HTML5 2D Canvas Engine
- **Icons**: Lucide React
- **Backend / API**: Express, Node.js, `@google/genai` (Gemini API)
- **CI/CD**: GitHub Actions, GitHub Pages

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/VVikasKumar01/HHG_ID_Card_Generator.git
   cd HHG_ID_Card_Generator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional for AI Title Generation):
   Create a `.env` or `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build & Deployment

### Local Production Build

```bash
npm run build
```

### GitHub Actions Deployment to GitHub Pages

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/deploy.yml`.

To deploy:
1. Go to repository **Settings** → **Pages**.
2. Under **Source**, select **GitHub Actions**.
3. Push changes to the `main` branch:
   ```bash
   git add .
   git commit -m "Update project"
   git push origin main
   ```

---

## 📄 License

MIT License © 2026 Hacker House Goa Builder Community.
