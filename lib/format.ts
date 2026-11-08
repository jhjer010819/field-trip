const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function parseIsoDate(isoDate: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function formatKoreanDate(isoDate: string): string {
  const date = parseIsoDate(isoDate);
  if (!date) return "";
  const weekday = WEEKDAYS[date.getDay()];
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}. (${weekday})`;
}

export function dayCount(start: string, end: string): number | null {
  const startDate = parseIsoDate(start);
  const endDate = parseIsoDate(end);
  if (!startDate || !endDate) return null;
  const diff = Math.round((endDate.getTime() - startDate.getTime()) / 86400000);
  if (diff < 0) return null;
  return diff + 1;
}

export function formatPeriod(start: string, end: string): string {
  const startText = formatKoreanDate(start);
  if (!startText) return "";
  const effectiveEnd = end || start;
  const endText = formatKoreanDate(effectiveEnd);
  const days = dayCount(start, effectiveEnd);
  const dayText = days ? ` · ${days}일` : "";
  if (!end || end === start || !endText) return `${startText}${dayText}`;
  return `${startText} – ${endText}${dayText}`;
}

export function todayIso(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function formatUpdated(isoTimestamp: string, now = new Date()): string {
  const then = new Date(isoTimestamp);
  if (Number.isNaN(then.getTime())) return "저장됨";
  const diff = now.getTime() - then.getTime();
  if (diff < 60_000) return "방금 저장";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}분 전 저장`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전 저장`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전 저장`;
  return `${formatKoreanDate(isoTimestamp.slice(0, 10))} 저장`;
}
