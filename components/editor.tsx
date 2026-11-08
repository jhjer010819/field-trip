"use client";

import { useRef, useState, type ReactNode, type RefObject } from "react";
import { ArrowLeft, ImagePlus, Plus, Printer, Trash2 } from "lucide-react";

import { DocumentSheet } from "@/components/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  STEP_IDS,
  allIssues,
  createId,
  draftHasContent,
  draftTitle,
  requiredIssues,
  stepMeta,
} from "@/lib/draft";
import { compressImage } from "@/lib/images";
import { applySample, type SampleId } from "@/lib/samples";
import type { Draft, ScheduleRow } from "@/lib/types";

const GRADES = ["1", "2", "3", "4", "5", "6"];
const RELATIONS = ["부", "모", "조부", "조모", "형제·자매", "기타"];
const TRANSPORTS = ["도보", "지하철", "시내버스", "전세버스", "자가용", "기차", "기타"];
const MAX_ROWS = 12;
const MAX_PHOTOS = 3;

const fieldClass = "h-10 bg-white";

export function Editor({
  draft,
  step,
  today,
  saveLabel,
  storageNote,
  onStep,
  onChange,
  onClose,
  onContinueAsReport,
}: {
  draft: Draft;
  step: number;
  today: string;
  saveLabel: string;
  storageNote: string | null;
  onStep: (step: number) => void;
  onChange: (draft: Draft) => void;
  onClose: () => void;
  onContinueAsReport: () => void;
}) {
  const [showErrors, setShowErrors] = useState(false);
  const [peek, setPeek] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [sampleOpen, setSampleOpen] = useState(false);
  const [pendingSample, setPendingSample] = useState<SampleId>("museum");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const meta = stepMeta(draft.kind);
  const current = meta[step] ?? meta[0];
  const last = STEP_IDS.length - 1;

  function go(nextStep: number) {
    const clamped = Math.min(last, Math.max(0, nextStep));
    setShowErrors(false);
    setPeek(false);
    onStep(clamped);
    queueMicrotask(() => headingRef.current?.focus());
  }

  function next() {
    const stepId = STEP_IDS[step];
    if (requiredIssues(draft, stepId).length > 0) {
      setShowErrors(true);
      return;
    }
    go(step + 1);
  }

  function requestSample(sample: SampleId) {
    if (draftHasContent(draft)) {
      setPendingSample(sample);
      setSampleOpen(true);
      return;
    }
    onChange(applySample(draft, sample));
  }

  const showSidePreview = step !== last;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-8">
      <header className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft />
            문서 목록
          </Button>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{draftTitle(draft)}</p>
            <p className="text-xs text-muted-foreground" role="status">
              {saveLabel}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => requestSample("museum")}>
            박물관 예시
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => requestSample("park")}>
            한강 예시
          </Button>
          <Button type="button" size="sm" onClick={() => window.print()}>
            <Printer />
            인쇄
          </Button>
        </div>
      </header>

      {storageNote ? (
        <p className="no-print rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {storageNote}
        </p>
      ) : null}

      {draft.exampleNotice ? (
        <div className="no-print flex flex-col gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>예시로 채워 두었습니다. 학교, 이름, 연락처는 실제 정보로 바꿔 주세요.</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange({ ...draft, exampleNotice: false })}
          >
            확인
          </Button>
        </div>
      ) : null}

      <div
        className={`grid items-start gap-6 ${
          showSidePreview
            ? "xl:grid-cols-[200px_minmax(0,1fr)_minmax(320px,0.86fr)]"
            : "xl:grid-cols-[200px_minmax(0,1fr)]"
        }`}
      >
        <nav className="no-print xl:sticky xl:top-4" aria-label="작성 단계">
          <ol className="flex gap-2 overflow-x-auto xl:flex-col">
            {meta.map((item, index) => {
              const active = index === step;
              return (
                <li key={item.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => go(index)}
                    aria-current={active ? "step" : undefined}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-left text-sm xl:w-full xl:rounded-lg xl:px-3 xl:py-2 ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-foreground ring-1 ring-foreground/10 hover:bg-accent"
                    }`}
                  >
                    <span className="font-medium tabular-nums">{index + 1}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <section className="no-print flex min-w-0 flex-col gap-5 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:p-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              {step + 1} / {meta.length}
            </p>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="mt-1 font-heading text-3xl tracking-tight outline-none"
            >
              {current.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{current.description}</p>
          </div>

          {step === 0 ? <KindStep draft={draft} onChange={onChange} /> : null}
          {step === 1 ? (
            <StudentStep draft={draft} showErrors={showErrors} onChange={onChange} />
          ) : null}
          {step === 2 ? (
            <TripStep draft={draft} showErrors={showErrors} onChange={onChange} />
          ) : null}
          {step === 3 ? (
            <ContentStep
              draft={draft}
              showErrors={showErrors}
              photoError={photoError}
              fileRef={fileRef}
              onPhotoError={setPhotoError}
              onChange={onChange}
            />
          ) : null}
          {step === 4 ? (
            <PreviewStep
              draft={draft}
              today={today}
              onContinueAsReport={onContinueAsReport}
              onJump={go}
            />
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <Button type="button" variant="outline" className="h-10 px-4" onClick={() => go(step - 1)} disabled={step === 0}>
              이전
            </Button>
            {step < last ? (
              <Button type="button" className="h-10 px-4" onClick={next}>
                다음
              </Button>
            ) : (
              <Button type="button" className="h-10 px-4" onClick={() => window.print()}>
                <Printer />
                이 양식 인쇄
              </Button>
            )}
          </div>
        </section>

        {showSidePreview ? (
          <aside className="no-print sticky top-4 hidden xl:block">
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">양식 미리보기</p>
            <div className="sheet-fit max-h-[calc(100vh-6rem)] overflow-auto rounded-2xl bg-[oklch(0.86_0.02_80)] p-3">
              <DocumentSheet draft={draft} today={today} />
            </div>
          </aside>
        ) : null}
      </div>

      {showSidePreview ? (
        <div className="no-print xl:hidden">
          <Button type="button" variant="outline" className="h-10" onClick={() => setPeek((value) => !value)}>
            {peek ? "미리보기 접기" : "양식 미리보기"}
          </Button>
          {peek ? (
            <div className="sheet-fit mt-3 overflow-auto rounded-2xl bg-[oklch(0.86_0.02_80)] p-3">
              <DocumentSheet draft={draft} today={today} />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="only-print">
        <DocumentSheet draft={draft} today={today} />
      </div>

      <AlertDialog open={sampleOpen} onOpenChange={setSampleOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>예시에 있는 내용으로 바꿀까요?</AlertDialogTitle>
            <AlertDialogDescription>
              지금 적은 학생 정보, 장소, 일정, 본문이 예시 문장으로 바뀝니다. 사진은 지워집니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onChange(applySample(draft, pendingSample));
                setSampleOpen(false);
              }}
            >
              예시로 채우기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function KindStep({
  draft,
  onChange,
}: {
  draft: Draft;
  onChange: (draft: Draft) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <KindCard
        selected={draft.kind === "application"}
        title="신청서"
        body="체험을 가기 전에 제출합니다. 일정과 준비물이 본문입니다."
        onClick={() => onChange({ ...draft, kind: "application" })}
      />
      <KindCard
        selected={draft.kind === "report"}
        title="보고서"
        body="다녀온 뒤에 제출합니다. 내용, 배운 점, 느낀 점을 적습니다."
        onClick={() => onChange({ ...draft, kind: "report" })}
      />
    </div>
  );
}

function KindCard({
  selected,
  title,
  body,
  onClick,
}: {
  selected: boolean;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary"
          : "border-border bg-white hover:border-primary/40"
      }`}
    >
      <span className="font-heading text-xl">{title}</span>
      <span className="mt-1 block text-sm leading-6 text-muted-foreground">{body}</span>
    </button>
  );
}

function StudentStep({
  draft,
  showErrors,
  onChange,
}: {
  draft: Draft;
  showErrors: boolean;
  onChange: (draft: Draft) => void;
}) {
  const student = draft.student;
  function patch(partial: Partial<Draft["student"]>) {
    onChange({ ...draft, student: { ...student, ...partial } });
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="학교" htmlFor="school" error={showErrors && !student.school.trim() ? "학교 이름을 적어 주세요." : undefined}>
        <Input id="school" className={fieldClass} value={student.school} placeholder="하늘초등학교" onChange={(event) => patch({ school: event.target.value })} />
      </Field>
      <Field label="학년" error={showErrors && !student.grade ? "학년을 선택해 주세요." : undefined}>
        <Select value={student.grade || undefined} onValueChange={(grade) => patch({ grade })}>
          <SelectTrigger className={`${fieldClass} w-full`} aria-label="학년">
            <SelectValue placeholder="학년 선택" />
          </SelectTrigger>
          <SelectContent>
            {GRADES.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}학년
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="반" htmlFor="className" hint="숫자만 적어도 됩니다.">
        <Input id="className" className={fieldClass} value={student.className} placeholder="2" onChange={(event) => patch({ className: event.target.value })} />
      </Field>
      <Field label="번호" htmlFor="number">
        <Input id="number" className={fieldClass} inputMode="numeric" value={student.number} placeholder="15" onChange={(event) => patch({ number: event.target.value })} />
      </Field>
      <Field label="학생 이름" htmlFor="name" error={showErrors && !student.name.trim() ? "학생 이름을 적어 주세요." : undefined}>
        <Input id="name" className={fieldClass} value={student.name} placeholder="한결" onChange={(event) => patch({ name: event.target.value })} />
      </Field>
      <Field label="담임 선생님" htmlFor="teacher">
        <Input id="teacher" className={fieldClass} value={student.teacher} placeholder="이수진" onChange={(event) => patch({ teacher: event.target.value })} />
      </Field>
    </div>
  );
}

function TripStep({
  draft,
  showErrors,
  onChange,
}: {
  draft: Draft;
  showErrors: boolean;
  onChange: (draft: Draft) => void;
}) {
  const trip = draft.trip;
  function patch(partial: Partial<Draft["trip"]>) {
    onChange({ ...draft, trip: { ...trip, ...partial } });
  }
  const dateOrder =
    showErrors && trip.startDate && trip.endDate && trip.endDate < trip.startDate;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="주제" htmlFor="topic" hint="비워 두면 장소 이름을 제목으로 씁니다." className="sm:col-span-2">
        <Input id="topic" className={fieldClass} value={trip.topic} placeholder="삼국시대 유물 관찰" onChange={(event) => patch({ topic: event.target.value })} />
      </Field>
      <Field label="장소" htmlFor="place" error={showErrors && !trip.place.trim() ? "체험 장소를 적어 주세요." : undefined}>
        <Input id="place" className={fieldClass} value={trip.place} placeholder="국립중앙박물관" onChange={(event) => patch({ place: event.target.value })} />
      </Field>
      <Field label="주소" htmlFor="address">
        <Input id="address" className={fieldClass} value={trip.address} placeholder="서울특별시 용산구 서빙고로 137" onChange={(event) => patch({ address: event.target.value })} />
      </Field>
      <Field label="시작일" htmlFor="startDate" error={showErrors && !trip.startDate ? "시작하는 날을 선택해 주세요." : undefined}>
        <Input id="startDate" className={fieldClass} type="date" value={trip.startDate} onChange={(event) => patch({ startDate: event.target.value })} />
      </Field>
      <Field label="종료일" htmlFor="endDate" hint="당일이면 시작일과 같게 두거나 비워 두세요." error={dateOrder ? "끝나는 날이 시작일보다 빠릅니다." : undefined}>
        <Input id="endDate" className={fieldClass} type="date" value={trip.endDate} onChange={(event) => patch({ endDate: event.target.value })} />
      </Field>
      <Field label="목적" htmlFor="purpose" className="sm:col-span-2" error={showErrors && !trip.purpose.trim() ? "체험 목적을 적어 주세요." : undefined}>
        <Textarea id="purpose" className="min-h-24 bg-white" value={trip.purpose} placeholder="무엇을 직접 보고 확인하려고 가는지" onChange={(event) => patch({ purpose: event.target.value })} />
      </Field>
      <Field label="이동 방법">
        <Select value={trip.transport || undefined} onValueChange={(transport) => patch({ transport })}>
          <SelectTrigger className={`${fieldClass} w-full`} aria-label="이동 방법">
            <SelectValue placeholder="선택" />
          </SelectTrigger>
          <SelectContent>
            {TRANSPORTS.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="보호자 이름" htmlFor="guardianName">
        <Input id="guardianName" className={fieldClass} value={trip.guardianName} placeholder="한도윤" onChange={(event) => patch({ guardianName: event.target.value })} />
      </Field>
      <Field label="보호자와의 관계">
        <Select value={trip.guardianRelation || undefined} onValueChange={(guardianRelation) => patch({ guardianRelation })}>
          <SelectTrigger className={`${fieldClass} w-full`} aria-label="보호자와의 관계">
            <SelectValue placeholder="선택" />
          </SelectTrigger>
          <SelectContent>
            {RELATIONS.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="보호자 연락처" htmlFor="guardianPhone">
        <Input id="guardianPhone" className={fieldClass} type="tel" inputMode="tel" value={trip.guardianPhone} placeholder="010-0000-0000" onChange={(event) => patch({ guardianPhone: event.target.value })} />
      </Field>
    </div>
  );
}

function ContentStep({
  draft,
  showErrors,
  photoError,
  fileRef,
  onPhotoError,
  onChange,
}: {
  draft: Draft;
  showErrors: boolean;
  photoError: string | null;
  fileRef: RefObject<HTMLInputElement | null>;
  onPhotoError: (message: string | null) => void;
  onChange: (draft: Draft) => void;
}) {
  if (draft.kind === "application") {
    return <ApplicationContent draft={draft} showErrors={showErrors} onChange={onChange} />;
  }
  return (
    <ReportContent
      draft={draft}
      showErrors={showErrors}
      photoError={photoError}
      fileRef={fileRef}
      onPhotoError={onPhotoError}
      onChange={onChange}
    />
  );
}

function ApplicationContent({
  draft,
  showErrors,
  onChange,
}: {
  draft: Draft;
  showErrors: boolean;
  onChange: (draft: Draft) => void;
}) {
  const missing =
    showErrors &&
    !draft.schedule.some((row) => row.time.trim() || row.place.trim() || row.activity.trim());

  function updateRow(id: string, partial: Partial<ScheduleRow>) {
    onChange({
      ...draft,
      schedule: draft.schedule.map((row) => (row.id === id ? { ...row, ...partial } : row)),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {draft.schedule.map((row, index) => (
          <div key={row.id} className="grid gap-2 rounded-xl border bg-white p-3 sm:grid-cols-[8.5rem_9rem_minmax(0,1fr)_auto]">
            <Input
              aria-label={`${index + 1}번째 일정 시간`}
              className={fieldClass}
              value={row.time}
              placeholder="09:00–10:30"
              onChange={(event) => updateRow(row.id, { time: event.target.value })}
            />
            <Input
              aria-label={`${index + 1}번째 일정 장소`}
              className={fieldClass}
              value={row.place}
              placeholder="장소"
              onChange={(event) => updateRow(row.id, { place: event.target.value })}
            />
            <Input
              aria-label={`${index + 1}번째 일정 활동`}
              className={fieldClass}
              value={row.activity}
              placeholder="무엇을 하는지"
              onChange={(event) => updateRow(row.id, { activity: event.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`${index + 1}번째 일정 삭제`}
              disabled={draft.schedule.length === 1}
              onClick={() =>
                onChange({
                  ...draft,
                  schedule: draft.schedule.filter((item) => item.id !== row.id),
                })
              }
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        {missing ? (
          <p className="text-sm text-destructive" role="alert">
            일정 한 줄은 적어 주세요.
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="h-10 self-start"
          disabled={draft.schedule.length >= MAX_ROWS}
          onClick={() =>
            onChange({
              ...draft,
              schedule: [...draft.schedule, { id: createId(), time: "", place: "", activity: "" }],
            })
          }
        >
          <Plus />
          일정 줄 추가
        </Button>
        {draft.schedule.length >= MAX_ROWS ? (
          <p className="text-sm text-muted-foreground">일정은 12줄까지 넣을 수 있습니다.</p>
        ) : null}
      </div>
      <Field label="확인하고 올 것" htmlFor="goals">
        <Textarea
          id="goals"
          className="min-h-20 bg-white"
          value={draft.application.goals}
          placeholder="체험이 끝나면 무엇을 말할 수 있으면 좋은지"
          onChange={(event) =>
            onChange({
              ...draft,
              application: { ...draft.application, goals: event.target.value },
            })
          }
        />
      </Field>
      <Field label="준비물" htmlFor="materials">
        <Input
          id="materials"
          className={fieldClass}
          value={draft.application.materials}
          placeholder="도시락, 물통, 필기구"
          onChange={(event) =>
            onChange({
              ...draft,
              application: { ...draft.application, materials: event.target.value },
            })
          }
        />
      </Field>
      <Field label="보호자 메모" htmlFor="guardianNote" hint="연락 방법처럼 학교에 전할 말이 있을 때만 적습니다.">
        <Textarea
          id="guardianNote"
          className="min-h-20 bg-white"
          value={draft.application.guardianNote}
          onChange={(event) =>
            onChange({
              ...draft,
              application: { ...draft.application, guardianNote: event.target.value },
            })
          }
        />
      </Field>
    </div>
  );
}

function ReportContent({
  draft,
  showErrors,
  photoError,
  fileRef,
  onPhotoError,
  onChange,
}: {
  draft: Draft;
  showErrors: boolean;
  photoError: string | null;
  fileRef: RefObject<HTMLInputElement | null>;
  onPhotoError: (message: string | null) => void;
  onChange: (draft: Draft) => void;
}) {
  const report = draft.report;

  async function onFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (report.photos.length >= MAX_PHOTOS) {
      onPhotoError("사진은 3장까지 넣을 수 있습니다.");
      return;
    }
    try {
      const dataUrl = await compressImage(file);
      onChange({
        ...draft,
        report: {
          ...report,
          photos: [...report.photos, { id: createId(), caption: "", dataUrl }],
        },
      });
      onPhotoError(null);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "";
      if (reason === "type") onPhotoError("이미지 파일만 넣을 수 있습니다.");
      else if (reason === "size") onPhotoError("사진이 너무 큽니다. 12MB보다 작은 파일을 골라 주세요.");
      else onPhotoError("사진을 읽지 못했습니다. 다른 파일로 시도해 주세요.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Field label="체험 내용" htmlFor="body" error={showErrors && !report.body.trim() ? "체험 내용을 적어 주세요." : undefined}>
        <Textarea
          id="body"
          className="min-h-40 bg-white"
          value={report.body}
          placeholder="언제 어디에 가서 무엇을 했는지 차례대로 적습니다."
          onChange={(event) => onChange({ ...draft, report: { ...report, body: event.target.value } })}
        />
      </Field>
      <Field label="배운 점" htmlFor="learned">
        <Textarea
          id="learned"
          className="min-h-24 bg-white"
          value={report.learned}
          placeholder="새로 알게 된 사실"
          onChange={(event) => onChange({ ...draft, report: { ...report, learned: event.target.value } })}
        />
      </Field>
      <Field label="느낀 점" htmlFor="feelings">
        <Textarea
          id="feelings"
          className="min-h-24 bg-white"
          value={report.feelings}
          placeholder="하면서 든 생각"
          onChange={(event) => onChange({ ...draft, report: { ...report, feelings: event.target.value } })}
        />
      </Field>
      <Field label="앞으로의 계획" htmlFor="nextPlan">
        <Textarea
          id="nextPlan"
          className="min-h-20 bg-white"
          value={report.next}
          placeholder="이어서 해 보고 싶은 일"
          onChange={(event) => onChange({ ...draft, report: { ...report, next: event.target.value } })}
        />
      </Field>
      <div className="flex flex-col gap-2">
        <Label>사진</Label>
        <p className="text-sm text-muted-foreground">최대 3장입니다. 이 브라우저에만 저장되고, 인쇄할 때 보고서 아래에 나옵니다.</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => void onFiles(event.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          className="h-10 self-start"
          disabled={report.photos.length >= MAX_PHOTOS}
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlus />
          사진 추가
        </Button>
        {photoError ? (
          <p className="text-sm text-destructive" role="alert">
            {photoError}
          </p>
        ) : null}
        <ul className="grid gap-3 sm:grid-cols-3">
          {report.photos.map((photo, index) => (
            <li key={photo.id} className="overflow-hidden rounded-xl border bg-white">
              {/* Local preview of a photo the visitor just picked. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.dataUrl} alt={photo.caption || `첨부 사진 ${index + 1}`} className="aspect-4/3 w-full object-cover" />
              <div className="flex flex-col gap-2 p-2">
                <Input
                  aria-label={`${index + 1}번째 사진 설명`}
                  className={fieldClass}
                  value={photo.caption}
                  placeholder="사진 설명"
                  onChange={(event) =>
                    onChange({
                      ...draft,
                      report: {
                        ...report,
                        photos: report.photos.map((item) =>
                          item.id === photo.id ? { ...item, caption: event.target.value } : item,
                        ),
                      },
                    })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onChange({
                      ...draft,
                      report: {
                        ...report,
                        photos: report.photos.filter((item) => item.id !== photo.id),
                      },
                    })
                  }
                >
                  <Trash2 />
                  빼기
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PreviewStep({
  draft,
  today,
  onContinueAsReport,
  onJump,
}: {
  draft: Draft;
  today: string;
  onContinueAsReport: () => void;
  onJump: (step: number) => void;
}) {
  const issues = allIssues(draft);
  const required = issues.filter((issue) => issue.level === "required");
  const recommended = issues.filter((issue) => issue.level === "recommended");
  return (
    <div className="flex flex-col gap-4">
      {required.length === 0 ? (
        <p className="rounded-lg bg-primary/5 px-3 py-2 text-sm text-primary">
          꼭 채워야 하는 칸은 모두 있습니다. 브라우저 인쇄에서 대상을 PDF로 저장하면 파일로도 남길 수 있습니다.
        </p>
      ) : (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm" role="status">
          <p className="font-medium text-destructive">제출 전에 이 칸을 채워 주세요.</p>
          <ul className="mt-2 list-disc pl-5 text-destructive">
            {required.map((issue) => (
              <li key={issue.message}>{issue.message}</li>
            ))}
          </ul>
        </div>
      )}
      {recommended.length > 0 ? (
        <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          <p>있으면 좋은 칸</p>
          <ul className="mt-1 list-disc pl-5">
            {recommended.map((issue) => (
              <li key={issue.message}>{issue.message}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => onJump(1)}>
          학생 수정
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onJump(2)}>
          체험 수정
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onJump(3)}>
          {draft.kind === "application" ? "일정 수정" : "기록 수정"}
        </Button>
        {draft.kind === "application" ? (
          <Button type="button" size="sm" variant="secondary" onClick={onContinueAsReport}>
            이 내용으로 보고서 만들기
          </Button>
        ) : null}
      </div>
      <div className="sheet-fit overflow-auto rounded-2xl bg-[oklch(0.86_0.02_80)] p-3">
        <DocumentSheet draft={draft} today={today} />
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`grid gap-1.5 ${className ?? ""}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
