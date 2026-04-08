"use client";

import { useState } from "react";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setImageBase64(null);
    setText(null);

    const res = await fetch("/api/img", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    if (data.image) setImageBase64(data.image);
    if (data.text) setText(data.text);
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your image prompt..."
      />
      <button
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={handleGenerate}
        disabled={loading || !prompt}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {text && <p className="mt-4 text-gray-700">{text}</p>}
      {imageBase64 && (
        <img
          src={`data:image/png;base64,${imageBase64}`}
          alt="Generated"
          className="mt-4 rounded shadow"
        />
      )}
    </div>
  );
}
