"use client";

import { useState } from "react";
import ModuleHeader from "../../../components/ModuleHeader";
import { useToast } from "../../../components/ToastProvider";
import { EMPTY_NOTES, STORAGE_KEYS, useLocalStorage, type Note } from "../../../lib/storage";

export default function StudyNotesPage() {
  const { showToast } = useToast();
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEYS.notes, EMPTY_NOTES);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState<number | null>(null);

  function reset() {
    setTitle("");
    setBody("");
    setEditing(null);
  }

  function save() {
    if (!title.trim() || !body.trim()) {
      showToast("Enter both a title and note content.");
      return;
    }
    const now = new Date().toISOString();
    if (editing !== null) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editing ? { ...n, title: title.trim(), body: body.trim(), updated: now } : n,
        ),
      );
    } else {
      setNotes((prev) => [
        ...prev,
        { id: Date.now(), title: title.trim(), body: body.trim(), updated: now },
      ]);
    }
    reset();
    showToast("Note saved.");
  }

  function edit(note: Note) {
    setEditing(note.id);
    setTitle(note.title);
    setBody(note.body);
  }

  function remove(id: number) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (editing === id) reset();
    showToast("Note deleted.");
  }

  return (
    <div className="page-content case-library-page">
      <ModuleHeader
        kicker="PERSONAL REVISION SPACE"
        title="Study Notes"
        description="Create, edit and delete your own study notes. Notes are saved in this browser on this device."
      />

      <div className="module-panel">
        <h2>{editing !== null ? "Edit note" : "Create a note"}</h2>
        <div className="module-form">
          <input
            placeholder="Note title"
            maxLength={90}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your key points, questions or reminders…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="module-actions">
            <button className="primary-button" onClick={save}>
              {editing !== null ? "Update note" : "Save note"}
            </button>
            {editing !== null && (
              <button className="secondary-button" onClick={reset}>
                Cancel edit
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="module-panel">
        <h2>Your notes ({notes.length})</h2>
        <div className="module-list">
          {notes.length ? (
            notes
              .slice()
              .reverse()
              .map((n) => (
                <div className="module-list-item" key={n.id}>
                  <div>
                    <h3>{n.title}</h3>
                    <p style={{ whiteSpace: "pre-wrap" }}>{n.body}</p>
                    <span className="module-muted">
                      Updated {new Date(n.updated).toLocaleString()}
                    </span>
                  </div>
                  <div className="module-actions">
                    <button className="secondary-button" onClick={() => edit(n)}>
                      Edit
                    </button>
                    <button className="secondary-button" onClick={() => remove(n.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p className="module-muted">No notes yet. Create your first note above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
