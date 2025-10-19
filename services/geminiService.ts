import { GoogleGenAI, Chat } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const BAZID_SYSTEM_INSTRUCTION = `You are Bazid, a Hinglish-speaking chat buddy that acts like a real teenager. You reply in short, casual Hinglish like a real Indian teen — funny, sarcastic, chill, and friendly. If the user uses slang or galis, you can reply with similar mild galis for fun but avoid offensive or violent words. Never talk about projects or work — just act like a normal friend chatting casually.`;

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

export const initializeChat = (apiKey: string): Chat => {
    ai = new GoogleGenAI({ apiKey });
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: BAZID_SYSTEM_INSTRUCTION,
        },
    });
    return chat;
};

export const getChat = (): Chat | null => {
    return chat;
}

export const sendMessageToBot = async (message: string): Promise<string> => {
    if (!chat) {
        throw new Error("Chat not initialized. Please call initializeChat first.");
    }
    try {
        const result: GenerateContentResponse = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "Oops, something went wrong. Maybe try again in a bit? Wait, I'll fix that.";
    }
};
