import { GoogleGenAI } from "@google/genai";

// Configuration for multiple providers
const CONFIG = {
    gemini: {
        active: true,
        model: 'gemini-3-flash-preview',
        apiKey: process.env.API_KEY
    },
    deepseek: {
        active: false, // User must enable and provide key
        endpoint: 'https://api.deepseek.com/v1/chat/completions',
        apiKey: '' 
    },
    openai: {
        active: false,
        model: 'gpt-4-turbo',
        apiKey: ''
    }
};

const SYSTEM_INSTRUCTION = `You are an expert Frontend Architect. Answer questions about Gulp, CSS, and JS workflow.`;

// Primary: Gemini (Free Tier/Provided)
async function callGemini(prompt) {
    if (!CONFIG.gemini.apiKey) throw new Error("No Gemini Key");
    const ai = new GoogleGenAI({ apiKey: CONFIG.gemini.apiKey });
    const response = await ai.models.generateContent({
        model: CONFIG.gemini.model,
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text.trim();
}

// Fallback 1: DeepSeek (Placeholder)
async function callDeepSeek(prompt) {
    // Requires implementation of fetch call to DeepSeek API
    // return "DeepSeek response...";
    throw new Error("DeepSeek not configured");
}

// Main Handler
export const askAssistant = async (prompt) => {
    try {
        // Try Primary
        if (CONFIG.gemini.active) {
            return await callGemini(prompt);
        }
        // Try Fallback
        if (CONFIG.deepseek.active) {
            return await callDeepSeek(prompt);
        }
    } catch (error) {
        console.error("All AI providers failed.", error);
        return "I am currently offline. Please check your API keys.";
    }
};