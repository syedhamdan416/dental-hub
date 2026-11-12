"use client";

import Link from "next/link";
import { caseData } from "../../../lib/data/cases";
import { EMPTY_PROGRESS, STORAGE_KEYS, useLocalStorage } from "../../../lib/storage";

export default function MyProgressPage() {
  const [progress] = useLocalStorage(STORAGE_KEYS.progress, EMPTY_PROGRESS);

  const completed = Object.values(progress).filter(
    (entry) => entry && Array.isArray(entry.attempts) && entry.attempts.length,
  );
  const attempts = completed.flatMap((entry) => entry.attempts);
  const totalCorrect = attempts.reduce((sum, a) => sum + a.score, 0);
  const totalQuestions = attempts.reduce((sum, a) => sum + a.total, 0);
  const average = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const recent = completed
    .flatMap((entry) => {
      const item = caseData.find((c) => c.id === Number(entry.caseId));
      return item ? entry.attempts.map((a) => ({ title: item.title, ...a })) : [];
    })
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 12);

  return (
    <div className="page-content case-library-page">
      <div className="case-library-intro">
        <div>
          <span className="eyebrow">YOUR LEARNING JOURNEY</span>
          <h1>
            My Progress<span>.</span>
          </h1>
          <p>
            Track completed cases, revisit scores, and see how your clinical reasoning practice is
            developing.
          </p>
        </div>
        <div className="case-library-stat">
          <strong>{String(completed.length).padStart(2, "0")}</strong>
          <span>CASES COMPLETED</span>
        </div>
      </div>

      <div className="progress-summary-grid">
        <article className="progress-summary-card">
          <span>CASES COMPLETED</span>
          <strong>
            {completed.length}
            <small> / {caseData.length}</small>
          </strong>
          <p>Unique cases attempted</p>
        </article>
        <article className="progress-summary-card">
          <span>AVERAGE ACCURACY</span>
          <strong>{average}%</strong>
          <p>Across all saved attempts</p>
        </article>
        <article className="progress-summary-card">
          <span>TOTAL ATTEMPTS</span>
          <strong>{attempts.length}</strong>
          <p>Completed case sessions</p>
        </article>
      </div>

      <section className="progress-history-panel">
        <div className="progress-history-heading">
          <div>
            <h2>Completed cases</h2>
            <p>Your latest score is shown for each case.</p>
          </div>
          <Link className="secondary-button" href="/case-library">
            Explore Case Library
          </Link>
        </div>

        {completed.length ? (
          <div className="progress-case-list">
            {completed.map((entry) => {
              const item = caseData.find((c) => c.id === Number(entry.caseId));
              if (!item) return null;
              const latest = entry.attempts[entry.attempts.length - 1];
              return (
                <article className="progress-case-row" key={item.id}>
                  <div className={`progress-case-icon case-tint-${item.tint}`}>{item.icon}</div>
                  <div className="progress-case-info">
                    <h3>{item.title}</h3>
                    <p>
                      {entry.attempts.length} attempt{entry.attempts.length === 1 ? "" : "s"} · Last
                      completed {new Date(latest.completedAt).toLocaleDateString()}
                    </p>
                    <div className="progress-mini-track">
                      <span style={{ width: `${latest.percentage}%` }}></span>
                    </div>
                  </div>
                  <div className="progress-case-score">
                    <strong>{latest.percentage}%</strong>
                    <span>
                      {latest.score}/{latest.total} correct
                    </span>
                    <Link className="text-button" href={`/case-library/${item.id}`}>
                      Review case →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="case-empty">
            <span>↗</span>
            <h3>Your progress starts here</h3>
            <p>Complete a case to see your scores and review your previous attempts here.</p>
            <Link className="primary-button" href="/case-library">
              Browse cases →
            </Link>
          </div>
        )}
      </section>

      {attempts.length > 0 && (
        <section className="progress-history-panel attempt-history">
          <div className="progress-history-heading">
            <div>
              <h2>Recent attempts</h2>
              <p>Most recent completions first.</p>
            </div>
          </div>
          <div className="attempt-table-wrap">
            <table className="attempt-table">
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((a) => (
                  <tr key={`${a.title}-${a.completedAt}`}>
                    <td>{a.title}</td>
                    <td>{new Date(a.completedAt).toLocaleDateString()}</td>
                    <td>
                      {a.score}/{a.total} ({a.percentage}%)
                    </td>
                    <td>
                      <span
                        className={`difficulty-pill ${
                          a.percentage >= 67 ? "difficulty-beginner" : "difficulty-advanced"
                        }`}
                      >
                        {a.percentage >= 67 ? "Completed" : "Keep practising"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
