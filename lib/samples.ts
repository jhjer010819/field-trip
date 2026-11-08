import { createId } from "@/lib/draft";
import type { Draft, ScheduleRow } from "@/lib/types";

function row(time: string, place: string, activity: string): ScheduleRow {
  return { id: createId(), time, place, activity };
}

export type SampleId = "museum" | "park";

export function applySample(draft: Draft, sample: SampleId): Draft {
  if (sample === "museum") return applyMuseum(draft);
  return applyPark(draft);
}

function applyMuseum(draft: Draft): Draft {
  return {
    ...draft,
    exampleNotice: true,
    student: {
      school: "하늘초등학교",
      grade: "4",
      className: "2",
      number: "15",
      name: "한결",
      teacher: "이수진",
    },
    trip: {
      topic: "삼국시대 유물 관찰",
      place: "국립중앙박물관",
      address: "서울특별시 용산구 서빙고로 137",
      startDate: "2026-11-12",
      endDate: "2026-11-12",
      purpose:
        "교과서에서 본 삼국시대 유물을 직접 관찰하고, 시대별 특징을 하나씩 기록하기 위해",
      transport: "지하철",
      guardianName: "한도윤",
      guardianRelation: "부",
      guardianPhone: "010-2345-6789",
    },
    schedule: [
      row("09:00–09:20", "학교 정문", "집합하고 인원을 확인한다"),
      row("10:10–10:30", "박물관 정문", "도착 후 관람 안내를 듣는다"),
      row("10:30–12:00", "선사·고대관", "토기와 금관을 관찰하고 스케치한다"),
      row("12:00–13:00", "박물관 식당", "점심 식사"),
      row("13:10–14:30", "어린이박물관", "체험 활동을 하고 질문 카드를 작성한다"),
      row("15:00", "학교 정문", "도착 후 해산한다"),
    ],
    application: {
      goals: "유물 카드를 보고 시대와 용도를 구분해 두 가지 이상 적는다.",
      materials: "도시락, 물통, 필기구, 스케치북",
      guardianNote: "당일 연락은 보호자 휴대폰으로 부탁드립니다.",
    },
    report: {
      ...draft.report,
      photos: [],
      body: "국립중앙박물관 선사·고대관에서 토기와 금관을 보았다. 금관은 생각보다 작고 얇았다. 도슨트 선생님이 신라 금관은 왕이 평소에 쓰기보다 장례에 쓰였다고 설명해 주셨다. 토기에는 손으로 누른 무늬가 남아 있었다.",
      learned:
        "유물의 크기와 무늬를 보면 쓰임새를 짐작할 수 있다. 신라 금관은 장식과 의례를 위한 물건이었다.",
      feelings:
        "유리 너머로만 보다가 설명과 함께 보니 교과서 그림이 진짜 물건으로 느껴졌다. 다음에도 질문 카드를 미리 적어 가고 싶다.",
      next: "교과서 삼국 문화 단원에서 오늘 본 유물을 찾아 표시해 두겠다.",
    },
  };
}

function applyPark(draft: Draft): Draft {
  return {
    ...draft,
    exampleNotice: true,
    student: {
      school: "하늘초등학교",
      grade: "5",
      className: "1",
      number: "8",
      name: "김나루",
      teacher: "박서현",
    },
    trip: {
      topic: "한강 생태 관찰",
      place: "여의도 한강공원 생태학습장",
      address: "서울특별시 영등포구 여의동로 330",
      startDate: "2026-10-23",
      endDate: "2026-10-23",
      purpose: "강가에 사는 식물과 새를 관찰하고, 도시 공원도 동식물의 서식지라는 점을 확인하기 위해",
      transport: "시내버스",
      guardianName: "김은지",
      guardianRelation: "모",
      guardianPhone: "010-9876-5432",
    },
    schedule: [
      row("09:30–10:00", "학교 정문", "집합하고 관찰 노트를 나눈다"),
      row("10:40–11:20", "생태학습장 입구", "안내판을 읽고 관찰 구역을 정한다"),
      row("11:20–12:10", "수변 데크", "새와 식물을 스케치하고 이름을 적는다"),
      row("12:10–13:00", "잔디광장", "점심 식사 후 쓰레기 분리배출"),
      row("13:00–13:40", "학습장 교실", "관찰한 내용을 모둠별로 정리한다"),
      row("14:30", "학교", "도착 후 해산한다"),
    ],
    application: {
      goals: "식물 두 종류와 새 한 종류의 특징을 관찰 노트에 적는다.",
      materials: "관찰 노트, 색연필, 물통, 모자",
      guardianNote: "낮 기온이 낮으면 겉옷을 챙기겠습니다.",
    },
    report: {
      ...draft.report,
      photos: [],
      body: "여의도 한강공원 생태학습장에서 물억새와 갈대를 구분해 보았다. 물억새는 줄기 끝이 은색으로 흩어졌고, 갈대는 갈색 꽃이 촘촘했다. 데크 위에서 흰뺨검둥오리 네 마리가 물가를 오가는 것을 10분 동안 지켜보았다. 사람이 많은 공원에도 먹이를 찾는 구역이 따로 있었다.",
      learned:
        "비슷해 보이는 풀도 꽃의 모양으로 구분할 수 있다. 새를 셀 때는 한 지점을 정하고 그 앞을 지나가는 수만 적어야 겹치지 않는다.",
      feelings:
        "처음에는 오리들이 다 같아 보였는데, 부리 옆의 노란 점을 찾고 나니 이름과 연결되었다. 관찰은 오래 보는 일이라는 말이 이해됐다.",
      next: "집 근처 하천에서 같은 방법으로 식물을 두 종류만 스케치해 보겠다.",
    },
  };
}
