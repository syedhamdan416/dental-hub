"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { caseData, type CaseItem } from "../../../../lib/data/cases";
import {
  EMPTY_PROGRESS,
  STORAGE_KEYS,
  TRUE_VALUE,
  useLocalStorage,
  type CaseProgress,
} from "../../../../lib/storage";

type Step = "overview" | "brief" | "question" | "results";

const DEFAULT_HINT =
  "Look for the option that best fits the history and clinical findings without making assumptions that the scenario cannot support.";

export default function CasePage() {
  const params = useParams<{ id: string }>();
  const item = caseData.find((c) => c.id === Number(params.id));
  if (!item) notFound();
  return <CasePlayer item={item} />;
}

function CasePlayer({ item }: { item: CaseItem }) {
  const [, setProgress] = useLocalStorage<CaseProgress>(STORAGE_KEYS.progress, EMPTY_PROGRESS);
  const [hintsEnabled] = useLocalStorage<boolean>(STORAGE_KEYS.hints, TRUE_VALUE);
  const [step, setStep] = useState<Step>("overview");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  const [hintVisible, setHintVisible] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const total = item.questions.length;
  const idLabel = String(item.id).padStart(2, "0");

  function restart() {
    setStep("overview");
    setCurrent(0);
    setAnswers([]);
    setHintVisible(false);
    setRecorded(false);
  }

  function goToQuestion(index: number) {
    setCurrent(index);
    setHintVisible(false);
    setStep("question");
  }

  function finish() {
    const score = item.questions.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0);
    if (!recorded) {
      const percentage = Math.round((score / total) * 100);
      setProgress((prev) => {
        const key = String(item.id);
        const existing = prev[key] ?? { caseId: item.id, attempts: [] };
        return {
          ...prev,
          [key]: {
            caseId: item.id,
            attempts: [
              ...existing.attempts,
              { score, total, percentage, completedAt: new Date().toISOString() },
            ].slice(-50),
          },
        };
      });
      setRecorded(true);
    }
    setStep("results");
  }

  if (step === "overview") {
    return (
      <div className="page-content case-library-page">
        <Link className="case-back-button" href="/case-library">
          ← Back to Case Library
        </Link>
        <div className="case-detail-heading">
          <div>
            <span className="eyebrow">CASE {idLabel} / CLINICAL REASONING</span>
            <h1>{item.title}</h1>
            <p>{item.summary}</p>
          </div>
          <span className={`difficulty-pill difficulty-${item.difficulty.toLowerCase()}`}>
            {item.difficulty}
          </span>
        </div>

        <div className="case-detail-layout">
          <div className="case-main-column">
            <section className="case-detail-panel">
              <div className="case-panel-heading">
                <span className="case-panel-icon">▤</span>
                <div>
                  <h2>Case overview</h2>
                  <p>Start by reviewing the learning goals.</p>
                </div>
              </div>
              <p>{item.summary}</p>
              <div className="case-objectives">
                <h3>Learning objectives</h3>
                {item.objectives.map((objective, index) => (
                  <div className="case-objective" key={objective}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {objective}
                  </div>
                ))}
              </div>
            </section>

            <section className="case-detail-panel">
              <div className="case-panel-heading">
                <span className="case-panel-icon">◷</span>
                <div>
                  <h2>What to expect</h2>
                  <p>A short, self-paced case activity</p>
                </div>
              </div>
              <div className="case-expect-grid">
                <div>
                  <span>ESTIMATED TIME</span>
                  <strong>{item.duration}</strong>
                </div>
                <div>
                  <span>QUESTIONS</span>
                  <strong>{total} questions</strong>
                </div>
                <div>
                  <span>FORMAT</span>
                  <strong>Multiple choice</strong>
                </div>
              </div>
            </section>
          </div>

          <aside className="case-start-panel">
            <div className={`case-start-art case-tint-${item.tint}`}>
              <span>{item.icon}</span>
            </div>
            <span className="eyebrow">READY WHEN YOU ARE</span>
            <h2>Let&apos;s work through it.</h2>
            <p>
              Read the patient information and findings carefully. You&apos;ll get feedback after each
              answer.
            </p>
            <button className="primary-button case-start-button" onClick={() => setStep("brief")}>
              Start case <span>→</span>
            </button>
            <div className="case-start-note">✓ Your progress is tracked for this session</div>
          </aside>
        </div>
        <p className="case-disclaimer">
          Illustrative educational scenario only. Not a substitute for professional clinical
          assessment.
        </p>
      </div>
    );
  }

  if (step === "brief") {
    return (
      <div className="page-content case-library-page">
        <button className="case-back-button" onClick={restart}>
          ← Back to case overview
        </button>
        <div className="case-player-top">
          <div>
            <span className="eyebrow">CASE {idLabel} / PATIENT BRIEF</span>
            <h1>Review the patient story</h1>
            <p>Take a moment to read the available information before answering.</p>
          </div>
          <span className="case-step-count">STEP 1 OF {total + 2}</span>
        </div>
        <div className="case-progress-track">
          <span style={{ width: "25%" }}></span>
        </div>
        <div className="patient-brief-grid">
          <div className="patient-story-card">
            <div className="patient-card-title">
              <span>01</span>
              <div>
                <h2>Presenting concern</h2>
                <p>Patient history</p>
              </div>
            </div>
            <p>{item.patient}</p>
            <div className="patient-card-title second">
              <span>02</span>
              <div>
                <h2>Relevant history</h2>
                <p>Background information</p>
              </div>
            </div>
            <p>{item.history}</p>
          </div>
          <div className="patient-findings-card">
            <div className="patient-card-title">
              <span>03</span>
              <div>
                <h2>Clinical findings</h2>
                <p>Scenario notes</p>
              </div>
            </div>
            <div className="finding-illustration">
              <div className="finding-cross">✳</div>
              <span>CASE FINDINGS</span>
              <small>EDUCATIONAL SUMMARY</small>
            </div>
            <p>{item.findings}</p>
            <div className="finding-reminder">
              ⓘ Use the information provided. In practice, findings would be confirmed through a
              full assessment.
            </div>
          </div>
        </div>
        <div className="case-player-actions">
          <span>Read everything? Continue when you&apos;re ready.</span>
          <button className="primary-button" onClick={() => goToQuestion(0)}>
            Answer questions <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  if (step === "question") {
    const question = item.questions[current];
    const chosen = answers[current];
    const hasAnswered = chosen !== undefined;
    const isCorrect = hasAnswered && chosen === question.correct;
    const progress = 25 + Math.round((current / total) * 65);

    return (
      <div className="page-content case-library-page">
        <button className="case-back-button" onClick={restart}>
          ← Exit to case overview
        </button>
        <div className="case-player-top">
          <div>
            <span className="eyebrow">{item.title.toUpperCase()}</span>
            <h1>Think it through.</h1>
            <p>Choose the best answer based on this teaching scenario.</p>
          </div>
          <span className="case-step-count">
            QUESTION {current + 1} OF {total}
          </span>
        </div>
        <div className="case-progress-track">
          <span style={{ width: `${progress}%` }}></span>
        </div>

        <section className="question-panel">
          <div className="question-panel-top">
            <span className="question-number">{String(current + 1).padStart(2, "0")}</span>
            <span className="question-type">KNOWLEDGE CHECK</span>
          </div>
          <h2>{question.prompt}</h2>
          <div className="case-answer-list">
            {question.options.map((option, index) => (
              <button
                key={option}
                className={`case-answer-option ${
                  hasAnswered && index === question.correct ? "answer-correct" : ""
                } ${hasAnswered && index === chosen && !isCorrect ? "answer-incorrect" : ""}`}
                disabled={hasAnswered}
                onClick={() =>
                  setAnswers((prev) => {
                    const next = [...prev];
                    next[current] = index;
                    return next;
                  })
                }
              >
                <span className="case-answer-letter">{String.fromCharCode(65 + index)}</span>
                <span>{option}</span>
                <span className="case-answer-mark">
                  {hasAnswered && index === question.correct
                    ? "✓"
                    : hasAnswered && index === chosen
                      ? "×"
                      : ""}
                </span>
              </button>
            ))}
          </div>

          {hintsEnabled && (
            <div className="case-hint-area">
              <button className="text-button" onClick={() => setHintVisible((v) => !v)}>
                {hintVisible ? "Hide hint ↑" : "Need a hint? Show hint →"}
              </button>
              <p className={`case-hint ${hintVisible ? "" : "hidden"}`}>
                {question.hint || DEFAULT_HINT}
              </p>
            </div>
          )}

          <div
            className={`case-answer-feedback ${
              hasAnswered ? (isCorrect ? "feedback-correct" : "feedback-incorrect") : "hidden"
            }`}
            role="status"
          >
            {hasAnswered && (
              <>
                <strong>{isCorrect ? "Correct — well done." : "Not quite. Review the explanation."}</strong>
                <p>{question.explanation}</p>
              </>
            )}
          </div>

          <div className="case-question-footer">
            <button
              className="secondary-button"
              disabled={current === 0}
              onClick={() => goToQuestion(current - 1)}
            >
              ← Previous
            </button>
            <span>
              {hasAnswered ? "Answer saved for this attempt." : "Select an answer to unlock the next step."}
            </span>
            <button
              className={`primary-button ${hasAnswered ? "" : "hidden"}`}
              onClick={() => (current === total - 1 ? finish() : goToQuestion(current + 1))}
            >
              {current === total - 1 ? "View results" : "Next question"} <span>→</span>
            </button>
          </div>

          <div className="question-jump-row">
            <span>JUMP TO</span>
            {item.questions.map((q, i) => (
              <button
                key={q.prompt}
                className={`question-jump ${i === current ? "current" : ""} ${
                  answers[i] !== undefined ? "answered" : ""
                }`}
                aria-label={`Go to question ${i + 1}`}
                onClick={() => goToQuestion(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // results
  const score = item.questions.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0);
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="page-content case-library-page">
      <div className="case-results-page">
        <div className="results-symbol">{percentage >= 67 ? "✓" : "↗"}</div>
        <span className="eyebrow">CASE COMPLETE</span>
        <h1>{percentage >= 67 ? "Nice work." : "Good effort."}</h1>
        <p className="results-subtitle">
          You&apos;ve completed <strong>{item.title}</strong>. Review the answers below to reinforce
          your learning.
        </p>
        <div className="results-score-card">
          <div>
            <span>YOUR SCORE</span>
            <strong>
              {score}
              <small> / {total}</small>
            </strong>
          </div>
          <div
            className="results-score-ring"
            style={{ "--score": `${percentage}%` } as React.CSSProperties}
          >
            <span>{percentage}%</span>
          </div>
        </div>
        <div className="results-review">
          <div className="results-review-heading">
            <h2>Answer review</h2>
            <span>
              {score} correct · {total - score} to revisit
            </span>
          </div>
          {item.questions.map((question, index) => {
            const correct = answers[index] === question.correct;
            const picked = answers[index];
            return (
              <article className="review-item" key={question.prompt}>
                <div className={`review-item-status ${correct ? "review-good" : "review-revisit"}`}>
                  {correct ? "✓" : "↻"}
                </div>
                <div>
                  <h3>
                    {index + 1}. {question.prompt}
                  </h3>
                  <p className="review-your-answer">
                    Your answer: {picked !== undefined ? question.options[picked] : "—"}
                  </p>
                  <p>{question.explanation}</p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="results-actions">
          <button className="secondary-button" onClick={restart}>
            ↻ Try again
          </button>
          <Link className="primary-button" href="/case-library">
            Back to Case Library <span>→</span>
          </Link>
        </div>
        <p className="case-disclaimer">
          Learning feedback is based on this simplified educational scenario and is not a clinical
          diagnosis.
        </p>
      </div>
    </div>
  );
}
