import { GoogleGenAI, Type, Content } from "@google/genai";
import { Message, Files } from '../types';

// This is a temporary type definition until it's properly exported from the main types file.
interface Roadmap {
    tasks: string[];
    currentStep: number;
}


const modelName = "gemini-2.5-flash";

const getSystemInstruction = (files: Files, activeRoadmap: Roadmap | null): string => {
    const fileContents = Object.entries(files)
        .map(([fileName, fileData]) => `
--- START OF ${fileName} ---
\`\`\`${fileData.language}
${fileData.content}
\`\`\`
--- END OF ${fileName} ---
`)
        .join('\n');

    let roadmapInstruction = '';
    // Add roadmap context if one is active.
    if (activeRoadmap && activeRoadmap.tasks.length > 0) {
        const completedTasks = activeRoadmap.tasks.slice(0, activeRoadmap.currentStep).map(t => `- [x] ${t}`).join('\n');
        
        // Highlight the current task
        let remainingTasksList: string[] = [];
        if (activeRoadmap.currentStep < activeRoadmap.tasks.length) {
            const currentTask = activeRoadmap.tasks[activeRoadmap.currentStep];
            remainingTasksList.push(`- [ ] ${currentTask} <-- YOU ARE HERE. EXECUTE THIS STEP.`);
            
            const futureTasks = activeRoadmap.tasks.slice(activeRoadmap.currentStep + 1);
            futureTasks.forEach(t => remainingTasksList.push(`- [ ] ${t}`));
        }
        
        const remainingTasks = remainingTasksList.join('\n');

        roadmapInstruction = `
---
CONTEXT: You are in the middle of executing a multi-step plan that the user has already approved.
Your task is to execute the step marked with '<-- YOU ARE HERE'.

ROADMAP STATUS:
${completedTasks}
${remainingTasks}

Based on the user's confirmation to proceed, you MUST execute ONLY the current step.
Provide the file updates and/or terminal commands for this step.
In your response message, confirm that you've completed the step and state what the next step is.
Do NOT create a new roadmap. Do NOT ask for confirmation again. Just execute the current step.
---
`;
    }

    return `You are Julio, an expert fullstack programmer AI assistant with mastery of every programming language in the world. You are integrated into a VS Code-like environment.
Your purpose is to help users by writing code, modifying existing files, creating new files, running tests, and executing terminal commands.

The user is working on a project with the following files and their current content:
${fileContents}
${roadmapInstruction}
Based on the user's prompt, you must determine what actions to take. You can:
1.  **Modify or create files:** Provide the complete, updated code for any file that needs to be changed. If creating a new file, include its full path and content in the 'filesToUpdate' array.
2.  **Execute terminal commands:** If the user's request requires a command (e.g., "install flask", "run the python script"), provide the command(s) in the 'commandsToExecute' array. The terminal is a standard bash-like terminal.

IMPORTANT: For complex requests that require multiple steps (e.g., 'refactor the game', 'add a new feature'), you MUST first break down the task into a logical sequence of smaller steps.
Present this plan as a "roadmap". Your response should contain the plan in the 'message' field and the list of steps in a 'roadmap' array.
In this initial planning response, the 'filesToUpdate' and 'commandsToExecute' arrays MUST be empty. Wait for the user to approve before you start making code changes.

Example of a planning response:
{
  "message": "That's a great idea! Here's how I plan to add power-ups:\\n1. Update script.js to define a power-up object.\\n2. Add logic to spawn power-ups.\\nShall I start with the first step?",
  "filesToUpdate": [],
  "roadmap": ["Define power-up object", "Add logic to spawn power-ups"]
}

Once the user agrees to proceed (e.g., "OK, proceed"), you will execute ONE step at a time. Your response should contain the code changes for that single step and a message confirming completion and asking to proceed to the next one.

You MUST respond with a valid JSON object that follows this schema:
{
  "type": "OBJECT",
  "properties": {
    "message": {
      "type": "STRING",
      "description": "Your friendly, conversational reply to the user, in markdown format. As Julio, you should be helpful and confident."
    },
    "filesToUpdate": {
      "type": "ARRAY",
      "description": "An array of objects representing files to update or create. Only include changed files. Can be empty.",
      "items": {
        "type": "OBJECT",
        "properties": {
          "fileName": { "type": "STRING" },
          "content": { "type": "STRING" }
        },
        "required": ["fileName", "content"]
      }
    },
    "commandsToExecute": {
        "type": "ARRAY",
        "description": "An optional array of strings representing terminal commands to execute in sequence. Use this for actions like installing dependencies or running scripts.",
        "items": { "type": "STRING" }
    },
    "roadmap": {
        "type": "ARRAY",
        "description": "An optional array of strings describing the steps for a complex task.",
        "items": { "type": "STRING" }
    }
  },
  "required": ["message", "filesToUpdate"]
}

If the user's request is unclear, ask for clarification in the 'message' field and return empty 'filesToUpdate' and 'commandsToExecute' arrays.`;
}

export const generateContentFromChat = async (history: Message[], files: Files, apiKey: string, activeRoadmap: Roadmap | null): Promise<{ message: string; filesToUpdate: Record<string, string>, roadmap?: string[], commandsToExecute?: string[] }> => {
  if (!apiKey) {
    return {
      message: "API Key not configured. Please go to the Extensions tab (puzzle icon) to add your Google Gemini API key.",
      filesToUpdate: {},
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = getSystemInstruction(files, activeRoadmap);
  
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
            filesToUpdate: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  fileName: { type: Type.STRING },
                  content: { type: Type.STRING },
                },
                required: ["fileName", "content"],
              },
            },
            commandsToExecute: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
            roadmap: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
          },
          required: ["message", "filesToUpdate"],
        },
        temperature: 0.7,
      },
    });

    const jsonString = response.text.trim();
    const cleanedJsonString = jsonString.replace(/^```json|```$/g, '').trim();
    const parsed = JSON.parse(cleanedJsonString);
    
    if (typeof parsed.message === 'string' && Array.isArray(parsed.filesToUpdate)) {
        const filesToUpdateRecord: Record<string, string> = {};
        for (const fileUpdate of parsed.filesToUpdate) {
            if (
              typeof fileUpdate === 'object' &&
              fileUpdate !== null &&
              'fileName' in fileUpdate &&
              'content' in fileUpdate &&
              typeof fileUpdate.fileName === 'string' &&
              typeof fileUpdate.content === 'string'
            ) {
                 filesToUpdateRecord[fileUpdate.fileName] = fileUpdate.content;
            }
        }
        return { 
            message: parsed.message, 
            filesToUpdate: filesToUpdateRecord,
            roadmap: parsed.roadmap,
            commandsToExecute: parsed.commandsToExecute
        };
    } else {
        throw new Error("Invalid JSON structure in response.");
    }

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    let errorMessage = "Sorry, I couldn't generate a response. Please check the console for more details.";
    if (error instanceof Error) {
        errorMessage = `An error occurred: ${error.message}`;
        if (error.message.includes('API key not valid')) {
            errorMessage = "Your API key is not valid. Please check it in the Extensions tab.";
        }
    }
    return {
      message: errorMessage,
      filesToUpdate: {},
      commandsToExecute: []
    };
  }
};