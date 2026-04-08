import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: question,
  });
  console.log("server res:", response);
  return NextResponse.json({ answer: response.text });
}
