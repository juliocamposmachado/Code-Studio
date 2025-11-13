
import { GoogleGenAI, Type, Content } from "@google/genai";
import { Message } from '../types';

// The API key MUST be obtained from the environment variable `process.env.API_KEY`.
// Do not hardcode the API key here.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey! });

const modelName = "gemini-2.5-flash";

const systemInstruction = `You are an expert web developer AI assistant named 'Code Studio Assistant'.
Your goal is to help users build and modify web pages through conversation.
Based on the user's prompt and the conversation history, provide a friendly conversational reply and the complete, self-contained HTML code for the web page.

You MUST respond with a valid JSON object that follows this schema:
{
  "type": "OBJECT",
  "properties": {
    "message": {
      "type": "STRING",
      "description": "Your friendly, conversational reply to the user. You can use markdown."
    },
    "code": {
      "type": "STRING",
      "description": "The complete, self-contained HTML code. It must include all necessary CSS (in a <style> tag) and JavaScript (in a <script> tag)."
    }
  },
  "required": ["message", "code"]
}

If the user asks for a modification, update the code from the last turn.
If the user's request is unclear or not related to web development, ask for clarification in the 'message' field and return the last valid code in the 'code' field.`;

export const generateContentFromChat = async (history: Message[]): Promise<{ message: string; code: string }> => {
  if (!apiKey) {
    return {
      message: "API Key not configured. Please set the `process.env.API_KEY` environment variable.",
      code: `<html><body><h1>Configuration Error</h1><p>API Key is missing.</p></body></html>`,
    };
  }

  const contents: Content[] = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            code: { type: Type.STRING },
          },
          required: ["message", "code"],
        },
        temperature: 0.7,
      },
    });

    const jsonString = response.text.trim();
    const cleanedJsonString = jsonString.replace(/^```json|```$/g, '').trim();
    const parsed = JSON.parse(cleanedJsonString);
    
    if (typeof parsed.message === 'string' && typeof parsed.code === 'string') {
        return parsed;
    } else {
        throw new Error("Invalid JSON structure in response.");
    }

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    let errorMessage = "Sorry, I couldn't generate a response. Please check the console for more details.";
    if (error instanceof Error) {
        errorMessage = `An error occurred: ${error.message}`;
    }
    return {
      message: errorMessage,
      code: `<html><body><h1>Error</h1><p>Could not get a valid response from the AI.</p><p>${errorMessage}</p></body></html>`,
    };
  }
};
