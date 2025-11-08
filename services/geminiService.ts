
import { GoogleGenAI, type Content } from "@google/genai";
import { type Message } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function runChat(history: Message[]): Promise<string> {
    const model = 'gemini-2.5-pro';
    
    // Map Message[] to Content[]
    const contents: Content[] = history.map(msg => ({
        role: msg.role,
        parts: msg.parts
    }));

    const response = await ai.models.generateContent({
        model: model,
        contents: contents,
    });
    
    return response.text;
}
