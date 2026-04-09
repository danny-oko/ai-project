"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function page() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea height
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [question]);

  const askQuestion = async () => {
    if (!question.trim() || loading) return;

    const userMessage = question.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "Sorry, I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch answer:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
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
        <span className="text-sm font-medium text-[#9aa0a6]">Food analyst</span>
        <div className="w-16" />
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-4 text-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-2">
                What would you like to know about food?
              </h2>

              <p className="text-[#9aa0a6] text-sm">
                Ask about recipes, nutrition, ingredients, or meal ideas.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-xl">
              {[
                "High protein meal ideas for muscle gain",
                "What can I cook with chicken and rice?",
                "Best foods to eat for gut health",
                "Explain macros in simple terms",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setQuestion(s)}
                  className="text-xs text-[#9aa0a6] bg-[#1e1f20] hover:bg-[#28292a] border border-white/10 rounded-full px-4 py-2 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                    msg.role === "user"
                      ? "bg-[#3c4043] text-white"
                      : "bg-gradient-to-br from-[#8ab4f8] to-[#c58af9] text-[#131314]"
                  }`}
                >
                  {msg.role === "user" ? "U" : "AI"}
                </div>
                <div
                  className={`flex flex-col gap-2 max-w-[80%] ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-[#1e1f20] text-white"
                        : "text-[#e8eaed]"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
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
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 px-4 pb-8 pt-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-end gap-2 bg-[#1e1f20] rounded-3xl px-4 py-3 border border-white/10 ring-1 ring-transparent focus-within:ring-white/20 focus-within:border-white/20 transition-all duration-200 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.4)]">
            <Textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              disabled={loading}
              className="flex-1 bg-transparent border-0 shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] text-white placeholder:text-white/25 resize-none max-h-40 py-1 px-1 leading-relaxed disabled:opacity-50"
            />
            <Button
              onClick={askQuestion}
              disabled={!question.trim() || loading}
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
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </Button>
          </div>
          <p className="text-center text-[10px] text-white/20 mt-3 tracking-widest uppercase">
            Powered by Gemini · Your Personal Food Expert
          </p>
        </div>
      </div>
    </div>
  );
}
