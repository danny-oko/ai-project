import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { image, type } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const defaultPrompt = `You are a sharp, no-nonsense food analyst. You've just been shown an image of a dish. Identify the key ingredients you can see, give a quick nutritional read, and flag anything interesting — hidden calories, smart swaps, or standout nutrients. Keep it under 80 words. Be direct, a little witty, like a food expert who respects the user's time.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            { text: defaultPrompt },
            { inlineData: { mimeType: type, data: image } },
          ],
        },
      ],
    });

    return NextResponse.json({ description: response.text });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 },
    );
  }
}
