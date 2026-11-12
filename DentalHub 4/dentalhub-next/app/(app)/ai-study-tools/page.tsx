"use client";

import { useState } from "react";
import ModuleHeader from "../../../components/ModuleHeader";
import { useToast } from "../../../components/ToastProvider";

type Output = { summary: string[]; terms: string[]; cards: string[] };

function generate(raw: string): Output {
  const sentences = raw.split(/(?<=[.!?])\s+/).filter((x) => x.length > 25);
  const summary = sentences.slice(0, Math.min(5, sentences.length));
  const words = raw.toLowerCase().match(/[a-z][a-z-]{5,}/g) || [];
  const freq: Record<string, number> = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });
  const terms = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map((x) => x[0]);
  return { summary, terms, cards: summary.slice(0, 5) };
}

export default function AiStudyToolsPage() {
  const { showToast } = useToast();
  const [source, setSource] = useState("");
  const [output, setOutput] = useState<Output | null>(null);
  const [fileKey, setFileKey] = useState(0);

  async function handleFile(file: File | undefined) {
    if (file) setSource(await file.text());
  }

  function handleGenerate() {
    const raw = source.trim();
    if (raw.length < 80) {
      showToast("Add at least a few sentences of study material first.");
      return;
    }
    setOutput(generate(raw));
  }

  function handleClear() {
    setSource("");
    setOutput(null);
    setFileKey((k) => k + 1);
  }

  return (
    <div className="page-content case-library-page">
      <ModuleHeader
        kicker="SMART REVISION WORKSPACE"
        title="AI Study Tools"
        description="Turn your own study text into a concise revision outline and flashcards. This standalone build processes pasted or uploaded text locally; it is not connected to a live AI service."
      />
      <div className="module-panel">
        <h2>Bring your study material</h2>
        <div className="module-form">
          <label htmlFor="studyUpload">Upload a plain-text file (.txt)</label>
          <input
            key={fileKey}
            id="studyUpload"
            type="file"
            accept=".txt,text/plain"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <label htmlFor="studySource">Or paste your notes / learning material</label>
          <textarea
            id="studySource"
            placeholder="Paste your dental study material here…"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <div className="module-actions">
            <button className="primary-button" onClick={handleGenerate}>
              Generate revision tools →
            </button>
            <button className="secondary-button" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        {output && (
          <div className="module-output">
            <h2>Revision outline</h2>
            <ul>
              {output.summary.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h2>Key terms</h2>
            <p>{output.terms.join(" · ") || "No key terms detected"}</p>
            <h2>Flashcards</h2>
            {output.cards.map((card, i) => (
              <details key={card}>
                <summary>Card {i + 1}: What should you remember?</summary>
                <p>{card}</p>
              </details>
            ))}
            <p className="module-muted">
              Generated locally from your text using simple text-processing rules. Verify all study
              content against trusted course materials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
