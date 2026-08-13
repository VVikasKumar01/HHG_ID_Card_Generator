# Engineering Specification — Hacker House Goa 2026

## 1. Design Token Architecture (`src/index.css`)
- `--color-emerald`: `#025938`
- `--color-emerald-dark`: `#083421`
- `--color-emerald-light`: `#0d5235`
- `--color-gold`: `#ffd200`
- `--color-pink`: `#ff007a`
- `--color-sand`: `#fffdf2`
- `--color-charcoal`: `#111827`

## 2. Interactive Components
- `Header.tsx`: Pixel branding, blended Goa beach background, woven ribbon APPLY CTA, floating stickers, spring Devanagari badge toggle.
- `PhotoUploader.tsx`: File dropzone, HEIC/JPEG/PNG/WebP support, selfie camera input, sample avatar quick-picks.
- `FrameEditor.tsx`: Filter presets, position nudge D-pad, rotation, flip, zoom, pan sliders, brightness & contrast controls.
- `BadgeEditor.tsx`: Preset profiles, attendee name/role/class inputs, beach bag items, shipping project, AI title generator, ID pass randomizer.
- `CanvasPreview.tsx`: HTML5 canvas rendering at high-resolution 1000x1000 (PFP) and 1000x1400 (Pass), mouse/touch drag-to-pan, wheel zoom, zoom/reset overlay buttons, Download PNG, #FrameInGoa share button, Copy Image.
- `ShareModal.tsx`: Accessible dialog, live pass thumbnail, unique share URL generator, X tweet intent generator.

## 3. Performance & Quality Standards
- Fast, synchronous 2x canvas rendering.
- Accessible keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-[#ff007a]`).
- Proper ARIA labels, semantic roles (`tablist`, `tab`, `dialog`, `region`).
- Mobile-responsive layout stacking with sticky preview.
