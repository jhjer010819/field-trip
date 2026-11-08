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
    ...activitySentences(purposes, grade),
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

const easyActivities: Record<string, string> = {
  "science-exhibit": "직접 눌러 보거나 만질 수 있는 전시가 많아서 재미있었습니다.",
  "art-view": "그림과 조형 작품을 천천히 보며 색과 모양이 다르다는 것을 보았습니다.",
  "dino-bio": "공룡과 여러 생물의 모양을 비교해 보았습니다.",
  space: "별과 행성 모형을 보며 우주가 아주 넓다는 것을 알았습니다.",
  career: "여러 직업을 직접 해 보며 하는 일이 다르다는 것을 알았습니다.",
  artifacts: "옛날 그릇과 도구를 눈으로 보며 시대마다 생활이 달랐다는 것을 보았습니다.",
  craft: "전통 공예와 민속품을 만져 보고 만들어 보았습니다.",
  "robot-ai": "로봇이 소리에 맞춰 움직이는 모습을 보았습니다.",
  forest: "숲에서 잎과 발자국을 찾아보며 동물과 식물을 관찰했습니다.",
  camping: "텐트를 치고 내 역할을 마치며 캠핑을 해 보았습니다.",
  "farm-village": "농촌과 어촌에서 음식을 만드는 일을 조금 도와 보았습니다.",
  ocean: "바다 생물을 보고 바다를 깨끗이 지켜야 한다는 것을 알았습니다.",
  arboretum: "식물원에서 잎과 꽃을 비교해 보았습니다.",
  harvest: "고구마나 과일 같은 작물을 직접 따 보았습니다.",
  "animal-care": "동물에게 천천히 다가가 먹이를 주었습니다.",
  stars: "어두운 하늘에서 별자리를 찾아보았습니다.",
  "local-food": "그곳의 대표 음식을 맛보며 지역마다 맛이 다르다는 것을 알았습니다.",
  transit: "그곳의 버스나 전철, 배를 타고 이동해 보았습니다.",
  language: "짧은 인사말을 실제로 말해 보았습니다.",
  "culture-diff": "그곳 사람들의 생활이 우리와 어떻게 다른지 살펴보았습니다.",
  heritage: "유적과 유명한 장소를 걸어 다니며 구경했습니다.",
  terrain: "산과 강, 바다처럼 땅의 모습을 우리 동네와 비교해 보았습니다.",
  "family-bond": "가족과 길을 찾고 밥을 고르며 이야기를 나누었습니다.",
  adapt: "처음 보는 장소에서도 안내를 따라 해 보았습니다.",
  filial: "어른께 큰 소리로 인사하고 안부를 여쭈었습니다.",
  relatives: "친척을 만나 얼굴을 보고 이야기를 나누었습니다.",
  "holiday-manner": "명절 자리에서 순서에 맞춰 인사하는 예절을 익혔습니다.",
  countryside: "시골의 마당과 텃밭을 보며 도시와 다른 하루를 보았습니다.",
  "elders-story": "할머니, 할아버지의 옛날 이야기를 들었습니다.",
  cooking: "친척과 제철 음식을 함께 만들었습니다.",
  housework: "상 차리기와 정리를 도우며 집안일을 거들었습니다.",
  "seasonal-nature": "계절에 따라 잎의 색과 바람이 달라진 것을 보았습니다.",
  "year-end": "연말 거리의 불과 음악을 보며 한 해를 마무리하는 모습을 보았습니다.",
  "seasonal-sport": "그 계절에 맞는 운동을 하며 기본 자세를 익혔습니다.",
  "solar-terms": "절기 음식을 맛보며 계절에 맞춰 먹는 음식을 알았습니다.",
  scenery: "꽃이나 단풍을 걸으며 계절의 색을 보았습니다.",
  sunrise: "해가 뜨거나 지는 모습을 보고 다짐을 적어 보았습니다.",
  "water-safety": "물에 들어가기 전 안전 약속을 지키고 수영 기본 동작을 배웠습니다.",
  "safety-order": "줄을 서고 안전 규칙을 지키며 차례를 지켰습니다.",
  musical: "공연을 끝까지 조용히 집중해서 보았습니다.",
  "sports-watch": "경기를 직접 보며 규칙과 응원하는 방법을 알았습니다.",
  "ride-courage": "놀이기구를 타기 전에 안전 장치를 확인하고 용기를 내어 타 보았습니다.",
  carnival: "얼굴 그림과 퍼레이드를 보며 색으로 기분을 표현해 보았습니다.",
  cinema: "영화를 볼 때 소리를 내지 않고 자리를 지키는 예절을 지켰습니다.",
  parade: "마술과 서커스, 퍼레이드를 보며 어떻게 그런 장면이 나오는지 상상해 보았습니다.",
};

function activitySentences(purposes: PurposeCopy[], grade: GradeBand): string[] {
  if (grade === "lower") {
    return purposes.map((purpose) => easyActivities[purpose.id] ?? `${purpose.label}을 해 보았습니다.`);
  }

  const labels = purposes.map((purpose) => purpose.label);
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
