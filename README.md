# DesignOps Orchestrator 2026 🎨

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Gemini_3-orange.svg?style=for-the-badge)
![Gulp](https://img.shields.io/badge/Gulp-5.0-red.svg?style=for-the-badge)

> *"The workflow that repairs itself."*

**DesignOps Orchestrator** is an enterprise-grade front-end workflow architected by **[Nischhal Raj Subba](https://github.com/Nischhalsubba)**. It bridges the gap between Design (Figma) and Engineering (Code) using a self-healing Gulp 5 pipeline powered by Google Gemini 3.

---

## 📚 Table of Contents
1.  [Why God-Tier?](#-why-god-tier)
2.  [Features](#-features)
3.  [Installation](#-installation)
4.  [Folder Structure](#-folder-structure)
5.  [The AI Core](#-the-ai-core)
6.  [Tasks & Pipeline](#-tasks--pipeline)

---

## 🚀 Why "God-Tier"?

Most boilerplates are static. This one is **alive**.

1.  **Self-Healing**: If your build fails (e.g., Sass error), the `AI Healer` intercepts the error, sends it to Gemini 3, and prints the solution code in your terminal.
2.  **Asset Injection**: You never manually link CSS/JS in HTML. `gulp-inject` handles hashing, versioning, and injection automatically.
3.  **Critical CSS**: Automatically extracts above-the-fold CSS and inlines it for 100/100 Lighthouse scores.
4.  **Modern Stack**: Built on ES2022, Dart Sass, and Gulp 5.0 (ESM).

---

## ✨ Features

### 🛠 Core Engineering
*   **Gulp 5.0**: Fully ESM module based architecture.
*   **ESBuild**: Blazing fast TypeScript/JavaScript bundling.
*   **Dart Sass**: The official implementation of Sass (with 7-1 pattern).
*   **Pug**: Clean, whitespace-sensitive HTML templating.

### 🖼 Hyper-Media Pipeline
*   **Next-Gen Formats**: Auto-converts images to `AVIF` and `WebP`.
*   **Responsive**: Generates `srcset` sizes (320w, 768w, 1280w) automatically.
*   **SVG Sprites**: Compiles icons into a single SVG symbol sprite.

### 🛡 Quality Assurance
*   **Stylelint**: Enforces consistent CSS property ordering and BEM naming.
*   **ESLint**: Catches JS logic errors.
*   **Pug-Linter**: Ensures consistent HTML indentation.
*   **W3C Validator**: Validates generated HTML against web standards.

### 🤖 AI Integration
*   **HealerBot**: Fixes build errors.
*   **ArchitectBot**: In-browser chat assistant for codebase queries.

---

## 📦 Installation

### Prerequisites
*   Node.js v18+
*   Google Gemini API Key (Get one at [aistudio.google.com](https://aistudio.google.com))

### Quick Start

1.  **Clone**
    ```bash
    git clone https://github.com/Nischhalsubba/design-ops-orchestrator.git
    cd design-ops-orchestrator
    ```

2.  **Install**
    ```bash
    npm install
    ```

3.  **Configure AI**
    Create a `.env` file in the root directory:
    ```bash
    API_KEY=your_gemini_api_key
    ```

4.  **Run Development Server**
    ```bash
    npm start
    ```
    > Opens http://localhost:3000

---

## 📂 Folder Structure

```
root/
├── .env                  # API Keys
├── gulpfile.js           # Task Orchestrator
├── gulp/                 # Task Logic
│   ├── config.js         # Central Configuration
│   ├── tasks/            # Modular Tasks (styles.js, markup.js, etc.)
│   └── utils/            # AI Utilities
├── src/                  # Source Code
│   ├── assets/           # Raw Images, Fonts
│   ├── data/             # JSON Data for Pug
│   ├── markup/           # Pug Templates
│   ├── scripts/          # TypeScript / ES6
│   └── styles/           # SCSS (7-1 Pattern)
└── dist/                 # Production Output
```

---

## 🧠 The AI Core

### 1. The Healer (Build Time)
Located in `gulp/utils/ai-healer.js`.
When a Gulp task throws an error, the `plumber` plugin catches it and passes the stack trace to Gemini. Gemini analyzes the code context and returns a specific fix, which is displayed in the terminal.

### 2. The Architect (Run Time)
Located in `js/ai-manager.js`.
A client-side chat interface that allows developers to ask questions about the project structure or request new boilerplate code.

---

## 🔧 Tasks & Pipeline

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm start` | **Develop** | Clean -> Lint -> Compile -> Serve -> Watch. |
| `npm run build` | **Production** | Clean -> Lint -> Compile -> Minify -> Hash -> Inject -> Critical CSS -> Brotli. |
| `npm run lint` | **Audit** | Runs Stylelint, ESLint, and Pug-Linter. |
| `npm test` | **Test** | Runs Jest unit tests. |

---

## 👤 Author

**Nischhal Raj Subba**  
*Product Designer & Creative Technologist*

*   [GitHub](https://github.com/Nischhalsubba)
*   [LinkedIn](https://www.linkedin.com/in/nischhal/)

---

*Built with ❤️ for the future of web development.*
