"use client";

import { useState } from "react";
import ModuleHeader from "../../../components/ModuleHeader";
import { xrayQuestions } from "../../../lib/data/quizzes";

export default function XrayTrainerPage() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  const [finished, setFinished] = useState(false);

  function restart() {
    setIdx(0);
    setAnswers([]);
    setFinished(false);
  }

  if (finished) {
    const score = answers.filter((a, i) => a === xrayQuestions[i].a).length;
    return (
      <div className="page-content case-library-page">
        <ModuleHeader
          kicker="PRACTICE COMPLETE"
          title="Your X-Ray Trainer result"
          description="Review your performance and practise again when ready."
        />
        <div className="module-panel">
          <h2>
            {score} / {xrayQuestions.length} correct (
            {Math.round((score / xrayQuestions.length) * 100)}%)
          </h2>
          <p>
            {score === xrayQuestions.length
              ? "Excellent work."
              : "Keep practising the image interpretation fundamentals."}
          </p>
          <button className="primary-button" onClick={restart}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  const q = xrayQuestions[idx];
  const chosen = answers[idx];
  const answered = chosen !== undefined;
  const isLast = idx === xrayQuestions.length - 1;

  return (
    <div className="page-content case-library-page">
      <ModuleHeader
        kicker="RADIOGRAPHIC PRACTICE"
        title="X-Ray Trainer"
        description="Practice foundational radiographic reasoning with short image-interpretation knowledge checks."
      />
      <div className="module-panel">
        <div className="module-hero">
          <div>
            <span className="eyebrow">TRAINING SET · {xrayQuestions.length} QUESTIONS</span>
            <h2>Read the image description carefully.</h2>
            <p>This version uses written radiographic scenarios. It does not diagnose real X-rays.</p>
          </div>
          <span className="difficulty-pill difficulty-intermediate">Practice</span>
        </div>

        <p className="module-muted">
          QUESTION {idx + 1} OF {xrayQuestions.length}
        </p>
        <h2>{q.q}</h2>
        {q.opts.map((option, i) => (
          <button
            key={option}
            className={`module-option ${answered && i === q.a ? "correct" : ""} ${
              answered && i === chosen && chosen !== q.a ? "incorrect" : ""
            }`}
            disabled={answered}
            onClick={() =>
              setAnswers((prev) => {
                const next = [...prev];
                next[idx] = i;
                return next;
              })
            }
          >
            {String.fromCharCode(65 + i)}. {option}
          </button>
        ))}
        {answered && (
          <div className="module-output">
            <strong>{chosen === q.a ? "Correct" : "Review this concept"}</strong>
            <p>{q.why}</p>
            <button
              className="primary-button"
              onClick={() => (isLast ? setFinished(true) : setIdx(idx + 1))}
            >
              {isLast ? "Finish practice" : "Next question →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
