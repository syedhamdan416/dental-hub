"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import ModuleHeader from "../../../../components/ModuleHeader";
import { courses } from "../../../../lib/data/courses";
import { EMPTY_STRINGS, STORAGE_KEYS, useLocalStorage } from "../../../../lib/storage";

export default function CoursePage() {
  const params = useParams<{ course: string }>();
  const course = courses.find((c) => c.name === decodeURIComponent(params.course));
  const [completedLessons] = useLocalStorage<string[]>(STORAGE_KEYS.lessons, EMPTY_STRINGS);

  if (!course) notFound();

  return (
    <div className="page-content case-library-page">
      <Link className="case-back-button" href="/my-learning">
        ← All courses
      </Link>
      <ModuleHeader kicker="COURSE CONTENT" title={course.name} description={course.description} />

      <div className="module-panel">
        <h2>Lessons</h2>
        <div className="module-list">
          {course.lessons.map((lesson, i) => {
            const done = completedLessons.includes(`${course.name}::${lesson}`);
            return (
              <div className="module-list-item" key={lesson}>
                <div>
                  <h3>
                    {String(i + 1).padStart(2, "0")} · {lesson}
                  </h3>
                  <p>{done ? "Completed" : "Short reading lesson · Open to study"}</p>
                </div>
                <Link
                  className="primary-button"
                  href={`/my-learning/${encodeURIComponent(course.name)}/${i}`}
                >
                  {done ? "Review lesson" : "Open lesson"} →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
