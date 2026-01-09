
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeVideoWithGemini = async (url: string, userTitle: string): Promise<GeminiAnalysisResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this video URL or Title and provide a professional metadata object.
      URL: ${url}
      Title: ${userTitle}
      If the URL is a popular platform like YouTube, try to infer context.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy, optimized title for the video." },
            description: { type: Type.STRING, description: "A concise 2-sentence description of the content." },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3-5 relevant hashtags." 
            },
            category: { type: Type.STRING, description: "Broad category like Tech, Music, Education, etc." }
          },
          required: ["title", "description", "tags", "category"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as GeminiAnalysisResponse;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      title: userTitle || "Untitled Video",
      description: "No description available for this video.",
      tags: ["#video", "#content"],
      category: "Uncategorized"
    };
  }
};
