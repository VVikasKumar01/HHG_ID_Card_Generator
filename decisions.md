# Visual Art Direction & Design Decisions — Hacker House Goa 2026

## 1. Cinematic Art Direction & Atmosphere
- **Concept**: *Tropical Emerald Cyber-Brutalism meets Goa Beach Sunset*.
- **Palette Identity**:
  - Primary Background: Deep Palm Emerald (`#025938`, `#083421`, `#0d5235`)
  - Accent Gold: Sunlight Yellow (`#ffd200`, `#ffe033`)
  - Highlight Pink: Goa Sunset Neon Pink (`#ff007a`, `#ff2b93`)
  - Warm Canvas Surface: Sand White (`#fffdf2`, `#f8f3e8`)
  - Text & Outlines: High-Contrast Charcoal (`#111827`, `#000000`)
- **Typography Pairing**:
  - Retro Pixel Display: `Silkscreen` (2:47PM STUDIO branding)
  - Editorial Headline Serif: `Playfair Display` & `Bodoni Moda` (HACKER HOUSE title)
  - Cultural Devanagari Script: `Yatra One` (Animated continuous "गोवा" overlay)
  - Terminal Monospace: `JetBrains Mono` (Event dates, Builder ID #, code badges)
  - Body Sans-Serif: `Plus Jakarta Sans` (Control panels and forms)

## 2. Pacing & User Journey ("Scenes")
- **Scene 1 (Opening / Hero)**: Pixel studio banner with aerial Goa beach blend, woven ribbon apply CTA, floating sticker badges, and spring-animated Devanagari/English Goa overlay.
- **Scene 2 (Mode Selection)**: Dual tactile toggle tabs (`PFP PROFILE FRAME` vs `BUILDER ID PASS`).
- **Scene 3 (Creator Studio)**:
  - Left Column: Photo uploader with selfie camera trigger, sample avatar presets, filter color grading, position nudge controls, and builder ID data inputs.
  - Right Column: Sticky 2x High-DPI canvas preview with zoom/pan controls and instant action buttons (`Download PNG`, `#FrameInGoa`, `Copy Image`).
- **Scene 4 (Confirmation & Share)**: Confetti burst, animated modal with live pass thumbnail preview and X (Twitter) broadcast integration.

## 3. Design System Tokens
- Centralized CSS variables in `src/index.css` for zero-redundancy tokens.
- Accessible WCAG AA contrast for text and controls.
- Keyboard navigation & focus-visible indicators across all interactive elements.
