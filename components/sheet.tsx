import { formatKoreanDate, formatPeriod } from "@/lib/format";
import { isJpegDataUrl } from "@/lib/images";
import type { Draft, ScheduleRow } from "@/lib/types";

function Blank({ value, placeholder }: { value: string; placeholder: string }) {
  const text = value.trim();
  if (text) return <span>{text}</span>;
  if (!placeholder) return null;
  return <span className="sheet-placeholder">{placeholder}</span>;
}

function SignBox({ role, name }: { role: string; name: string }) {
  return (
    <div className="sheet-sign">
      <p className="sheet-sign-role">{role}</p>
      <p className="sheet-sign-name">
        <Blank value={name} placeholder="이름" />
        <span className="sheet-sign-mark">(인)</span>
      </p>
    </div>
  );
}

function scheduleRows(schedule: ScheduleRow[]): ScheduleRow[] {
  const filled = schedule.filter(
    (row) => row.time.trim() || row.place.trim() || row.activity.trim(),
  );
  if (filled.length > 0) return filled;
  return [
    { id: "blank-1", time: "", place: "", activity: "" },
    { id: "blank-2", time: "", place: "", activity: "" },
    { id: "blank-3", time: "", place: "", activity: "" },
  ];
}

function periodLabel(draft: Draft): string {
  const label = formatPeriod(draft.trip.startDate, draft.trip.endDate);
  if (label) return label;
  if (draft.trip.startDate && draft.trip.endDate && draft.trip.endDate < draft.trip.startDate) {
    return "기간을 다시 확인해 주세요";
  }
  return "";
}

export function DocumentSheet({
  draft,
  today,
}: {
  draft: Draft;
  today: string;
}) {
  return draft.kind === "application" ? (
    <ApplicationSheet draft={draft} today={today} />
  ) : (
    <ReportSheet draft={draft} today={today} />
  );
}

function SheetHeader({
  draft,
  title,
  kicker,
}: {
  draft: Draft;
  title: string;
  kicker: string;
}) {
  const { student, trip } = draft;
  return (
    <>
      <header className="sheet-header">
        <div className="sheet-seal" aria-hidden="true">
          <span>현장</span>
          <span>학습</span>
        </div>
        <p className="sheet-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="sheet-school">
          <Blank value={student.school} placeholder="학교 이름" />
        </p>
      </header>
      <table className="sheet-table sheet-meta">
        <tbody>
          <tr>
            <th>학년</th>
            <td>{student.grade.trim() ? `${student.grade}학년` : <Blank value="" placeholder="학년" />}</td>
            <th>반</th>
            <td>
              <Blank value={student.className ? `${student.className}반` : ""} placeholder="반" />
            </td>
            <th>번호</th>
            <td>
              <Blank value={student.number} placeholder="번호" />
            </td>
            <th>성명</th>
            <td>
              <Blank value={student.name} placeholder="이름" />
            </td>
          </tr>
          <tr>
            <th>담임</th>
            <td colSpan={3}>
              <Blank value={student.teacher} placeholder="담임 선생님" />
            </td>
            <th>보호자</th>
            <td colSpan={3}>
              <Blank
                value={[
                  trip.guardianName.trim(),
                  trip.guardianRelation.trim() ? `(${trip.guardianRelation.trim()})` : "",
                  trip.guardianPhone.trim(),
                ]
                  .filter(Boolean)
                  .join(" ")}
                placeholder="이름, 관계, 연락처"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function ApplicationSheet({ draft, today }: { draft: Draft; today: string }) {
  const period = periodLabel(draft);
  return (
    <article className="sheet">
      <SheetHeader draft={draft} kicker="현장체험학습" title="신청서" />
      <section className="sheet-section">
        <h2>1. 체험 기간</h2>
        <p>
          <Blank value={period} placeholder="연월일을 적어 주세요" />
        </p>
      </section>
      <section className="sheet-section">
        <h2>2. 체험 장소</h2>
        <p>
          <Blank value={draft.trip.place} placeholder="장소" />
        </p>
        {draft.trip.address.trim() ? <p className="sheet-sub">{draft.trip.address}</p> : null}
      </section>
      <section className="sheet-section">
        <h2>3. 체험 목적</h2>
        <p className="sheet-prose">
          <Blank value={draft.trip.purpose} placeholder="왜 이 체험을 하는지" />
        </p>
      </section>
      <section className="sheet-section">
        <h2>4. 이동 방법</h2>
        <p>
          <Blank value={draft.trip.transport} placeholder="도보, 지하철, 버스 등" />
        </p>
      </section>
      <section className="sheet-section">
        <h2>5. 체험 일정</h2>
        <table className="sheet-table">
          <thead>
            <tr>
              <th className="sheet-col-time">시간</th>
              <th className="sheet-col-place">장소</th>
              <th>활동 내용</th>
            </tr>
          </thead>
          <tbody>
            {scheduleRows(draft.schedule).map((row) => {
              const rowEmpty = !row.time.trim() && !row.place.trim() && !row.activity.trim();
              return (
                <tr key={row.id}>
                  <td>
                    <Blank value={row.time} placeholder={rowEmpty ? "시간" : ""} />
                  </td>
                  <td>
                    <Blank value={row.place} placeholder={rowEmpty ? "장소" : ""} />
                  </td>
                  <td>
                    <Blank value={row.activity} placeholder={rowEmpty ? "활동" : ""} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <section className="sheet-section">
        <h2>6. 학습에서 확인할 것</h2>
        <p className="sheet-prose">
          <Blank value={draft.application.goals} placeholder="체험이 끝나면 무엇을 말할 수 있으면 좋은지" />
        </p>
      </section>
      <section className="sheet-section">
        <h2>7. 준비물</h2>
        <p>
          <Blank value={draft.application.materials} placeholder="준비물" />
        </p>
      </section>
      {draft.application.guardianNote.trim() ? (
        <section className="sheet-section">
          <h2>8. 보호자 메모</h2>
          <p className="sheet-prose">{draft.application.guardianNote}</p>
        </section>
      ) : null}
      <footer className="sheet-close">
        <p>위와 같이 현장체험학습을 신청합니다.</p>
        <p className="sheet-date">
          <Blank value={today} placeholder="작성일" />
        </p>
        <div className="sheet-signs">
          <SignBox role="학생" name={draft.student.name} />
          <SignBox role="보호자" name={draft.trip.guardianName} />
          <SignBox role="담임교사" name={draft.student.teacher} />
        </div>
      </footer>
    </article>
  );
}

function ReportSheet({ draft, today }: { draft: Draft; today: string }) {
  const photos = draft.report.photos.filter((photo) => isJpegDataUrl(photo.dataUrl));
  const topic = draft.trip.topic.trim() || draft.trip.place.trim();
  const whenWhere = [
    formatPeriod(draft.trip.startDate, draft.trip.endDate),
    draft.trip.place.trim(),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="sheet">
      <SheetHeader draft={draft} kicker="현장체험학습" title="보고서" />
      <section className="sheet-section">
        <h2>1. 체험 주제</h2>
        <p>
          <Blank value={topic} placeholder="주제 또는 장소" />
        </p>
      </section>
      <section className="sheet-section">
        <h2>2. 일시와 장소</h2>
        <p>
          <Blank value={whenWhere} placeholder="언제, 어디서" />
        </p>
        {draft.trip.address.trim() ? <p className="sheet-sub">{draft.trip.address}</p> : null}
      </section>
      <section className="sheet-section">
        <h2>3. 체험 내용</h2>
        <div className="sheet-prose sheet-body">
          <Blank value={draft.report.body} placeholder="무엇을 했는지 차례대로 적습니다." />
        </div>
      </section>
      <section className="sheet-section sheet-keep">
        <h2>4. 배운 점</h2>
        <p className="sheet-prose">
          <Blank value={draft.report.learned} placeholder="새로 알게 된 사실" />
        </p>
      </section>
      <section className="sheet-section sheet-keep">
        <h2>5. 느낀 점</h2>
        <p className="sheet-prose">
          <Blank value={draft.report.feelings} placeholder="하면서 든 생각" />
        </p>
      </section>
      <section className="sheet-section sheet-keep">
        <h2>6. 앞으로의 계획</h2>
        <p className="sheet-prose">
          <Blank value={draft.report.next} placeholder="이어서 해 보고 싶은 일" />
        </p>
      </section>
      {photos.length > 0 ? (
        <section className="sheet-section">
          <h2>7. 사진</h2>
          <div className="sheet-photos">
            {photos.map((photo) => (
              <figure key={photo.id}>
                {/* Printed photos are local data URLs produced by canvas, not remote images. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.dataUrl} alt={photo.caption.trim() || "체험 사진"} />
                {photo.caption.trim() ? <figcaption>{photo.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}
      <footer className="sheet-close">
        <p>위와 같이 현장체험학습 결과를 보고합니다.</p>
        <p className="sheet-date">
          <Blank value={today || formatKoreanDate(draft.updatedAt.slice(0, 10))} placeholder="작성일" />
        </p>
        <div className="sheet-signs">
          <SignBox role="학생" name={draft.student.name} />
          <SignBox role="보호자" name={draft.trip.guardianName} />
          <SignBox role="담임교사" name={draft.student.teacher} />
        </div>
      </footer>
    </article>
  );
}
