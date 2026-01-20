# DesignOps Orchestrator 2026 🎨

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg?style=for-the-badge)
![Target](https://img.shields.io/badge/User-Product_Designer-pink.svg?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Gemini_3-orange.svg?style=for-the-badge)

> **For Product Designers who want pixel-perfect code without the headache.**

This isn't just a coding boilerplate. It is a bridge between your design tools and the final browser output. It handles the boring parts of development (optimizing images, writing vendor prefixes, minifying code) so you can focus on translation your vision.

---

## 🌉 Bridging the Gap

We support assets from your entire stack:

| Your Tool | The Output | Our Pipeline Action |
| :--- | :--- | :--- |
| **Figma / Sketch** | `.svg` Icons | Compiles into a single `sprite.svg` for easy usage. |
| **Photoshop / Firefly** | `.png`, `.jpg` | Converts to `WebP` & `AVIF` automatically. Generates responsive sizes. |
| **After Effects / Lottie** | `.json` | Minifies JSON for performant web animation. |
| **Figma Variables** | Design Tokens | Maps to SCSS variables in `src/styles/abstracts`. |
| **Google Analytics / Hotjar** | Tracking Scripts | Injects tags into `<head>` automatically via config. |

---

## 🚀 Quick Start for Designers

1.  **Download the Code**
    Open your terminal and run:
    ```bash
    git clone https://github.com/Nischhalsubba/design-ops-orchestrator.git
    cd design-ops-orchestrator
    ```

2.  **Install the "Machine"**
    This installs all the optimization tools (Gulp, Sass, Image Processors).
    ```bash
    npm install
    ```

3.  **Start Designing in Code**
    ```bash
    npm start
    ```
    This opens a local website (`localhost:3000`). Whenever you save a file, the browser updates instantly.

---

## 🗺 Where do I put my files?

Forget complex engineering folder structures. Here is where your exports go:

*   **Exporting Icons?** → `src/assets/icons/`
*   **Exporting Images?** → `src/assets/img/`
*   **Exporting Fonts?** → `src/assets/fonts/`
*   **Changing Colors/Typography?** → `src/styles/abstracts/_variables.scss`
*   **Editing Content/Text?** → `src/markup/pages/index.pug`

---

## 🤖 AI "Healer" (No-Code Safety Net)

If you aren't comfortable with code, don't worry. This project includes **Gemini 3**.

If you make a syntax error (like forgetting a semicolon or misnaming a variable), the AI will:
1.  Catch the error.
2.  Analyze it.
3.  **Tell you exactly what to type to fix it** in the terminal.

*Note: You need a generic Google Gemini API Key in a `.env` file for this feature.*

---

## 🛠 Full Tool Support

We have verified workflows for:

*   **Design:** Figma, Sketch, Adobe XD, Affinity Designer, Penpot.
*   **Prototyping:** ProtoPie, Rive, Framer (Asset export).
*   **Raster:** Photoshop, Lightroom, Midjourney, DALL-E.
*   **Analytics:** GA4, Mixpanel, Hotjar, Clarity.
*   **Testing:** BrowserStack, Percy, Lighthouse.

---

## 👤 Author

**Nischhal Raj Subba**  
*Product Designer & Creative Technologist*

*   [GitHub](https://github.com/Nischhalsubba)
*   [LinkedIn](https://www.linkedin.com/in/nischhal/)

---

*Built with ❤️ to empower designers to build.*
