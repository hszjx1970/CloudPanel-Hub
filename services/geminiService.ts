

import { GoogleGenAI, Type } from "@google/genai";
import { FileItem, OrganizationPlan } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY not found in environment variables. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const suggestNewFileName = async (currentName: string): Promise<string | null> => {
  if (!API_KEY) return null;
  
  try {
    const prompt = `Suggest a clean, descriptive, and conventional file name for a file currently named "${currentName}". Follow these rules:
1. Use snake_case or kebab-case for multi-word names.
2. Keep the original file extension.
3. Do not add any explanation, quotation marks, or extra text.
4. Only return the new file name.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    const text = response.text.trim();
    
    // Clean up potential markdown code blocks
    const cleanedText = text.replace(/`/g, '');
    
    return cleanedText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get suggestion from Gemini API.");
  }
};


export const suggestOrganizationPlan = async (files: FileItem[], currentPath: string): Promise<OrganizationPlan | null> => {
  if (!API_KEY) return null;

  const fileNames = files.filter(f => f.type === 'file').map(f => f.name);
  if (fileNames.length === 0) return null;

  const prompt = `
    Analyze the following list of file names and create a plan to organize them into new sub-folders within the current directory.

    File names: ${JSON.stringify(fileNames)}

    RULES:
    1. Group files by common themes (e.g., 'Photos', 'Documents', 'Videos', 'Screenshots', 'Reports').
    2. Suggest creating new folders for these themes.
    3. Suggest moving files into their corresponding new folders.
    4. ONLY respond with a valid JSON array of actions. Do not add any other text or markdown.
    5. The 'folderName' for CREATE_FOLDER should just be the name, not a path.
    6. The 'newFolderName' for MOVE_FILE should also just be the name, not a path.
  `;
  
  try {
     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    action: { type: Type.STRING, enum: ["CREATE_FOLDER", "MOVE_FILE"] },
                    folderName: { type: Type.STRING },
                    fileName: { type: Type.STRING },
                    newFolderName: { type: Type.STRING },
                },
                required: ["action"]
            },
          },
        },
    });

    const jsonText = response.text;
    const plan = JSON.parse(jsonText) as OrganizationPlan;
    return plan;

  } catch (error) {
    console.error("Error calling Gemini API for organization plan:", error);
    throw new Error("Failed to get organization plan from Gemini API.");
  }
};