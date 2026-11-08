"use client";

import { FileText, NotebookPen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { draftTitle } from "@/lib/draft";
import { formatPeriod, formatUpdated } from "@/lib/format";
import type { DocKind, Draft } from "@/lib/types";

export function Desk({
  drafts,
  storageNote,
  onStart,
  onOpen,
  onDelete,
  onContinueAsReport,
}: {
  drafts: Draft[];
  storageNote: string | null;
  onStart: (kind: DocKind) => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onContinueAsReport: (id: string) => void;
}) {
  const ordered = [...drafts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.22em] text-muted-foreground">
            체험학습 서류
          </p>
          <h1 className="mt-1 font-heading text-4xl tracking-tight text-foreground">현장노트</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            현장체험학습 신청서와 보고서를 학교 양식에 맞춰 작성하고, 그대로 인쇄합니다.
            문서는 이 브라우저에만 저장됩니다.
          </p>
        </div>
      </header>

      {storageNote ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {storageNote}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onStart("application")}
          className="group flex flex-col items-start gap-3 rounded-2xl bg-card p-5 text-left ring-1 ring-foreground/10 transition hover:-translate-y-0.5 hover:ring-primary/40"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <FileText className="size-5" />
          </span>
          <span>
            <span className="block font-heading text-2xl">신청서 쓰기</span>
            <span className="mt-1 block text-sm leading-6 text-muted-foreground">
              체험을 가기 전에 학교와 보호자에게 내는 서류입니다. 기간, 장소, 일정, 준비물을 적습니다.
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => onStart("report")}
          className="group flex flex-col items-start gap-3 rounded-2xl bg-card p-5 text-left ring-1 ring-foreground/10 transition hover:-translate-y-0.5 hover:ring-primary/40"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-[oklch(0.45_0.12_28)] text-white">
            <NotebookPen className="size-5" />
          </span>
          <span>
            <span className="block font-heading text-2xl">보고서 쓰기</span>
            <span className="mt-1 block text-sm leading-6 text-muted-foreground">
              다녀온 뒤에 무엇을 했고, 무엇을 배웠는지 정리하는 서류입니다. 사진은 세 장까지 넣을 수 있습니다.
            </span>
          </span>
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        신청서를 먼저 쓰면, 같은 학생·장소·일정으로 보고서를 이어서 만들 수 있습니다.
      </p>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-heading text-xl">이 브라우저의 문서</h2>
          <p className="text-sm text-muted-foreground">{ordered.length}건</p>
        </div>
        {ordered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-foreground/15 bg-card/70 px-5 py-10 text-center">
            <p className="font-medium">아직 작성 중인 문서가 없습니다.</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              신청서나 보고서부터 시작하면 입력한 내용이 이 브라우저에 자동으로 남습니다. 다른 기기나 다른 브라우저에서는 보이지 않습니다.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {ordered.map((draft) => {
              const period = formatPeriod(draft.trip.startDate, draft.trip.endDate);
              return (
                <li
                  key={draft.id}
                  className="flex flex-col gap-3 rounded-2xl bg-card px-4 py-3 ring-1 ring-foreground/10 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={draft.kind === "application" ? "default" : "secondary"}>
                        {draft.kind === "application" ? "신청서" : "보고서"}
                      </Badge>
                      <p className="truncate font-medium">{draftTitle(draft)}</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[draft.student.name.trim() || "이름 없음", period || "날짜 없음", formatUpdated(draft.updatedAt)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button type="button" size="sm" onClick={() => onOpen(draft.id)}>
                      이어 쓰기
                    </Button>
                    {draft.kind === "application" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onContinueAsReport(draft.id)}
                      >
                        보고서로 이어 쓰기
                      </Button>
                    ) : null}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" size="icon-sm" variant="ghost" aria-label={`${draftTitle(draft)} 삭제`}>
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>이 문서를 삭제할까요?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {draftTitle(draft)}을 이 브라우저에서 지웁니다. 삭제한 내용은 되돌릴 수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction variant="destructive" onClick={() => onDelete(draft.id)}>
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export function DeskSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <div className="space-y-3">
        <div className="h-3 w-24 animate-pulse rounded bg-foreground/10" />
        <div className="h-10 w-40 animate-pulse rounded bg-foreground/10" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-foreground/10" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-40 animate-pulse rounded-2xl bg-card ring-1 ring-foreground/10" />
        <div className="h-40 animate-pulse rounded-2xl bg-card ring-1 ring-foreground/10" />
      </div>
    </div>
  );
}
