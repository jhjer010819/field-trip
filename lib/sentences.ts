import { categoryById, type DocKind, type GradeBand } from "@/lib/catalog";
import { eulReul, gwaWa } from "@/lib/korean";

export interface SentenceInput {
  doc: DocKind;
  grade: GradeBand;
  categoryId: string;
  purposeIds: string[];
  place: string;
  companion: string;
}

export interface SentenceOutput {
  application: string;
  report: string;
}

export function buildSentences(input: SentenceInput): SentenceOutput {
  const category = categoryById(input.categoryId);
  const selected = category.purposes.filter((purpose) => input.purposeIds.includes(purpose.id));
  const place = input.place.trim() || category.fallbackPlace;
  const companion = input.companion.trim();
  const withText = companion ? `${companion}${gwaWa(companion)} 함께 ` : "";
  const object = eulReul(place);

  const fill = (template: string) =>
    template
      .replaceAll("{with}", withText)
      .replaceAll("{place}", place)
      .replaceAll("{obj}", object);

  const application = selected
    .map((purpose) => fill(purpose.application[input.grade]))
    .join(" ");
  const report = selected.map((purpose) => fill(purpose.report[input.grade])).join(" ");

  return { application, report };
}

export function copyText(doc: DocKind, output: SentenceOutput): string {
  const blocks: string[] = [];
  if (doc !== "report" && output.application) {
    blocks.push(`[신청서 제출용 사유]\n${output.application}`);
  }
  if (doc !== "application" && output.report) {
    blocks.push(`[결과보고서 제출용 느낀점]\n${output.report}`);
  }
  return blocks.join("\n\n");
}
