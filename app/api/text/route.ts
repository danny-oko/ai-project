import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  const defaultPrompt = `You are a knowledgeable and friendly food assistant. Answer the following food-related question clearly and helpfully. Cover relevant details about ingredients, nutrition, preparation tips, or alternatives where applicable.\n\nQuestion: ${question}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: defaultPrompt,
  });

  return NextResponse.json({ answer: response.text });
}
