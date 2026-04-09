"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function IngredientsAnalysisPage() {
  const router = useRouter();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setResult("");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = (reader.result as string).split(",")[1];

      const res = await fetch("/api/recognition/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Data, type: file.type }),
      });

      const data = await res.json();
      setResult(data.description || "Could not analyze the image.");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setPreview(null);
    setResult("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col h-screen bg-[#131314] text-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-[#9aa0a6] hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
        >
          ← Back
        </button>
        <span className="text-sm font-medium text-[#9aa0a6]">
          Ingredient Analyst
        </span>
        <div className="w-16" />
      </header>

      {/* Main Area */}
      <div className="flex-1 overflow-y-auto">
        {!preview && !loading ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full gap-6 px-4 text-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-2">
                What's in your dish?
              </h2>
              <p className="text-[#9aa0a6] text-sm">
                Upload a photo and get an instant ingredient breakdown.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-xl">
              {[
                "Snap your meal",
                "Check hidden calories",
                "Find smart swaps",
                "Spot key nutrients",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => inputRef.current?.click()}
                  className="text-xs text-[#9aa0a6] bg-[#1e1f20] hover:bg-[#28292a] border border-white/10 rounded-full px-4 py-2 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Results view
          <div className="max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
            {/* User message with image */}
            <div className="flex items-start gap-4 flex-row-reverse">
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold bg-[#3c4043] text-white">
                U
              </div>
              <div className="flex flex-col gap-2 max-w-[80%] items-end">
                {preview && (
                  <div className="relative group rounded-2xl overflow-hidden border border-white/10">
                    <img
                      src={preview}
                      alt="Uploaded dish"
                      className="w-full h-auto max-w-md"
                    />
                    {!loading && (
                      <button
                        onClick={handleReset}
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md"
                      >
                        Try another
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* AI response */}
            {loading ? (
              <div className="flex items-start gap-4 flex-row">
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold bg-gradient-to-br from-[#8ab4f8] to-[#c58af9] text-[#131314]">
                  AI
                </div>
                <div className="flex gap-1 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9aa0a6] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9aa0a6] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9aa0a6] animate-bounce" />
                </div>
              </div>
            ) : result ? (
              <div className="flex items-start gap-4 flex-row">
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold bg-gradient-to-br from-[#8ab4f8] to-[#c58af9] text-[#131314]">
                  AI
                </div>
                <div className="flex flex-col gap-2 max-w-[80%] items-start">
                  <div className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed text-[#e8eaed]">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-base font-bold text-white mt-4 mb-1.5 first:mt-0">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-sm font-bold text-white mt-4 mb-1.5 first:mt-0">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-semibold text-white/90 mt-3 mb-1 first:mt-0">
                            {children}
                          </h3>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-white">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-white/70">{children}</em>
                        ),
                        ul: ({ children }) => (
                          <ul className="space-y-1 my-2 ml-1">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="space-y-1 my-2 ml-1 list-decimal list-inside">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="flex items-start gap-2 text-[#e8eaed]">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-white/30 shrink-0" />
                            <span>{children}</span>
                          </li>
                        ),
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        hr: () => <hr className="border-white/10 my-3" />,
                        code: ({ children }) => (
                          <code className="bg-white/10 rounded px-1 py-0.5 text-xs font-mono text-white/80">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {result}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 px-4 pb-8 pt-4">
        <div className="max-w-2xl mx-auto">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <div className="relative flex items-center gap-2 bg-[#1e1f20] rounded-3xl px-4 py-3 border border-white/10 ring-1 ring-transparent transition-all duration-200 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.4)]">
            <span className="flex-1 text-[15px] text-white/25 py-1 px-1 select-none">
              {preview ? "Upload another image..." : "Upload a dish image..."}
            </span>
            <Button
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              size="icon"
              className="shrink-0 h-9 w-9 rounded-2xl bg-white hover:bg-white/90 text-[#131314] shadow-md transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-20 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="block w-4 h-4 border-2 border-[#131314] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              )}
            </Button>
          </div>
          <p className="text-center text-[10px] text-white/20 mt-3 tracking-widest uppercase">
            Powered by Gemini · Instant Ingredient Analysis
          </p>
        </div>
      </div>
    </div>
  );
}
