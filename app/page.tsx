"use client";
import { useRouter } from "next/navigation";

const FEATURES = [
  {
    href: "/models/image-gen",
    icon: "🎨",
    label: "Image Generation",
    description: "Turn a text prompt into a vivid AI-generated image.",
    disabled: false,
  },
  {
    href: "/models/chat",
    icon: "💬",
    label: "AI Chat",
    description: "Conversational AI with context and memory.",
    disabled: false,
  },
  {
    href: "#",
    icon: "📄",
    label: "Document Analysis",
    description: "Upload and query any PDF or document instantly.",
    disabled: true,
  },
];

export default function WelcomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#131314] text-white flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-5xl font-semibold tracking-tight mb-3 bg-gradient-to-r from-[#8ab4f8] via-[#c58af9] to-[#f48fb1] bg-clip-text text-transparent">
          Hello, there.
        </h1>
        <p className="text-[#9aa0a6] text-lg">Choose a tool to get started.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
        {FEATURES.map((f) => (
          <button
            key={f.label}
            onClick={() => !f.disabled && router.push(f.href)}
            disabled={f.disabled}
            className={`flex flex-col items-start gap-2 rounded-2xl p-5 text-left transition-colors
              ${
                f.disabled
                  ? "bg-[#1e1f20] opacity-40 cursor-not-allowed"
                  : "bg-[#1e1f20] hover:bg-[#28292a] cursor-pointer"
              }`}
          >
            <span className="text-2xl">{f.icon}</span>
            <span className="font-medium text-sm text-white">{f.label}</span>
            <span className="text-xs text-[#9aa0a6] leading-relaxed">
              {f.description}
            </span>
            {f.disabled && (
              <span className="text-[10px] text-[#5f6368] mt-1 uppercase tracking-wide">
                Coming soon
              </span>
            )}
          </button>
        ))}
      </div>

      <p className="mt-12 text-xs text-[#5f6368]">Powered by Gemini API</p>
    </main>
  );
}
