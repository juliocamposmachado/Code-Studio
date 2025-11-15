import { GoogleGenAI, Type, Content } from "@google/genai";
import { Message, Files } from '../types';

const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey! });

const modelName = "gemini-2.5-flash";

const getSystemInstruction = (files: Files, activeFile: string): string => {
    const fileList = Object.keys(files).join(', ');
    const activeFileContent = files[activeFile]?.content || '';

    return `You are an expert web developer AI assistant acting as a VS Code extension.
Your goal is to help users build and modify web pages by editing their code files.

The user is working on a project with the following files: ${fileList}.
The currently active file is \`${activeFile}\`.

The current content of \`${activeFile}\` is:
\`\`\`${files[activeFile]?.language}
${activeFileContent}
\`\`\`

Based on the user's prompt, you must provide a friendly conversational reply and the complete, updated code for the currently active file (\`${activeFile}\`).
Do not suggest creating new files. Only modify the active file.
Ensure the generated code is complete and self-contained for that file.

You MUST respond with a valid JSON object that follows this schema:
{
  "type": "OBJECT",
  "properties": {
    "message": {
      "type": "STRING",
      "description": "Your friendly, conversational reply to the user, in markdown format."
    },
    "code": {
      "type": "STRING",
      "description": "The complete, updated code for the active file '${activeFile}'. It must be a single string."
    }
  },
  "required": ["message", "code"]
}

If the user asks for a modification, update the code from the provided content of the active file.
If the user's request is unclear or not related to web development, ask for clarification in the 'message' field and return the last valid code in the 'code' field.`;
}

export const generateContentFromChat = async (history: Message[], files: Files, activeFile: string): Promise<{ message: string; code: string }> => {
  if (!apiKey) {
    return {
      message: "API Key not configured. Please set the `process.env.API_KEY` environment variable.",
      code: files[activeFile]?.content || `<h1>Configuration Error</h1><p>API Key is missing.</p>`,
    };
  }

  const systemInstruction = getSystemInstruction(files, activeFile);
  
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
      code: files[activeFile]?.content || `<h1>Error</h1><p>Could not get a valid response from the AI.</p>`,
    };
  }
};
