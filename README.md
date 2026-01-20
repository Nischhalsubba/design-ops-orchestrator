# DesignOps Orchestrator 4.1: God-Tier Edition ⚡️

![Version](https://img.shields.io/badge/version-4.1.0-purple.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Stable-green.svg?style=for-the-badge)

The ultimate workflow for Product Designers and Creative Technologists. Bridge the gap between **Figma** and **Production Code** using automated token pipelines and AI agents.

## 📜 Why I Built This (by Nischhal Raj Subba)

I spent years watching designers and developers fight a losing war against **Entropy**. 
Designers update a color in Figma; Developers miss the memo. A content writer fixes a typo in Notion; 
it takes three days to deploy. An animator updates a Rive file; the implementation breaks.

This "Drift" kills products. It kills morale. It kills excellence.

I built the **DesignOps Orchestrator** to be the immutable source of truth. It is not just a build tool; 
it is a translator. It speaks "Figma" and outputs "SCSS". It speaks "Notion" and outputs "JSON". 
It speaks "After Effects" and outputs "Optimized Assets".

This is my vision for 2026: A world where the tool doesn't matter, only the intent. 
Export your intent, and let the Orchestrator handle the code.

---

## 🔌 The 2026 Toolchain Engines

We support asset ingestion from **60+ modern design tools**. Drag and drop your exports into the monitored folders, and the system handles optimization, minification, and code generation.

### 1. The Design Token Engine 🎨
*Supports: Figma, Sketch, Zeplin, Tokens Studio*

**How to use:**
1.  **Export:** Use the "Tokens Studio" plugin in Figma to export your variables as `tokens.json`.
2.  **Drop:** Place the file in `src/tokens/tokens.json`.
3.  **Result:** The system automatically parses the JSON and generates `src/styles/abstracts/_generated-tokens.scss`. You can now use variables like `$global-colors-primary` in your CSS immediately.

### 2. The Content Engine 📝
*Supports: Notion, Obsidian, Google Docs, Jira*

**How to use:**
1.  **Export:** Export your page as **Markdown & CSV** from Notion or Google Docs.
2.  **Drop:** Place `.md` files in `src/ingest/content/`.
3.  **Result:** The engine reads the Frontmatter (title, date, tags) and the Body. It compiles everything into a single JSON database at `src/data/generated_content.json`. Your Pug templates can now loop through `articles` automatically.

### 3. The Motion Engine 🎬
*Supports: Rive, Lottie, After Effects, ProtoPie*

**How to use:**
1.  **Export:**
    *   **Lottie:** Export JSON from After Effects (Bodymovin).
    *   **Rive:** Export `.riv` binary.
2.  **Drop:** Place files in `src/assets/animation/`.
3.  **Result:**
    *   Lottie JSON is minified (whitespace removed).
    *   Rive files are copied.
    *   **Manifest Generation:** A `_motion-manifest.json` file is created in the dist folder listing all available animations, so your frontend code can dynamically load them without hardcoding paths.

### 4. The Visual Engine 🖼
*Supports: Photoshop, Illustrator, Midjourney, Firefly*

**How to use:**
1.  **Export:** Save high-res PNG or JPGs.
2.  **Drop:** Place in `src/assets/img/`.
3.  **Result:** The engine automatically generates **AVIF** and **WebP** versions of every image, plus optimized fallbacks. It also generates responsive sizes (320w, 768w) if configured.

---

## 🚀 Commands

| Command | Action |
| :--- | :--- |
| `npm start` | **Development Mode.** Watches files, compiles tokens, spins up localhost. |
| `npm run tokens` | **Token Sync.** Manually forces a refresh of the Figma Tokens. |
| `npm run build` | **Production Build.** Minifies, Compresses, Hashes, and Optimizes everything. |
| `npm run audit` | **QA Audit.** Runs Lighthouse and Axe. |
| `gulp release` | **Release.** Bumps version, commits to git, and creates a zip archive. |
| `gulp todo` | **Task Scan.** Generates a `todo.json` from your code comments. |

---

## 🤖 AI Healer

Includes **Gemini 3 Integration**. 
If a build fails (e.g., Sass error), the AI Agent intercepts the error, analyzes the stack trace, and suggests the exact code fix in your terminal.

*Add your `API_KEY` to `.env` to enable.*

---

*Built for the obsessed.*
