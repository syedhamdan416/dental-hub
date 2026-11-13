"use client";

import { useState } from "react";
import ModuleHeader from "../../../components/ModuleHeader";
import { dailyQuestions } from "../../../lib/data/quizzes";
import { EMPTY_CHALLENGE, STORAGE_KEYS, useLocalStorage } from "../../../lib/storage";

export default function DailyChallengePage() {
  const [stored, setStored] = useLocalStorage(STORAGE_KEYS.challenge, EMPTY_CHALLENGE);
  const [finished, setFinished] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  // A new day starts a fresh challenge.
  const state = stored.date === today ? stored : { date: today, index: 0, answers: [] };
  const index = state.index ?? 0;
  const answers = state.answers ?? [];

  if (finished) {
    const score = answers.reduce<number>(
      (n, a, j) => n + (a === dailyQuestions[j]?.a ? 1 : 0),
      0,
    );
    return (
      <div className="page-content case-library-page">
        <ModuleHeader
          kicker="CHALLENGE COMPLETE"
          title="Well done."
          description="Today's challenge is complete. Come back tomorrow for a fresh reset."
        />
        <div className="module-panel">
          <h2>
            {score} / {dailyQuestions.length} correct
          </h2>
          <p>Your daily answers have been saved in this browser.</p>
          <button
            className="primary-button"
            onClick={() => {
              setStored({ ...state, index: 0 });
              setFinished(false);
            }}
          >
            Review answers
          </button>
        </div>
      </div>
    );
  }

  const q = dailyQuestions[index];
  const chosen = answers[index];
  const answered = chosen !== undefined && chosen !== null;
  const isLast = index === dailyQuestions.length - 1;
  const answeredCount = answers.filter((a) => a !== undefined && a !== null).length;

  function choose(n: number) {
    const next = Array.from({ length: dailyQuestions.length }, (_, i) => answers[i] ?? null);
    next[index] = n;
    setStored({ ...state, answers: next });
  }

  return (
    <div className="page-content case-library-page">
      <ModuleHeader
        kicker="DAILY KNOWLEDGE CHECK"
        title="Daily Challenge"
        description="Complete a short daily dental knowledge check. Your answers are saved locally for today."
      />
      <div className="module-panel">
        <div className="module-hero">
          <div>
            <span className="eyebrow">
              QUESTION {index + 1} OF {dailyQuestions.length}
            </span>
            <h2>{q.q}</h2>
            <p>One question at a time · Instant feedback</p>
          </div>
          <span className="challenge-badge">DAILY</span>
        </div>

        {q.o.map((option, n) => (
          <button
            key={option}
            className={`module-option ${answered && n === q.a ? "correct" : ""} ${
              answered && n === chosen && n !== q.a ? "incorrect" : ""
            }`}
            disabled={answered}
            onClick={() => choose(n)}
          >
            {String.fromCharCode(65 + n)}. {option}
          </button>
        ))}

        {answered && (
          <div className="module-output">
            <strong>{chosen === q.a ? "Correct!" : "Not quite."}</strong>
            <p>{q.e}</p>
            <button
              className="primary-button"
              onClick={() =>
                isLast ? setFinished(true) : setStored({ ...state, index: index + 1 })
              }
            >
              {isLast ? "Finish challenge" : "Next question →"}
            </button>
          </div>
        )}

        <p className="module-muted">
          {answeredCount} of {dailyQuestions.length} answered
        </p>
      </div>
    </div>
  );
}
