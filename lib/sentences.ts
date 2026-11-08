import { categoryById, type DocKind, type GradeBand, type PurposeCopy } from "@/lib/catalog";
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

const EMPTY_PLACE = "해당 체험 장소";
const EMPTY_COMPANION = "가족과 함께";

export function buildSentences(input: SentenceInput): SentenceOutput {
  const category = categoryById(input.categoryId);
  const selected = category.purposes.filter((purpose) => input.purposeIds.includes(purpose.id));
  const place = input.place.trim() || EMPTY_PLACE;
  const companion = companionPhrase(input.companion);

  return {
    application: buildApplication(place, selected),
    report: buildReport(place, companion, selected, input.grade),
  };
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

function companionPhrase(raw: string): string {
  const text = raw.trim();
  if (!text) return EMPTY_COMPANION;
  if (text.endsWith("함께")) return text;
  return `${text}${gwaWa(text)} 함께`;
}

const shortLabels: Record<string, string> = {
  "science-exhibit": "체험형 과학 전시",
  "art-view": "예술 작품 관람",
  "dino-bio": "공룡·생물 관찰",
  space: "우주·천문 탐구",
  career: "직업 체험",
  artifacts: "역사 유물 관찰",
  craft: "전통 공예 체험",
  "robot-ai": "로봇·AI 전시 관람",
  forest: "숲 체험",
  camping: "야외 캠핑",
  "farm-village": "농촌·어촌 체험",
  ocean: "해양 생물 관찰",
  arboretum: "식물원 탐방",
  harvest: "농산물 수확",
  "animal-care": "동물 돌봄 체험",
  stars: "별자리 관측",
  "local-food": "현지 음식 체험",
  transit: "현지 교통 이용",
  language: "현지 표현 사용",
  "culture-diff": "문화 차이 이해",
  heritage: "유적지 탐방",
  terrain: "자연 지형 관찰",
  "family-bond": "가족 유대",
  adapt: "환경 적응",
  filial: "효 실천",
  relatives: "친척 만남",
  "holiday-manner": "명절 예절 체험",
  countryside: "시골 생활 이해",
  "elders-story": "어른 이야기 청취",
  cooking: "제철 요리",
  housework: "집안일 돕기",
  "seasonal-nature": "계절 관찰",
  "year-end": "연말 문화 체험",
  "seasonal-sport": "계절 스포츠",
  "solar-terms": "절기 음식 체험",
  scenery: "계절 풍경 관찰",
  sunrise: "해돋이 관람",
  "water-safety": "물놀이 안전 교육",
  "safety-order": "안전 수칙 익히기",
  musical: "공연 관람",
  "sports-watch": "스포츠 관람",
  "ride-courage": "놀이기구 체험",
  carnival: "축제 참여",
  cinema: "영화 관람",
  parade: "마술·퍼레이드 관람",
};

function buildApplication(place: string, purposes: PurposeCopy[]): string {
  if (purposes.length === 0) return "";
  const first = shortLabels[purposes[0].id] ?? purposes[0].label;
  const intro = `${place}에 방문하여 ${first}${eulReul(first)} 비롯해 아래와 같은 활동을 하고자 합니다.`;
  const bullets = purposes.map((purpose) => `* ${purpose.label}`).join("\n");
  return `${intro}\n${bullets}`;
}

function buildReport(place: string, companion: string, purposes: PurposeCopy[], grade: GradeBand): string {
  if (purposes.length === 0) return "";

  const sentences = [
    `저는 이번에 ${companion} ${place}에 다녀왔습니다.`,
    ...activitySentences(purposes.map((purpose) => purpose.label)),
    ...purposes.flatMap((purpose) => feelingSentences(purpose, grade, place)),
  ];

  const closers =
    grade === "lower"
      ? [
          "오늘 보고 들은 것이 오래 기억에 남았습니다.",
          "다음에는 배운 점을 집에서도 이야기하고, 생활 속에서 실천해 보고 싶습니다.",
        ]
      : [
          "현장에서 직접 본 내용이 교과서로만 알던 때보다 훨씬 구체적으로 남았습니다.",
          "이번 경험을 바탕으로 궁금한 점을 더 찾아보고, 생활 속에서도 실천해 보고자 합니다.",
        ];

  for (const closer of closers) {
    if (countSentences(sentences) >= 5) break;
    sentences.push(closer);
  }

  return sentences.join(" ");
}

function activitySentences(labels: string[]): string[] {
  if (labels.length === 1) {
    return [`${labels[0]}${eulReul(labels[0])} 체험하였습니다.`];
  }

  const [first, second, ...rest] = labels;
  const sentences = [`${first}${eulReul(first)} 체험하였고, ${second} 활동도 했습니다.`];
  if (rest.length === 1) {
    sentences.push(`또한 ${rest[0]}${eulReul(rest[0])} 함께 해 보았습니다.`);
  } else if (rest.length > 1) {
    const last = rest[rest.length - 1];
    const earlier = rest.slice(0, -1);
    const particle = gwaWa(earlier[earlier.length - 1]);
    sentences.push(`또한 ${earlier.join(", ")}${particle} ${last} 활동도 이어서 했습니다.`);
  }
  return sentences;
}

function feelingSentences(purpose: PurposeCopy, grade: GradeBand, place: string): string[] {
  const filled = purpose.report[grade]
    .replaceAll("{place}", place)
    .replaceAll("{with}", "")
    .replaceAll("{obj}", eulReul(place))
    .replace(/[ \t]{2,}/g, " ")
    .trim();
  return splitSentences(toHapsyo(filled));
}

function toHapsyo(sentence: string): string {
  return sentence.replace(/음\./g, "습니다.").replace(/음$/, "습니다.");
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=\.)\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function countSentences(sentences: string[]): number {
  return sentences.reduce((total, sentence) => total + splitSentences(sentence).length, 0);
}
