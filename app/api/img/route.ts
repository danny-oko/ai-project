import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    console.log("Prompt:", prompt);

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GENAI_API_KEY,
    });

    console.log(ai);

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: prompt,
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const result: { text?: string; image?: string } = {};

    for (const part of parts) {
      if (part.text) {
        result.text = part.text;
      } else if (part.inlineData?.data) {
        result.image = part.inlineData.data;
      }
    }

    console.log(result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
