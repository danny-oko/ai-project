"use client";

import { useEffect, useState } from "react";

const Genai = () => {
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/genai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: "Why is the sky blue?" }),
        });
        const data = await res.json();
        console.log(data);
        setAnswer(data.answer);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container">
      <h1>{loading ? "Loading..." : answer}</h1>
    </div>
  );
};

export default Genai;
