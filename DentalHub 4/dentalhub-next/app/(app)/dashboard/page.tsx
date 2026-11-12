"use client";

import Link from "next/link";
import { useState } from "react";
import {
  EMPTY_NUMBERS,
  EMPTY_PROGRESS,
  EMPTY_STRINGS,
  STORAGE_KEYS,
  useLocalStorage,
} from "../../../lib/storage";

const pad = (n: number) => String(n).padStart(2, "0");

const weeklyActivity = [
  { day: "Mon", height: 42 },
  { day: "Tue", height: 68 },
  { day: "Wed", height: 34 },
  { day: "Thu", height: 86, active: true },
  { day: "Fri", height: 55 },
  { day: "Sat", height: 24 },
  { day: "Sun", height: 14 },
];

const dashboardCourses = [
  {
    name: "Dental Anatomy",
    artClass: "anatomy-art",
    tag: "FOUNDATIONS",
    number: "01",
    lessons: 6,
    blurb: "Explore tooth structure, form, and function.",
    progress: 65,
    trackClass: "",
    action: "Continue course",
  },
  {
    name: "Dental Radiology",
    artClass: "xray-art",
    tag: "CLINICAL SKILLS",
    number: "02",
    lessons: 8,
    blurb: "Learn to understand and interpret dental X-rays.",
    progress: 30,
    trackClass: "purple-track",
    action: "Continue course",
  },
  {
    name: "Oral Health Basics",
    artClass: "oral-art",
    tag: "CORE KNOWLEDGE",
    number: "03",
    lessons: 5,
    blurb: "Understand prevention, hygiene, and healthy habits.",
    progress: 10,
    trackClass: "orange-track",
    action: "Start course",
  },
];

function CourseArt({ kind, tag, number }: { kind: string; tag: string; number: string }) {
  return (
    <div className={`course-art ${kind}`}>
      <span className="art-tag">{tag}</span>
      {kind === "anatomy-art" && (
        <>
          <div className="anatomy-orbit"></div>
          <div className="anatomy-tooth">✦</div>
        </>
      )}
      {kind === "xray-art" && (
        <div className="xray-frame">
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <span key={k}>✣</span>
          ))}
        </div>
      )}
      {kind === "oral-art" && (
        <>
          <div className="oral-symbol">+</div>
          <div className="oral-circle"></div>
        </>
      )}
      <span className="art-number">{number}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [lessons] = useLocalStorage<string[]>(STORAGE_KEYS.lessons, EMPTY_STRINGS);
  const [bookmarks] = useLocalStorage<number[]>(STORAGE_KEYS.bookmarks, EMPTY_NUMBERS);
  const [progress] = useLocalStorage(STORAGE_KEYS.progress, EMPTY_PROGRESS);
  const [picked, setPicked] = useState<string | null>(null);

  const completedCases = Object.values(progress).filter(
    (entry) => entry && Array.isArray(entry.attempts) && entry.attempts.length,
  ).length;

  const stats = [
    { icon: "▤", iconClass: "teal-icon", caption: "LEARNING", value: 3, unit: "courses", bottom: "Your learning library", dot: "teal-dot" },
    { icon: "◷", iconClass: "purple-icon", caption: "LESSONS DONE", value: lessons.length, unit: "lessons", bottom: "Completed learning lessons" },
    { icon: "✳", iconClass: "orange-icon", caption: "PRACTICE", value: completedCases, unit: "cases", bottom: "Cases completed" },
    { icon: "♧", iconClass: "blue-icon", caption: "SAVED CASES", value: bookmarks.length, unit: "saved", bottom: "Your bookmarked cases", dot: "green-dot" },
  ];

  const answers = [
    { key: "A", label: "Enamel" },
    { key: "B", label: "Dentin" },
    { key: "C", label: "Pulp" },
  ];

  return (
    <div className="page-content dashboard-page">
      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            <span className="welcome-spark">✳</span> YOUR LEARNING SPACE
          </div>
          <h1>
            Let&apos;s make today <span>count.</span>
          </h1>
          <p className="welcome-subtitle">A little progress every day goes a long way.</p>
        </div>
        <Link className="primary-button start-button" href="/my-learning">
          Continue learning <span>→</span>
        </Link>
      </section>

      <section className="hero-banner">
        <div className="hero-copy">
          <span className="hero-pill">
            <span></span> YOUR NEXT CHAPTER
          </span>
          <h2>
            Knowledge today.
            <br />
            <span>Confidence tomorrow.</span>
          </h2>
          <p>Build your dental knowledge one lesson, one case, and one challenge at a time.</p>
          <Link className="hero-button" href="/my-learning">
            Explore your learning path <span>↗</span>
          </Link>
        </div>
        <div className="hero-graphic" aria-hidden="true">
          <div className="hero-ring ring-a"></div>
          <div className="hero-ring ring-b"></div>
          <div className="hero-cross cross-a">+</div>
          <div className="hero-cross cross-b">+</div>
          <div className="hero-tooth">✦</div>
          <div className="floating-note note-a">
            <span>↗</span> Keep it up!
          </div>
          <div className="floating-note note-b">
            <span>✓</span> Progress made
          </div>
        </div>
        <span className="hero-index">DH / 001</span>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.caption}>
            <div className="stat-top">
              <span className={`stat-icon ${stat.iconClass}`}>{stat.icon}</span>
              <span className="stat-caption">{stat.caption}</span>
            </div>
            <div className="stat-value">
              {pad(stat.value)} <span className="stat-unit">{stat.unit}</span>
            </div>
            <div className="stat-bottom">
              {stat.dot && <span className={`stat-dot ${stat.dot}`}></span>} {stat.bottom}
            </div>
          </article>
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span>
            <h2>Your learning path</h2>
          </div>
          <Link className="text-button" href="/my-learning">
            View all courses <span>→</span>
          </Link>
        </div>

        <div className="course-grid">
          {dashboardCourses.map((course) => {
            const href = `/my-learning/${encodeURIComponent(course.name)}`;
            return (
              <article className="course-card" key={course.name}>
                <CourseArt kind={course.artClass} tag={course.tag} number={course.number} />
                <div className="course-info">
                  <div className="course-meta">
                    <span>MODULE {course.number}</span>
                    <span>{course.lessons} LESSONS</span>
                  </div>
                  <h3>{course.name}</h3>
                  <p>{course.blurb}</p>
                  <div className="progress-row">
                    <span>Progress</span>
                    <strong>{course.progress}%</strong>
                  </div>
                  <div className={`progress-track ${course.trackClass}`}>
                    <span style={{ width: `${course.progress}%` }}></span>
                  </div>
                  <Link className="course-action" href={href}>
                    {course.action} <span>→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="lower-grid">
        <article className="challenge-card">
          <div className="section-heading compact-heading">
            <div>
              <span className="eyebrow">A LITTLE DAILY PRACTICE</span>
              <h2>Today&apos;s challenge</h2>
            </div>
            <span className="challenge-badge">5 MIN</span>
          </div>
          <div className="challenge-content">
            <div className="challenge-icon">✳</div>
            <div>
              <span className="question-label">QUICK KNOWLEDGE CHECK</span>
              <h3>Which part of the tooth forms its outermost layer?</h3>
              <p>Test your foundational dental anatomy knowledge.</p>
            </div>
          </div>
          <div className="answer-options">
            {answers.map((answer) => (
              <button
                key={answer.key}
                className={`answer-option ${
                  picked && answer.key === "A" ? "correct" : ""
                } ${picked === answer.key && answer.key !== "A" ? "incorrect" : ""}`}
                disabled={picked !== null}
                onClick={() => setPicked(answer.key)}
              >
                {answer.key} <span>{answer.label}</span>
              </button>
            ))}
          </div>
          <p className="challenge-feedback" role="status">
            {picked === "A" && "Correct! Enamel is the hard outermost layer of a tooth."}
            {picked && picked !== "A" && "Not quite. Enamel forms the tooth's outermost layer."}
          </p>
        </article>

        <article className="activity-card">
          <div className="section-heading compact-heading">
            <div>
              <span className="eyebrow">SHOWING UP MATTERS</span>
              <h2>Your activity</h2>
            </div>
            <span className="activity-period">This week</span>
          </div>
          <div className="activity-summary">
            <strong>
              4.5 <span>hrs</span>
            </strong>
            <span className="activity-change">Study time</span>
          </div>
          <div className="chart" aria-label="Illustrative weekly study activity">
            {weeklyActivity.map((bar) => (
              <div className="chart-column" key={bar.day}>
                <div
                  className={`chart-bar ${bar.active ? "active-bar" : ""}`}
                  style={{ height: `${bar.height}%` }}
                ></div>
                <span>{bar.day}</span>
              </div>
            ))}
          </div>
          <p className="chart-note">
            Demo activity · Your study habits can grow one session at a time.
          </p>
        </article>
      </section>

      <footer className="dashboard-footer">
        <span>© 2026 DentalHub</span>
        <span>
          BUILT FOR THE NEXT GENERATION OF DENTAL PROFESSIONALS <span className="footer-spark">✳</span>
        </span>
      </footer>
    </div>
  );
}
