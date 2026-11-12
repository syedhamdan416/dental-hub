"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// localStorage-backed state that is SSR-safe and stays in sync across
// components and tabs. Pass a module-level constant as `fallback`.

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    const value = JSON.parse(raw);
    return value === null ? fallback : (value as T);
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, fallback: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );

  const value = useMemo(() => parse(raw, fallback), [raw, fallback]);

  const setValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      const current = parse(readRaw(key), fallback);
      const resolved = typeof next === "function" ? (next as (p: T) => T)(current) : next;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        /* storage unavailable or full */
      }
      listeners.forEach((listener) => listener());
    },
    [key, fallback],
  );

  return [value, setValue] as const;
}

export const STORAGE_KEYS = {
  bookmarks: "dentalhub_bookmarks_v1",
  notes: "dentalhub_notes_v1",
  lessons: "dentalhub_lessons_v1",
  challenge: "dentalhub_daily_challenge_v1",
  progress: "dentalhub_case_progress_v1",
  hints: "dentalhub_hints",
  displayName: "dentalhub_display_name",
} as const;

export type Attempt = { score: number; total: number; percentage: number; completedAt: string };
export type CaseProgress = Record<string, { caseId: number; attempts: Attempt[] }>;
export type Note = { id: number; title: string; body: string; updated: string };
export type ChallengeState = { date?: string; index?: number; answers?: (number | null)[] };

export const EMPTY_NUMBERS: number[] = [];
export const EMPTY_STRINGS: string[] = [];
export const EMPTY_NOTES: Note[] = [];
export const EMPTY_PROGRESS: CaseProgress = {};
export const EMPTY_CHALLENGE: ChallengeState = {};
export const EMPTY_NAME = "";
export const TRUE_VALUE = true as boolean;
