# DesignOps Orchestrator 4.1: God-Tier Edition ⚡️

![Version](https://img.shields.io/badge/version-4.1.0-purple.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Stable-green.svg?style=for-the-badge)

The ultimate workflow for Product Designers and Creative Technologists. Bridge the gap between **Figma** and **Production Code** using automated token pipelines and AI agents.

---

## 🔌 The 2026 Toolchain Integration Matrix

We support asset ingestion from **60+ modern design tools**. Drag and drop your exports into the monitored folders, and the system handles optimization, minification, and code generation.

### 🎨 UI & Design Systems
| Tool | Export As | Destination |
| :--- | :--- | :--- |
| **Figma** | Tokens (JSON via Tokens Studio) | `src/tokens/tokens.json` |
| **Sketch** | Tokens (JSON) / SVG | `src/tokens/` or `src/assets/icons/` |
| **FigJam** | PNG / PDF | `src/assets/img/` |
| **InVision** | SVG / PNG | `src/assets/img/` |
| **Miro** | PDF / Image | `src/assets/img/` |
| **Zeplin** | CSS / JSON | `src/tokens/` |
| **Storybook** | (Component Code) | `src/markup/components/` |

### 🖌 Creative Suite & Raster
| Tool | Export As | Destination |
| :--- | :--- | :--- |
| **Photoshop** | JPG / PNG | `src/assets/img/` |
| **Illustrator** | SVG / AI | `src/assets/icons/` |
| **Affinity** | SVG / PNG | `src/assets/img/` |
| **Midjourney** | PNG (Upscaled) | `src/assets/img/` |
| **Firefly** | JPG | `src/assets/img/` |

### 🎬 Motion & Prototyping
| Tool | Export As | Destination |
| :--- | :--- | :--- |
| **Rive** | `.riv` (Binary) | `src/assets/animation/` |
| **Lottie** | `.json` | `src/assets/animation/` |
| **After Effects** | Bodymovin JSON | `src/assets/animation/` |
| **ProtoPie** | MP4 / WebM | `src/assets/video/` |
| **Principle** | MP4 / GIF | `src/assets/video/` |

### 📝 Product Management & Content
| Tool | Export As | Destination |
| :--- | :--- | :--- |
| **Notion** | Markdown (`.md`) | `src/ingest/content/` |
| **Jira** | CSV (Convert to JSON) | `src/data/` |
| **Google Docs** | Markdown / HTML | `src/ingest/content/` |
| **Confluence** | HTML Export | `src/markup/pages/` |

### ✅ Testing & QA
| Tool | Action | Command |
| :--- | :--- | :--- |
| **Cypress** | E2E Testing | `npm run test:e2e` |
| **Lighthouse** | Perf Audit | `npm run audit` |
| **Axe** | A11y Audit | `npm run test:a11y` |

---

## 💎 The Figma Token Engine

1.  Export your tokens from Figma (using Tokens Studio or native export) as JSON.
2.  Save the file to `src/tokens/tokens.json`.
3.  **That's it.** The system automatically:
    *   Parses the JSON.
    *   Converts it to SCSS variables (`_generated-tokens.scss`).
    *   Recompiles your CSS.
    *   Reloads the browser.

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
