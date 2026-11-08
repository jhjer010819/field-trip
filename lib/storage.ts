import type { Draft } from "@/lib/types";

const STORAGE_KEY = "hyeonjang-note:drafts:v1";
const CHANGE_EVENT = "hyeonjang-note:drafts";
const EMPTY_DRAFTS: Draft[] = [];

let snapshotRaw: string | null = null;
let snapshotDrafts: Draft[] = EMPTY_DRAFTS;

function isDraft(value: unknown): value is Draft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<Draft>;
  return (
    typeof draft.id === "string" &&
    (draft.kind === "application" || draft.kind === "report") &&
    typeof draft.student === "object" &&
    typeof draft.trip === "object" &&
    Array.isArray(draft.schedule) &&
    typeof draft.application === "object" &&
    typeof draft.report === "object" &&
    Array.isArray(draft.report?.photos)
  );
}

function parseDrafts(raw: string | null): Draft[] {
  if (!raw) return EMPTY_DRAFTS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_DRAFTS;
    const drafts = parsed.filter(isDraft).map((draft) => ({
      ...draft,
      exampleNotice: Boolean(draft.exampleNotice),
    }));
    return drafts.length > 0 ? drafts : EMPTY_DRAFTS;
  } catch {
    return EMPTY_DRAFTS;
  }
}

export function subscribeDrafts(onStoreChange: () => void): () => void {
  const notify = () => onStoreChange();
  window.addEventListener(CHANGE_EVENT, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(CHANGE_EVENT, notify);
    window.removeEventListener("storage", notify);
  };
}

export function getDraftsSnapshot(): Draft[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === snapshotRaw) return snapshotDrafts;
    snapshotRaw = raw;
    snapshotDrafts = parseDrafts(raw);
    return snapshotDrafts;
  } catch {
    return EMPTY_DRAFTS;
  }
}

export function getServerDraftsSnapshot(): Draft[] {
  return EMPTY_DRAFTS;
}

export type SaveResult =
  | { ok: true }
  | { ok: false; reason: "quota" | "unavailable" };

export function saveDrafts(drafts: Draft[]): SaveResult {
  if (typeof window === "undefined") return { ok: false, reason: "unavailable" };
  try {
    const raw = JSON.stringify(drafts);
    window.localStorage.setItem(STORAGE_KEY, raw);
    snapshotRaw = raw;
    snapshotDrafts = drafts;
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return { ok: true };
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      return { ok: false, reason: "quota" };
    }
    return { ok: false, reason: "unavailable" };
  }
}
