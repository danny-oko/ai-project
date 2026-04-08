import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  // const defaultPrompt = `I want to deeply understand ${question}. Break it down into its 20% core components that account for 80% of the results (Pareto Principle). Explain how these components connect to each other.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: question,
  });

  return NextResponse.json({ answer: response.text });
}
