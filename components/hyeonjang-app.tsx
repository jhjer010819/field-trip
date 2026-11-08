"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Desk, DeskSkeleton } from "@/components/desk";
import { Editor } from "@/components/editor";
import {
  createEmptyDraft,
  draftTitle,
  reportFromApplication,
} from "@/lib/draft";
import { formatKoreanDate, todayIso } from "@/lib/format";
import {
  getDraftsSnapshot,
  getServerDraftsSnapshot,
  saveDrafts,
  subscribeDrafts,
} from "@/lib/storage";
import type { DocKind, Draft } from "@/lib/types";

const SAVE_NOTE = {
  quota: "저장 공간이 부족합니다. 사진을 지우면 다시 저장할 수 있습니다.",
  unavailable: "이 브라우저에는 문서를 저장할 수 없습니다. 인쇄하기 전에 내용을 확인해 주세요.",
} as const;

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function HyeonjangApp() {
  const mounted = useMounted();
  const stored = useSyncExternalStore(
    subscribeDrafts,
    getDraftsSnapshot,
    getServerDraftsSnapshot,
  );
  const [drafts, setDrafts] = useState<Draft[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [saveLabel, setSaveLabel] = useState("이 브라우저에 저장됩니다");
  const [storageNote, setStorageNote] = useState<string | null>(null);
  const pending = useRef<Draft[] | null>(null);
  const saveTimer = useRef<number | null>(null);
  const visible = drafts ?? stored;

  useEffect(() => {
    const flush = () => {
      if (pending.current) saveDrafts(pending.current);
    };
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
    };
  }, []);

  useEffect(() => {
    const active = visible.find((draft) => draft.id === activeId);
    document.title = active
      ? `${draftTitle(active)} · 현장노트`
      : "현장노트 — 체험학습 신청서·보고서";
  }, [activeId, visible]);

  function commit(next: Draft[]) {
    pending.current = next;
    setDrafts(next);
    if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      const result = saveDrafts(next);
      if (result.ok) {
        setSaveLabel("이 브라우저에 저장됨");
        setStorageNote(null);
      } else {
        setSaveLabel("저장하지 못함");
        setStorageNote(SAVE_NOTE[result.reason]);
      }
    }, 250);
  }

  function openDraft(id: string, nextStep = 1) {
    setActiveId(id);
    setStep(nextStep);
  }

  function start(kind: DocKind) {
    const draft = createEmptyDraft(kind);
    commit([draft, ...visible]);
    openDraft(draft.id, 1);
  }

  function updateActive(next: Draft) {
    commit(
      visible.map((draft) =>
        draft.id === next.id ? { ...next, updatedAt: new Date().toISOString() } : draft,
      ),
    );
  }

  function removeDraft(id: string) {
    commit(visible.filter((draft) => draft.id !== id));
    if (activeId === id) setActiveId(null);
  }

  function continueAsReport(id: string) {
    const source = visible.find((draft) => draft.id === id);
    if (!source) return;
    const report = reportFromApplication(source);
    commit([report, ...visible]);
    openDraft(report.id, 3);
  }

  if (!mounted) return <DeskSkeleton />;

  const active = visible.find((draft) => draft.id === activeId);
  const today = formatKoreanDate(todayIso());

  if (!active) {
    return (
      <Desk
        drafts={visible}
        storageNote={storageNote}
        onStart={start}
        onOpen={(id) => openDraft(id, 1)}
        onDelete={removeDraft}
        onContinueAsReport={continueAsReport}
      />
    );
  }

  return (
    <Editor
      key={active.id}
      draft={active}
      step={step}
      today={today}
      saveLabel={saveLabel}
      storageNote={storageNote}
      onStep={setStep}
      onChange={updateActive}
      onClose={() => setActiveId(null)}
      onContinueAsReport={() => continueAsReport(active.id)}
    />
  );
}
