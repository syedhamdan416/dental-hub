"use client";

import { useState } from "react";
import ModuleHeader from "../../../components/ModuleHeader";
import { useToast } from "../../../components/ToastProvider";
import { useDisplayName } from "../../../lib/profile";
import { STORAGE_KEYS, TRUE_VALUE, useLocalStorage } from "../../../lib/storage";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [displayName, setDisplayName] = useDisplayName();
  const [hints, setHints] = useLocalStorage<boolean>(STORAGE_KEYS.hints, TRUE_VALUE);

  // Local form state, seeded from the saved values and committed on Save.
  const [draftName, setDraftName] = useState(displayName);
  const [draftHints, setDraftHints] = useState(hints);

  function save() {
    setHints(draftHints);
    const name = draftName.trim();
    if (name) setDisplayName(name);
    showToast("Preferences saved.");
  }

  return (
    <div className="page-content case-library-page">
      <ModuleHeader
        kicker="PREFERENCES"
        title="Settings"
        description="Manage simple display and local learning preferences."
      />
      <div className="module-panel">
        <h2>Learning preferences</h2>
        <div className="module-form">
          <label>
            <input
              type="checkbox"
              checked={draftHints}
              onChange={(e) => setDraftHints(e.target.checked)}
            />{" "}
            Show hints during case questions
          </label>
          <label htmlFor="settingName">Display name</label>
          <input
            id="settingName"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
          <button className="primary-button" onClick={save}>
            Save preferences
          </button>
        </div>
        <p className="module-muted">Preferences are stored locally in this browser.</p>
      </div>
    </div>
  );
}
