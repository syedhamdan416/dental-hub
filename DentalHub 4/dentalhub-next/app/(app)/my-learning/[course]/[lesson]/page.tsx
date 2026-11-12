"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import ModuleHeader from "../../../../../components/ModuleHeader";
import { useToast } from "../../../../../components/ToastProvider";
import { courses, lessonReadings } from "../../../../../lib/data/courses";
import { EMPTY_STRINGS, STORAGE_KEYS, useLocalStorage } from "../../../../../lib/storage";

export default function LessonPage() {
  const params = useParams<{ course: string; lesson: string }>();
  const { showToast } = useToast();
  const [completedLessons, setCompletedLessons] = useLocalStorage<string[]>(
    STORAGE_KEYS.lessons,
    EMPTY_STRINGS,
  );

  const courseName = decodeURIComponent(params.course);
  const course = courses.find((c) => c.name === courseName);
  const index = Number(params.lesson);
  const lesson = course?.lessons[index];

  if (!course || !lesson) notFound();

  const key = `${course.name}::${lesson}`;
  const done = completedLessons.includes(key);
  const courseHref = `/my-learning/${encodeURIComponent(course.name)}`;

  function markDone() {
    if (!done) setCompletedLessons((prev) => [...prev, key]);
    showToast("Lesson completion saved.");
  }

  return (
    <div className="page-content case-library-page">
      <Link className="case-back-button" href={courseHref}>
        ← Back to {course.name}
      </Link>
      <ModuleHeader
        kicker={`LESSON ${String(index + 1).padStart(2, "0")}`}
        title={lesson}
        description={course.name}
      />

      <article className="module-panel">
        <h2>Key concepts</h2>
        <p>
          {lessonReadings[lesson] ||
            "Review this topic and note the key terms relevant to your course."}
        </p>
        <div className="module-output">
          <strong>Quick reflection</strong>
          <p>Write down one important point from this lesson in your Study Notes before moving on.</p>
          <Link className="secondary-button" href="/study-notes">
            Open Study Notes →
          </Link>
        </div>
        <div className="module-actions" style={{ marginTop: 18 }}>
          <button className="primary-button" onClick={markDone}>
            {done ? "Completed ✓" : "Mark lesson complete"}
          </button>
          {index < course.lessons.length - 1 && (
            <Link className="secondary-button" href={`${courseHref}/${index + 1}`}>
              Next lesson →
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
