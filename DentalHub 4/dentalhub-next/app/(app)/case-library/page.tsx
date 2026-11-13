"use client";

import Link from "next/link";
import { useState } from "react";
import { caseData } from "../../../lib/data/cases";
import { EMPTY_NUMBERS, STORAGE_KEYS, useLocalStorage } from "../../../lib/storage";

const categories = ["All cases", ...new Set(caseData.map((item) => item.category))];
const difficulties = ["All levels", "Beginner", "Intermediate", "Advanced"];

export default function CaseLibraryPage() {
  const [bookmarks, setBookmarks] = useLocalStorage<number[]>(STORAGE_KEYS.bookmarks, EMPTY_NUMBERS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All cases");
  const [difficulty, setDifficulty] = useState("All levels");

  const filtered = caseData.filter((item) => {
    const text = `${item.title} ${item.category} ${item.summary} ${item.difficulty}`.toLowerCase();
    return (
      text.includes(search.toLowerCase()) &&
      (category === "All cases" || item.category === category) &&
      (difficulty === "All levels" || item.difficulty === difficulty)
    );
  });

  function toggleBookmark(id: number) {
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function resetFilters() {
    setSearch("");
    setCategory("All cases");
    setDifficulty("All levels");
  }

  return (
    <div className="page-content case-library-page">
      <div className="case-library-intro">
        <div>
          <span className="eyebrow">LEARN THROUGH CLINICAL REASONING</span>
          <h1>
            Case Library<span>.</span>
          </h1>
          <p>
            Work through realistic teaching scenarios, test your thinking, and learn from each
            explanation.
          </p>
        </div>
        <div className="case-library-stat">
          <strong>{String(caseData.length).padStart(2, "0")}</strong>
          <span>LEARNING CASES</span>
        </div>
      </div>

      <section className="case-library-banner">
        <div>
          <span className="case-banner-label">YOUR NEXT STEP</span>
          <h2>Think like a clinician.</h2>
          <p>
            Review the patient story, study the findings, and choose the best answer. Each case
            includes explanations to support your learning.
          </p>
        </div>
        <div className="case-banner-mark" aria-hidden="true">
          ✳
        </div>
      </section>

      <div className="case-library-toolbar">
        <div className="case-search-wrap">
          <span>⌕</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cases, topics, or categories"
            aria-label="Search cases"
          />
        </div>
        <label className="case-filter-label">
          CATEGORY
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label className="case-filter-label">
          DIFFICULTY
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            {difficulties.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="case-results-heading">
        <div>
          <h2>Explore cases</h2>
          <p>
            {filtered.length} {filtered.length === 1 ? "case" : "cases"} match your filters
          </p>
        </div>
        <span className="case-results-note">Educational scenarios · Frontend demo</span>
      </div>

      <div className="case-library-grid">
        {filtered.map((item) => (
          <article className="case-library-card" key={item.id}>
            <div className={`case-card-art case-tint-${item.tint}`}>
              <span className="case-art-eyebrow">
                CLINICAL CASE / {String(item.id).padStart(2, "0")}
              </span>
              <span className="case-art-symbol">{item.icon}</span>
              <span className="case-art-foot">DENTALHUB CASE FILE</span>
            </div>
            <div className="case-card-body">
              <div className="case-card-meta">
                <span className="case-category-pill">{item.category}</span>
                <span className="case-time">◷ {item.duration}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <div className="case-card-bottom">
                <span className={`difficulty-pill difficulty-${item.difficulty.toLowerCase()}`}>
                  {item.difficulty}
                </span>
                <div className="module-actions">
                  <button
                    className="secondary-button bookmark-toggle"
                    onClick={() => toggleBookmark(item.id)}
                  >
                    {bookmarks.includes(item.id) ? "★ Saved" : "☆ Save"}
                  </button>
                  <Link className="case-open-button" href={`/case-library/${item.id}`}>
                    Explore case <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="case-empty">
          <span>⌕</span>
          <h3>No cases found</h3>
          <p>Try a different search term or reset your filters.</p>
          <button className="primary-button" onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      )}

      <p className="case-disclaimer">
        These are illustrative educational scenarios, not real patient records or clinical advice.
        Clinical decisions should be made by qualified professionals using a complete assessment.
      </p>
    </div>
  );
}
