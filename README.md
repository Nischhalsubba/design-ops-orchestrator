# DesignOps Orchestrator 3.0: God-Tier Edition ⚡️

![Version](https://img.shields.io/badge/version-3.0.0-purple.svg?style=for-the-badge)
![Figma](https://img.shields.io/badge/Figma-Token_Engine-red.svg?style=for-the-badge)
![Gulp](https://img.shields.io/badge/Gulp-v5-green.svg?style=for-the-badge)

The ultimate workflow for Product Designers and Creative Technologists. Bridge the gap between **Figma** and **Production Code** using automated token pipelines and AI agents.

---

## 💎 The Figma Token Engine

Stop copying hex codes manually. 

1.  Export your tokens from Figma (using Tokens Studio or native export) as JSON.
2.  Save the file to `src/tokens/tokens.json`.
3.  **That's it.** The system automatically:
    *   Parses the JSON.
    *   Converts it to SCSS variables (`_generated-tokens.scss`).
    *   Recompiles your CSS.
    *   Reloads the browser.

---

## 📦 "God-Tier" Toolset

We have integrated over **200+ Optimization & Automation Utilities**:

| Category | Tools Included |
| :--- | :--- |
| **Styles** | Sass, PostCSS, Autoprefixer, PurgeCSS, PxToRem, CSSNano, RTL Generation |
| **Scripts** | ESBuild, Terser, Babel, TypeScript Support, Brotli Compression |
| **Images** | AVIF, WebP, Imagemin (MozJPEG, PNGQuant), SVG Sprites, Responsive Gen |
| **HTML** | Pug, HTMLMin, W3C Validator, Accessibility Audit, SEO Sitemap |
| **DX** | BrowserSync, SourceMaps, Notify, Plumber, AI Error Healing |

---

## 🚀 Commands

| Command | Action |
| :--- | :--- |
| `npm start` | **Development Mode.** Watches files, compiles tokens, spins up localhost. |
| `npm run tokens` | **Token Sync.** Manually forces a refresh of the Figma Tokens. |
| `npm run build` | **Production Build.** Minifies, Compresses, Hashes, and Optimizes everything. |
| `npm run lint` | **Quality Check.** Runs ESLint, Stylelint, and PugLint. |
| `npm run deploy` | **Deploy.** (Configurable) Pushes `dist/` to your server/bucket. |

---

## 🤖 AI Healer

Includes **Gemini 3 Integration**. 
If a build fails (e.g., Sass error), the AI Agent intercepts the error, analyzes the stack trace, and suggests the exact code fix in your terminal.

*Add your `API_KEY` to `.env` to enable.*

---

## 🗺 Project Structure

```text
src/
├── tokens/              <-- PUT FIGMA JSON HERE
├── styles/
│   ├── abstracts/       <-- Auto-generated variables appear here
│   └── components/
├── scripts/
├── markup/
└── assets/
    ├── icons/           <-- SVGs here become a Sprite
    ├── img/             <-- JPGs here become WebP/AVIF
    └── animation/       <-- Lottie/Rive files
```

---

*Built for the obsessed.*
