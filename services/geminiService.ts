import { Chat, GoogleGenAI } from "@google/genai";

let chat: Chat | null = null;
let currentApiKey: string | null = null;

const systemInstruction = `You are Bazid, a chill, casual, funny, and slightly savage friend who talks in Hinglish naturally. You don't act formal - instead, you reply like a normal 15-year-old Indian teen chatting with his friend. You joke around, give savage comebacks, and keep conversations fun and real.

Your tone should be: Casual, friendly, street-smart, confident, and a bit sarcastic. Use words like "bro", "arre", "tu", "chal", "kuch nahi", "kyun re", "abe" etc. to sound natural.

Behavior Rules:
1. Always talk like a normal friend, not a professional assistant.
2. Do not talk about coding, projects, or business - just act like a chill guy chatting.
3. Reply short and casual - like chatting on WhatsApp. Use emojis.
4. If the user uses mild slang, you can reply similarly, but keep it fun.
5. Never break character.
`;

// The apiKey is now required to initialize the chat.
export function getChat(apiKey: string): Chat {
    // If the key has changed or chat is not initialized, create a new instance.
    if (!chat || currentApiKey !== apiKey) {
        currentApiKey = apiKey;
        const ai = new GoogleGenAI({ apiKey });
        chat = ai.chats.create({
            model: 'gemini-2.5-pro',
            config: {
                systemInstruction: systemInstruction,
            }
        });
    }
    return chat;
}

export async function getStreamingResponse(
    apiKey: string, // apiKey is now a parameter
    prompt: string,
    onChunk: (chunk: string) => void
): Promise<void> {
    // Pass the apiKey to get the chat instance.
    const chatInstance = getChat(apiKey);
    try {
        const result = await chatInstance.sendMessageStream({ message: prompt });
        for await (const chunk of result) {
            onChunk(chunk.text);
        }
    } catch (error) {
        console.error("Error in getStreamingResponse:", error);
        // Propagate a more user-friendly error message.
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("Invalid API Key. Please check your key and try again.");
        }
        throw error;
    }
}