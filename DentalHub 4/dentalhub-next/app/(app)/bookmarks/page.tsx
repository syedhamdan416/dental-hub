"use client";

import Link from "next/link";
import ModuleHeader from "../../../components/ModuleHeader";
import { caseData } from "../../../lib/data/cases";
import { EMPTY_NUMBERS, STORAGE_KEYS, useLocalStorage } from "../../../lib/storage";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useLocalStorage<number[]>(STORAGE_KEYS.bookmarks, EMPTY_NUMBERS);
  const saved = caseData.filter((c) => bookmarks.includes(c.id));

  return (
    <div className="page-content case-library-page">
      <ModuleHeader
        kicker="YOUR PERSONAL COLLECTION"
        title="Bookmarks"
        description="Keep useful clinical cases close and return to them whenever you need revision."
      />
      <div className="module-panel">
        <h2>Saved cases ({saved.length})</h2>
        {saved.length ? (
          <div className="module-list">
            {saved.map((c) => (
              <div className="module-list-item" key={c.id}>
                <div>
                  <h3>{c.title}</h3>
                  <p>
                    {c.category} · {c.difficulty} · {c.duration}
                  </p>
                </div>
                <div className="module-actions">
                  <button
                    className="secondary-button"
                    onClick={() => setBookmarks((prev) => prev.filter((x) => x !== c.id))}
                  >
                    Remove
                  </button>
                  <Link className="primary-button" href={`/case-library/${c.id}`}>
                    Open case
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="case-empty">
            <span>☆</span>
            <h3>No saved cases yet</h3>
            <p>Use the Save button on any Case Library card to add it here.</p>
            <Link className="primary-button" href="/case-library">
              Browse cases →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
