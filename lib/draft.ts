import { formatPeriod } from "@/lib/format";
import type { DocKind, Draft, Issue, ScheduleRow, StepId } from "@/lib/types";

export const STEP_IDS: StepId[] = [
  "kind",
  "student",
  "trip",
  "content",
  "preview",
];

export function createId(): string {
  return crypto.randomUUID();
}

function emptyRow(): ScheduleRow {
  return { id: createId(), time: "", place: "", activity: "" };
}

export function createEmptyDraft(kind: DocKind): Draft {
  const now = new Date().toISOString();
  return {
    id: createId(),
    kind,
    createdAt: now,
    updatedAt: now,
    exampleNotice: false,
    student: {
      school: "",
      grade: "",
      className: "",
      number: "",
      name: "",
      teacher: "",
    },
    trip: {
      topic: "",
      place: "",
      address: "",
      startDate: "",
      endDate: "",
      purpose: "",
      transport: "",
      guardianName: "",
      guardianRelation: "",
      guardianPhone: "",
    },
    schedule: [emptyRow(), emptyRow(), emptyRow()],
    application: { goals: "", materials: "", guardianNote: "" },
    report: { body: "", learned: "", feelings: "", next: "", photos: [] },
  };
}

export function stepMeta(kind: DocKind): {
  id: StepId;
  label: string;
  title: string;
  description: string;
}[] {
  return [
    {
      id: "kind",
      label: "종류",
      title: "어떤 문서를 쓸까요?",
      description:
        "가기 전에는 신청서, 다녀온 뒤에는 보고서입니다. 작성 중에도 바꿀 수 있습니다.",
    },
    {
      id: "student",
      label: "학생",
      title: "학생 정보",
      description: "서류 맨 위에 적히는 학교와 이름입니다.",
    },
    {
      id: "trip",
      label: "체험",
      title: "체험 정보",
      description: "장소, 기간, 함께 가는 보호자를 적습니다.",
    },
    kind === "application"
      ? {
          id: "content",
          label: "일정",
          title: "일정과 준비",
          description: "시간별로 적으면 선생님이 하루 흐름을 바로 봅니다.",
        }
      : {
          id: "content",
          label: "기록",
          title: "다녀온 기록",
          description: "한 일, 배운 점, 느낀 점을 나눠 적으면 보고서가 정돈됩니다.",
        },
    {
      id: "preview",
      label: "인쇄",
      title: "양식 확인",
      description: "종이에 나갈 모습입니다. 빠진 칸은 아래에서 알려 드립니다.",
    },
  ];
}

export function draftTitle(draft: Draft): string {
  const named = draft.trip.topic.trim() || draft.trip.place.trim();
  if (named) return named;
  return draft.kind === "application" ? "제목 없는 신청서" : "제목 없는 보고서";
}

export function draftHasContent(draft: Draft): boolean {
  const { student, trip, application, report, schedule } = draft;
  return Boolean(
    student.school.trim() ||
      student.name.trim() ||
      student.teacher.trim() ||
      trip.place.trim() ||
      trip.purpose.trim() ||
      trip.topic.trim() ||
      application.goals.trim() ||
      report.body.trim() ||
      schedule.some((row) => row.time.trim() || row.place.trim() || row.activity.trim()),
  );
}

export function issuesFor(draft: Draft, step: StepId): Issue[] {
  if (step === "student") {
    const issues: Issue[] = [];
    if (!draft.student.school.trim()) {
      issues.push({ level: "required", message: "학교 이름을 적어 주세요." });
    }
    if (!draft.student.grade.trim()) {
      issues.push({ level: "required", message: "학년을 선택해 주세요." });
    }
    if (!draft.student.name.trim()) {
      issues.push({ level: "required", message: "학생 이름을 적어 주세요." });
    }
    if (!draft.student.teacher.trim()) {
      issues.push({ level: "recommended", message: "담임 선생님 이름이 비어 있습니다." });
    }
    return issues;
  }

  if (step === "trip") {
    const issues: Issue[] = [];
    if (!draft.trip.place.trim()) {
      issues.push({ level: "required", message: "체험 장소를 적어 주세요." });
    }
    if (!draft.trip.startDate) {
      issues.push({ level: "required", message: "시작하는 날을 선택해 주세요." });
    }
    if (
      draft.trip.startDate &&
      draft.trip.endDate &&
      draft.trip.endDate < draft.trip.startDate
    ) {
      issues.push({
        level: "required",
        message: "끝나는 날이 시작일보다 빠릅니다.",
      });
    }
    if (!draft.trip.purpose.trim()) {
      issues.push({ level: "required", message: "체험 목적을 적어 주세요." });
    }
    if (!draft.trip.guardianName.trim()) {
      issues.push({ level: "recommended", message: "보호자 이름이 비어 있습니다." });
    }
    if (!draft.trip.guardianPhone.trim()) {
      issues.push({ level: "recommended", message: "보호자 연락처가 비어 있습니다." });
    }
    return issues;
  }

  if (step === "content") {
    if (draft.kind === "application") {
      const filled = draft.schedule.some(
        (row) => row.time.trim() || row.place.trim() || row.activity.trim(),
      );
      if (!filled) {
        return [
          {
            level: "required",
            message: "일정 한 줄은 적어 주세요. 시간, 장소, 활동 중 무엇이든 좋습니다.",
          },
        ];
      }
      return [];
    }
    const issues: Issue[] = [];
    if (!draft.report.body.trim()) {
      issues.push({ level: "required", message: "체험 내용을 적어 주세요." });
    }
    if (!draft.report.learned.trim()) {
      issues.push({ level: "recommended", message: "배운 점이 비어 있습니다." });
    }
    if (!draft.report.feelings.trim()) {
      issues.push({ level: "recommended", message: "느낀 점이 비어 있습니다." });
    }
    return issues;
  }

  return [];
}

export function allIssues(draft: Draft): Issue[] {
  const steps: StepId[] = ["student", "trip", "content"];
  return steps.flatMap((step) => issuesFor(draft, step));
}

export function requiredIssues(draft: Draft, step: StepId): Issue[] {
  return issuesFor(draft, step).filter((issue) => issue.level === "required");
}

export function reportFromApplication(source: Draft): Draft {
  const draft = createEmptyDraft("report");
  draft.student = { ...source.student };
  draft.trip = { ...source.trip };
  draft.schedule = source.schedule.map((row) => ({ ...row, id: createId() }));
  const lines = source.schedule
    .filter((row) => row.time.trim() || row.place.trim() || row.activity.trim())
    .map((row) =>
      [row.time.trim(), row.place.trim(), row.activity.trim()].filter(Boolean).join(" "),
    );
  const period = formatPeriod(source.trip.startDate, source.trip.endDate);
  draft.report.body = [
    period ? `${period}에 ${source.trip.place.trim() || "체험 장소"}에 다녀왔습니다.` : "",
    source.trip.purpose.trim() ? `목적: ${source.trip.purpose.trim()}` : "",
    lines.length ? `하루 일정은 다음과 같았습니다.\n${lines.map((line) => `· ${line}`).join("\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
  draft.application = { ...source.application };
  return draft;
}
