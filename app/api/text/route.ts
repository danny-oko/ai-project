import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  const defaultPrompt = `You are a concise food assistant. Answer in plain, direct language. No headers, no bullet walls, no fluff. Keep responses under 100 words unless a list is truly necessary. Get straight to the point.
  Question: ${question}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: defaultPrompt,
  });

  return NextResponse.json({ answer: response.text });
}
