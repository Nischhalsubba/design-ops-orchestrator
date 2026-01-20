# DesignOps Orchestrator v4.1: The "God-Tier" Workflow for 2026 ⚡️

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Gulp](https://img.shields.io/badge/gulp-v5.0.0-red.svg)](https://gulpjs.com/)
[![Status](https://img.shields.io/badge/status-stable-green.svg)]()
[![Architect](https://img.shields.io/badge/architect-Nischhal_Raj_Subba-cyan.svg)]()
[![Stars](https://img.shields.io/github/stars/Nischhalsubba/design-ops-orchestrator?style=social)](https://github.com/Nischhalsubba/design-ops-orchestrator)

> **"The tool doesn't matter. The intent matters."** — *Nischhal Raj Subba*

The **DesignOps Orchestrator** is a comprehensive, enterprise-grade build system architected by **Nischhal Raj Subba**. It is designed to bridge the gap between design tools (Figma, Notion, Rive) and production code, eliminating manual handoff and ensuring 100% design fidelity.

---

## 📚 Table of Contents

1.  [The Manifesto](#-the-manifesto)
2.  [Who is Nischhal Raj Subba?](#-who-is-nischhal-raj-subba)
3.  [Why Gulp 5.0 in 2026?](#-why-gulp-50-in-2026)
4.  [Core Features](#-core-features)
5.  [System Architecture & Folder Structure](#-system-architecture--folder-structure)
6.  [Installation & Setup](#-installation--setup)
7.  [The Engines: Deep Dive](#-the-engines-deep-dive)
    *   [The Design Token Engine](#-the-design-token-engine)
    *   [The Content Engine](#-the-content-engine)
    *   [The Motion Engine](#-the-motion-engine)
    *   [The Visual Engine](#-the-visual-engine)
    *   [The Audit Engine](#-the-audit-engine)
8.  [Tool Integration Matrix (60+ Tools)](#-tool-integration-matrix)
9.  [AI Healing System (Gemini API)](#-ai-healing-system)
10. [Troubleshooting Guide](#-troubleshooting-guide)

---

## 📜 The Manifesto

I spent years watching designers and developers fight a losing war against **Entropy**.

In every organization I worked with, there was a widening chasm between the *Design Reality* (what exists in Figma, Rive, Notion) and the *Code Reality* (what ships to production).
*   A designer updates a color in Figma; Developers miss the memo.
*   A content writer fixes a typo in Notion; it takes three days to deploy.
*   An animator updates a Rive file; the implementation breaks because the developer didn't update the binary.

This "Drift" kills products. It kills morale. It kills excellence.

I built the **DesignOps Orchestrator** to be the immutable source of truth. It is not just a build tool; it is a **universal translator**. It speaks "Figma" and outputs "SCSS". It speaks "Notion" and outputs "JSON". It speaks "After Effects" and outputs "Optimized Assets".

This is my vision for 2026: A world where the tool doesn't matter, only the intent. Export your intent, and let the Orchestrator handle the code.

---

## 👤 Who is Nischhal Raj Subba?

I am **Nischhal Raj Subba**, a Creative Technologist, Product Designer, and Systems Architect. I operate at the intersection of aesthetics and engineering.

*   **Mission:** To eliminate the "boring" parts of development (copy-pasting hex codes, resizing images, fixing lint errors) so humans can focus on creativity.
*   **Philosophy:** "If you do it twice, automate it."
*   **Specialty:** Design Systems, Frontend Infrastructure, WebGL/Animation pipelines.

I developed this workflow because I refused to accept manual handoff as a standard. I believe that if a human has to copy-paste a hex code from one window to another, the system has failed. This project is the culmination of 5 years of refining the perfect feedback loop between Design and Dev.

---

## 🛠 Why Gulp 5.0 in 2026?

You might ask: *"Why not Webpack? Why not Vite? Why not Next.js?"*

Vite and Webpack are **Bundlers**. They are excellent at taking JavaScript and bundling it for the browser.
Gulp is a **Task Runner**. It is excellent at *orchestration*.

DesignOps involves tasks that Bundlers are bad at:
1.  **Image Transformation:** Resizing 500 images into 3 different formats (AVIF, WebP, JPG).
2.  **File System Operations:** Moving fonts, creating folder structures, zipping releases.
3.  **Data Parsing:** Reading Markdown/JSON and transforming it into other formats.

**The Hybrid Approach:**
This workflow uses **Gulp** for orchestration and **ESBuild** (via `gulp-esbuild`) for JavaScript bundling. You get the speed of modern bundlers with the flexibility of a task runner.

---

## 🌟 Core Features

*   **Figma Sync:** Drop a `tokens.json` file, get SCSS variables instantly.
*   **AI Healer:** Build failed? The integrated Gemini AI analyzes the stack trace and tells you how to fix it in the terminal.
*   **Notion CMS:** Write docs in Notion, export Markdown, get a static site.
*   **Motion First:** First-class support for Lottie (minified) and Rive (binary).
*   **Zero-Config Images:** AVIF/WebP generation, responsive sizing, and SVG sprites.
*   **Enterprise Linting:** Stylelint (SCSS), ESLint (TS), and PugLint ensure code quality.
*   **Accessibility Audits:** Automated Pa11y/Axe scans on every build.
*   **Versioning:** Automated semantic versioning, git tagging, and changelog generation.

---

## 📂 System Architecture & Folder Structure

Understanding the structure is key to mastering the workflow.

```bash
root/
├── .env                  # Secrets (API Keys)
├── gulpfile.js           # The Main Brain (Imports tasks)
├── package.json          # 300+ Dependencies
├── gulp/                 # MODULAR TASKS
│   ├── config.js         # Paths and Global Settings
│   ├── tasks/
│   │   ├── admin.js      # Versioning, TODOs, Zip
│   │   ├── assets.js     # Images, Fonts, Sprites
│   │   ├── audit.js      # Lighthouse, Axe
│   │   ├── content.js    # Markdown -> JSON
│   │   ├── lint.js       # ESLint, Stylelint
│   │   ├── markup.js     # Pug Templates
│   │   ├── media.js      # Responsive Images
│   │   ├── motion.js     # Rive, Lottie
│   │   ├── scripts.js    # ESBuild, Terser
│   │   ├── server.js     # BrowserSync
│   │   ├── styles.js     # Sass, PostCSS
│   │   └── tokens.js     # JSON -> SCSS
│   └── utils/
│       └── ai-healer.js  # Error handling AI
└── src/                  # YOUR INPUT ZONE
    ├── assets/
    │   ├── animation/    # Drop Lottie/Rive files here
    │   ├── icons/        # Drop SVGs here (auto-sprited)
    │   ├── img/          # Drop PNG/JPG here (auto-optimized)
    │   └── video/        # Drop MP4 here
    ├── data/             # Static site data (site.json)
    ├── ingest/
    │   └── content/      # Drop .md files here
    ├── markup/           # Pug files (components, pages)
    ├── scripts/          # TypeScript/JS files
    ├── styles/           # SCSS files
    └── tokens/           # Drop tokens.json here
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Nischhalsubba/design-ops-orchestrator.git
cd design-ops-orchestrator
```

### 2. Install Dependencies
This will install all 300+ packages defined in `package.json`.
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory:
```bash
touch .env
```
Add your keys (if available):
```env
API_KEY=your_google_gemini_api_key_here
ANALYTICS_ID=G-XXXXXXXXXX
```

### 4. Start the Engine
```bash
npm start
```
This will:
*   Compile all assets.
*   Start a local server at `http://localhost:3000`.
*   Watch for changes in `src/`.

---

## 🏎 The Engines: Deep Dive

### 🎨 The Design Token Engine
**Goal:** Eliminate manual CSS updates.

*   **Input:** `src/tokens/tokens.json`
*   **Output:** `src/styles/abstracts/_generated-tokens.scss`
*   **Watcher:** Changes to JSON trigger immediate SCSS recompilation.

**How to use:**
1.  Install the **Tokens Studio** plugin in Figma.
2.  Export your Design System (Colors, Typography, Spacing) as `tokens.json`.
3.  Save this file to `src/tokens/`.
4.  The system parses the deep object structure and flattens it into Sass variables.
    *   JSON: `{ "global": { "colors": { "primary": "#000" } } }`
    *   Sass: `$global-colors-primary: #000;`

### 📝 The Content Engine
**Goal:** Use Notion/Obsidian as a CMS without a database.

*   **Input:** `src/ingest/content/*.md`
*   **Output:** `src/data/generated_content.json`

**How to use:**
1.  Write your blog post or documentation in Notion.
2.  Export as Markdown.
3.  Place the `.md` file in `src/ingest/content/`.
4.  Ensure it has Frontmatter (YAML) at the top:
    ```yaml
    ---
    title: My Awesome Post
    date: 2026-01-01
    tags: [design, ops]
    ---
    ```
5.  The engine compiles all `.md` files into a single JSON object available to your Pug templates.

### 🎬 The Motion Engine
**Goal:** First-class support for runtime animation formats.

*   **Input:** `src/assets/animation/*.json` (Lottie) or `*.riv` (Rive)
*   **Output:** `dist/assets/animation/*` AND `_motion-manifest.json`

**How to use:**
1.  Export animation from After Effects (Bodymovin) or Rive.
2.  Drop files into `src/assets/animation/`.
3.  The engine minifies the JSON (removes whitespace/comments) to save kilobytes.
4.  It generates a **Manifest File** listing all available animations, so your Frontend code doesn't need hardcoded paths—it can just request the manifest to see what's available to play.

### 🖼 The Visual Engine
**Goal:** Next-gen image formats automatically.

*   **Input:** `src/assets/img/*.{png,jpg}`
*   **Output:** `dist/assets/img/*.{webp,avif,jpg}` + Responsive sizes

**How to use:**
Simply drop a high-res image into the folder. The engine creates:
1.  An **AVIF** version (Smallest, highest quality).
2.  A **WebP** version (Great compatibility).
3.  Original format optimized (Fallback).
4.  Responsive versions (e.g., `image-320w.jpg`, `image-768w.jpg`) for `srcset` usage.

### ✅ The Audit Engine
**Goal:** Catch accessibility and performance issues before deployment.

*   **Command:** `npm run audit`
*   **Output:** `dist/reports/a11y-report.json`

**How to use:**
Run the command. The system spins up a headless browser, navigates to your local build, and runs:
1.  **Axe Core:** Checks for WCAG 2.1 violations (contrast, labels, aria).
2.  **Lighthouse:** Checks for Core Web Vitals.

---

## 🔌 Tool Integration Matrix

Here is how to export from every major tool a designer might use in 2026.

| Tool Category | Tool Name | Export As | Where to Put It |
| :--- | :--- | :--- | :--- |
| **UI Design** | Figma | JSON (Tokens Studio) | `src/tokens/` |
| | Sketch | JSON / SVG | `src/tokens/` or `src/assets/icons/` |
| | Zeplin | CSS/JSON | `src/tokens/` |
| **Whiteboard** | FigJam | PNG / PDF | `src/assets/img/` |
| | Miro | PDF / Image | `src/assets/img/` |
| | Whimsical | PNG | `src/assets/img/` |
| **Creative** | Photoshop | JPG / PNG | `src/assets/img/` |
| | Illustrator | SVG / AI | `src/assets/icons/` |
| | Midjourney | PNG (Upscaled) | `src/assets/img/` |
| | Firefly | JPG | `src/assets/img/` |
| | Affinity | SVG / PNG | `src/assets/img/` |
| **Motion** | Rive | `.riv` (Binary) | `src/assets/animation/` |
| | After Effects | `.json` (Lottie) | `src/assets/animation/` |
| | ProtoPie | MP4 / WebM | `src/assets/video/` |
| | Principle | MP4 / GIF | `src/assets/video/` |
| **Product** | Notion | Markdown (`.md`) | `src/ingest/content/` |
| | Jira | CSV (Convert to JSON) | `src/data/` |
| | Google Docs | Markdown / HTML | `src/ingest/content/` |
| | Confluence | HTML Export | `src/markup/pages/` |
| **Analytics** | GA4 | Tracking ID | `src/data/site.json` |
| | Hotjar | Site ID | `src/data/site.json` |
| | Mixpanel | Project Token | `src/data/site.json` |

---

## 🤖 AI Healing System

We have integrated **Gemini 3 Flash** directly into the Gulp error handler.

**What happens when I error?**
1.  You write bad Sass (e.g., undefined variable).
2.  The build fails.
3.  The `utils/ai-healer.js` intercepts the error object.
4.  It sends the stack trace to Google Gemini.
5.  Gemini analyzes the error and prints a **Solution** directly in your terminal.

*Note: Requires `API_KEY` in `.env`.*

---

## 🚨 Troubleshooting Guide

### "Gulp command not found"
Ensure you have installed Gulp globally or use `npx gulp`.
```bash
npm install --global gulp-cli
```

### "Images aren't updating"
We use `gulp-newer` (caching) to prevent re-processing 1000 images on every save.
*   **Fix:** Delete the `dist/assets/img` folder to force a full rebuild.

### "Tokens aren't generating SCSS"
*   **Fix:** Ensure your JSON file is valid JSON. Trailing commas are not allowed in standard JSON.
*   **Fix:** Ensure the file is named `tokens.json`.

---

*Built with ❤️ and obsession by Nischhal Raj Subba.*
