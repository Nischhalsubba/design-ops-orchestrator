import { GoogleGenAI } from '@google/genai';
import fancyLog from 'fancy-log';
import chalk from 'chalk';

const MODEL_NAME = 'gemini-3-flash-preview';

export async function healBuildError(taskName, error) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
        fancyLog(chalk.gray(`AI Healer skipped for ${taskName}: no API key configured.`));
        return;
    }

    fancyLog(chalk.red.bold(`[${taskName}] FAILED! Calling AI Healer...`));

    const prompt = `
        I am a Gulp Build System. I encountered an error in the task "${taskName}".

        Error Message:
        ${error.message}

        Stack/Details:
        ${error.codeFrame || error.stack || 'No stack trace'}

        Please explain why this happened and provide the exact code fix.
        Keep it short and concise. Format the fix as code.
    `;

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                systemInstruction: 'You are a Senior DevOps Engineer. You fix build errors.'
            }
        });

        console.log(chalk.yellow('---------------------------------------------------'));
        console.log(chalk.cyan.bold('AI HEALER SUGGESTION:'));
        console.log(chalk.white(response.text));
        console.log(chalk.yellow('---------------------------------------------------'));
    } catch {
        fancyLog(chalk.gray('AI Healer failed to connect.'));
    }
}
