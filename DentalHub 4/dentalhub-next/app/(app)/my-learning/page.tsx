"use client";

import Link from "next/link";
import ModuleHeader from "../../../components/ModuleHeader";
import { courses } from "../../../lib/data/courses";
import { EMPTY_STRINGS, STORAGE_KEYS, useLocalStorage } from "../../../lib/storage";

export default function MyLearningPage() {
  const [completedLessons] = useLocalStorage<string[]>(STORAGE_KEYS.lessons, EMPTY_STRINGS);
  const total = courses.reduce((n, c) => n + c.lessons.length, 0);
  const done = completedLessons.length;

  return (
    <div className="page-content case-library-page">
      <ModuleHeader
        kicker="YOUR CURRICULUM"
        title="My Learning"
        description="Continue structured dental learning. Open a course to view lessons and mark each lesson complete."
      />

      <div className="progress-summary-grid">
        <article className="progress-summary-card">
          <span>COURSES</span>
          <strong>03</strong>
          <p>Available learning paths</p>
        </article>
        <article className="progress-summary-card">
          <span>LESSONS COMPLETED</span>
          <strong>{done}</strong>
          <p>Out of {total} lessons</p>
        </article>
        <article className="progress-summary-card">
          <span>OVERALL COMPLETION</span>
          <strong>{Math.round((done / total) * 100)}%</strong>
          <p>Saved on this device</p>
        </article>
      </div>

      <div className="module-grid">
        {courses.map((course) => {
          const count = course.lessons.filter((l) =>
            completedLessons.includes(`${course.name}::${l}`),
          ).length;
          return (
            <article className="module-card" key={course.name}>
              <span className="eyebrow">{course.topic.toUpperCase()}</span>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <div className="progress-mini-track">
                <span style={{ width: `${(count / course.lessons.length) * 100}%` }}></span>
              </div>
              <p>
                {count} of {course.lessons.length} lessons complete
              </p>
              <Link
                className="primary-button"
                href={`/my-learning/${encodeURIComponent(course.name)}`}
              >
                Open course →
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
