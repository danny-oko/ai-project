"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Define a unified Message type to avoid TS errors
type Message = {
  role: "user" | "assistant";
  text?: string;
  image?: string;
  loading?: boolean;
};

const SUGGESTIONS = [
  "A fox in a neon Tokyo alley at midnight",
  "Underwater baroque library with glowing fish",
  "Astronaut eating ramen on the moon, photorealistic",
  "Art deco robot reading poetry in a café",
];

export default function ImageGenPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea height
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  async function handleSend() {
    const prompt = input.trim();
    if (!prompt || loading) return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", text: prompt },
      { role: "assistant", loading: true },
    ]);
    setLoading(true);

    try {
      const res = await fetch("/api/img", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          text: data.text,
          image: data.image,
          loading: false,
        };
        return updated;
      });
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          text: "Something went wrong. Please try again.",
          loading: false,
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

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
          AI Image Studio
        </span>
        <div className="w-16" /> {/* Spacer */}
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          /* Empty State / Welcome */
          <div className="flex flex-col items-center justify-center h-full gap-6 px-4 text-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-2">
                What shall we create?
              </h2>
              <p className="text-[#9aa0a6] text-sm">
                Describe a scene, mood, or concept.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-xl">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs text-[#9aa0a6] bg-[#1e1f20] hover:bg-[#28292a] border border-white/10 rounded-full px-4 py-2 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                    msg.role === "user"
                      ? "bg-[#3c4043] text-white"
                      : "bg-gradient-to-br from-[#8ab4f8] to-[#c58af9] text-[#131314]"
                  }`}
                >
                  {msg.role === "user" ? "U" : "AI"}
                </div>

                {/* Content */}
                <div
                  className={`flex flex-col gap-2 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  {msg.loading ? (
                    <div className="flex gap-1 py-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9aa0a6] animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9aa0a6] animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9aa0a6] animate-bounce" />
                    </div>
                  ) : (
                    <>
                      {msg.image && (
                        <div className="relative group rounded-2xl overflow-hidden border border-white/10">
                          <img
                            src={`data:image/png;base64,${msg.image}`}
                            alt="Generated"
                            className="w-full h-auto max-w-md display-block"
                          />
                          <a
                            href={`data:image/png;base64,${msg.image}`}
                            download="generated-art.png"
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md"
                          >
                            Save
                          </a>
                        </div>
                      )}
                      {msg.text && (
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-[#1e1f20] text-white"
                              : "text-[#e8eaed]"
                          }`}
                        >
                          {msg.text}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="shrink-0 px-4 pb-8 pt-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-3 bg-[#1e1f20] rounded-[28px] px-5 py-3 border border-white/5 focus-within:border-white/20 transition-all shadow-xl">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to see..."
              rows={1}
              className="flex-1 bg-transparent outline-none text-base text-white placeholder:text-[#5f6368] resize-none max-h-40 py-1"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-10 disabled:hover:scale-100"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#131314"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-[#5f6368] mt-3 tracking-wide">
            Powered by Gemini · Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
