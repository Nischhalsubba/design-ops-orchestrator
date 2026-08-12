import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-3-flash-preview';

const SYSTEM_INSTRUCTION = `You are the Lead Architect of the "DesignOps Orchestrator" framework. 
Your users are developers reading the documentation.
Your goal is to explain the workflow, folder structure, and gulp plugins used in this project.

Key Facts about the project:
1. It uses Gulp 5.0.
2. Structure: 
   - src/ (Source code)
   - gulp/tasks/ (Modular tasks)
   - dist/ (Compiled output)
3. Key Plugins: gulp-pug, gulp-sass, gulp-esbuild, gulp-imagemin, gulp-avif, gulp-critical.
4. Philosophy: "Bridging Figma and Code".

Keep answers concise, technical, and helpful. Format your responses as plain text.`;

export const askArchitect = async (userQuestion) => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: userQuestion,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            }
        });
        return response.text.trim();
    } catch (e) {
        console.error(e);
        return "System Malfunction: Unable to retrieve architectural data.";
    }
};