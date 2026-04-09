import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Using the unified 2026 client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    // In @google/genai, use ai.models.generateContent
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [{ role: "user", parts: [{ text: question }] }],
      config: {
        // System instructions are part of the 'config' block in this SDK
        systemInstruction: "You are a concise food assistant. Answer in plain, direct language. No headers, no bullet walls, no fluff. Get straight to the point.",
        maxOutputTokens: 120,
        temperature: 0.3,
        topP: 0.8,
        topK: 20,
      },
    });

    // In this SDK, the text is returned directly on the response object
    return NextResponse.json({ answer: response.text });

  } catch (error) {
    console.error("AI Assistant Error:", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }
}
