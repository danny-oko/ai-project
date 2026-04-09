import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const defaultPrompt = `You are a sharp, no-nonsense food analyst. You've just been shown an image of a dish. Identify the key ingredients you can see, give a quick nutritional read, and flag anything interesting — hidden calories, smart swaps, or standout nutrients. Keep it under 80 words. Be direct, a little witty, like a food expert who respects the user's time.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: defaultPrompt,
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const result: { text?: string } = {};

    for (const part of parts) {
      if (part.text) {
        result.text = part.text;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
