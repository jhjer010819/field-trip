export type DocKind = "set" | "application" | "report";
export type GradeBand = "lower" | "upper";

export interface PurposeCopy {
  id: string;
  label: string;
  icon: string;
  application: { lower: string; upper: string };
  report: { lower: string; upper: string };
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  fallbackPlace: string;
  purposes: PurposeCopy[];
}

export const categories: Category[] = [
  {
    id: "history",
    label: "역사·박물관·유적",
    icon: "landmark",
    fallbackPlace: "관련 유적지",
    purposes: [
      {
        id: "observe",
        label: "유물·유적지 눈으로 직접 관찰하기",
        icon: "eye",
        application: {
          lower:
            "{with}{place}{obj} 찾아가 유물을 눈으로 직접 보고 역사를 배우고 싶어서 신청합니다.",
          upper:
            "{with}{place}{obj} 직접 방문하여 교과서 수록 유물을 눈으로 직접 관찰하고 역사적 식견을 넓히고자 함.",
        },
        report: {
          lower:
            "{place}에서 유물을 직접 보니까 교과서 그림보다 훨씬 잘 기억에 남았습니다. 우리 문화재가 자랑스러웠습니다.",
          upper:
            "교과서 사진으로만 보던 역사 유물을 {place}에서 직접 눈으로 관찰하여 기억에 깊이 남았으며, 우리 문화재에 대한 자부심을 느꼈음.",
        },
      },
      {
        id: "museum",
        label: "박물관·전시관 역사 탐방하기",
        icon: "building",
        application: {
          lower:
            "{place} 전시를 차례로 보며 옛날 사람들의 생활을 알아보고 싶어서 신청합니다.",
          upper:
            "{place} 전시 관람을 통해 주요 역사적 사건과 당시 사람들의 생활 모습을 입체적으로 탐방하고 학습하고자 함.",
        },
        report: {
          lower:
            "전시를 따라 걸으며 옛날 이야기가 눈으로 이어져서 이해하기 쉬웠습니다.",
          upper:
            "{place}의 체계적인 전시를 둘러보며 옛 사람들의 삶의 지혜를 입체적으로 이해할 수 있는 뜻깊은 시간이었음.",
        },
      },
      {
        id: "hanok",
        label: "전통 문화 및 한옥 생활 체험하기",
        icon: "flower",
        application: {
          lower:
            "한옥과 전통 놀이를 직접 해 보며 우리 생활을 느끼고 싶어서 신청합니다.",
          upper:
            "전통 문화와 한옥 생활을 직접 체험하며 우리 생활 문화의 바탕을 이해하고 학습하고자 함.",
        },
        report: {
          lower: "한옥에 앉아 보고 전통 방식을 따라 해 보니 옛날 생활이 가깝게 느껴졌습니다.",
          upper:
            "한옥과 전통 생활을 몸으로 겪어 보니 우리 문화가 어떤 방식으로 이어져 왔는지 생생하게 알 수 있었음.",
        },
      },
    ],
  },
  {
    id: "nature",
    label: "자연·생태·캠핑",
    icon: "trees",
    fallbackPlace: "생태 학습장",
    purposes: [
      {
        id: "animals",
        label: "동식물 직접 관찰하기",
        icon: "eye",
        application: {
          lower: "{with}{place}에서 식물과 동물을 직접 보고 이름을 알아오고 싶어서 신청합니다.",
          upper:
            "{with}{place}{obj} 찾아 동식물을 직접 관찰하고 교과서의 생태 내용을 현장에서 확인하고자 함.",
        },
        report: {
          lower: "비슷한 풀도 꽃과 줄기를 보니 구분할 수 있었습니다. 오래 보니 더 잘 보였습니다.",
          upper:
            "사진으로만 보던 동식물을 현장에서 관찰하며 생김새와 사는 곳을 구체적으로 연결할 수 있었음.",
        },
      },
      {
        id: "eco",
        label: "생태 체험으로 환경 이해하기",
        icon: "leaf",
        application: {
          lower: "물이랑 흙이 생물이랑 어떻게 이어지는지 알아보고 싶어서 신청합니다.",
          upper: "생태 체험을 통해 환경과 생물이 서로 기대어 사는 관계를 이해하고 학습하고자 함.",
        },
        report: {
          lower: "쓰레기를 주워 보니 작은 일도 동물한테 도움이 된다는 걸 알았습니다.",
          upper:
            "서식지를 지키려면 사람이 버리는 것부터 줄여야 한다는 점을 체험으로 확인할 수 있었음.",
        },
      },
      {
        id: "camp",
        label: "캠핑·야외에서 자립심 기르기",
        icon: "tent",
        application: {
          lower: "텐트랑 밥을 스스로 해 보며 할 수 있는 일을 늘리고 싶어서 신청합니다.",
          upper: "야외에서 준비와 정리를 직접 하며 자립심과 협동하는 태도를 기르고자 함.",
        },
        report: {
          lower: "내가 한 일이 모여 캠프가 되니 뿌듯했습니다. 다음에도 역할을 맡아 보고 싶습니다.",
          upper: "역할을 나누어 준비하고 마무리하면서 함께 사는 일에 자기 몫이 있다는 점을 배웠음.",
        },
      },
    ],
  },
  {
    id: "family",
    label: "가족·시즌·계절여행",
    icon: "sun",
    fallbackPlace: "여행지",
    purposes: [
      {
        id: "season",
        label: "계절 풍경을 가족과 둘러보기",
        icon: "sun",
        application: {
          lower: "{with}{place}의 계절 풍경을 걸어 보며 계절의 변화를 느끼고 싶어서 신청합니다.",
          upper: "{with}{place}의 계절 풍경을 둘러보며 자연과 지역의 모습을 관찰하고 학습하고자 함.",
        },
        report: {
          lower: "같은 장소도 계절에 따라 색과 소리가 다르다는 것을 걸으면서 알았습니다.",
          upper: "계절마다 달라지는 빛과 식생을 걸으며 확인했고, 지역을 더 구체적으로 이해하게 되었음.",
        },
      },
      {
        id: "festival",
        label: "지역 축제·행사에 참여하기",
        icon: "flag",
        application: {
          lower: "{place} 축제에 가서 그 고장 놀이와 음식을 알아보고 싶어서 신청합니다.",
          upper: "{place}의 지역 행사에 참여하여 고장의 문화와 사람들이 모이는 방식을 알아보고자 함.",
        },
        report: {
          lower: "여러 사람이 같은 놀이를 하니 그 고장의 재미가 무엇인지 알 것 같았습니다.",
          upper: "행사에 참여해 보니 지역 문화가 사람들의 일상 속에서 어떻게 이어지는지 알 수 있었음.",
        },
      },
      {
        id: "bond",
        label: "가족과의 시간을 통해 유대 다지기",
        icon: "heart",
        application: {
          lower: "{with}이야기를 나누며 다녀오고 싶어서 신청합니다.",
          upper: "가족과의 시간을 통해 서로의 역할을 이해하고 일상의 유대를 다지고자 함.",
        },
        report: {
          lower: "이동하는 동안 가족 이야기를 들으니 평소보다 더 가깝게 느껴졌습니다.",
          upper: "함께 이동하고 정리하는 과정에서 가족의 역할을 다시 보게 된 시간이었음.",
        },
      },
    ],
  },
  {
    id: "theme",
    label: "테마파크·공연·스포츠",
    icon: "ticket",
    fallbackPlace: "체험 장소",
    purposes: [
      {
        id: "show",
        label: "공연·전시 관람으로 감수성 기르기",
        icon: "clapper",
        application: {
          lower: "{with}{place}에서 공연을 보며 이야기와 음악을 느끼고 싶어서 신청합니다.",
          upper: "{with}{place}의 공연·전시를 관람하며 표현과 이야기를 읽는 힘을 기르고자 함.",
        },
        report: {
          lower: "무대 위 소리와 빛이 이야기로 이어져서 끝까지 집중해서 봤습니다.",
          upper: "관람 예절을 지키며 작품을 보자 표현 하나하나가 더 또렷하게 들어왔음.",
        },
      },
      {
        id: "sports",
        label: "신체 활동과 협동심 익히기",
        icon: "dumbbell",
        application: {
          lower: "{place}에서 몸을 움직이며 친구나 가족이랑 힘을 맞추고 싶어서 신청합니다.",
          upper: "{place}에서 신체 활동에 참여하여 규칙, 안전, 협동의 태도를 익히고자 함.",
        },
        report: {
          lower: "규칙을 지키니 다 같이 더 재미있게 움직일 수 있었습니다.",
          upper: "안전을 지키며 역할을 나누자 혼자보다 함께할 때 활동이 이어진다는 점을 배웠음.",
        },
      },
      {
        id: "themepark",
        label: "테마 시설에서 새로운 경험하기",
        icon: "ticket",
        application: {
          lower: "{place}의 체험 시설을 순서대로 이용해 보고 새 경험을 적어 오고 싶어서 신청합니다.",
          upper: "{place}의 테마 시설을 체험하며 기획된 공간에서 무엇을 배우는지 관찰하고자 함.",
        },
        report: {
          lower: "줄 서서 기다리고 차례를 지키니 체험이 더 즐겁게 끝났습니다.",
          upper: "시설의 동선과 안내를 따라가며 새로운 경험을 안전하고 차례 있게 마칠 수 있었음.",
        },
      },
    ],
  },
  {
    id: "abroad",
    label: "해외 여행·다문화",
    icon: "plane",
    fallbackPlace: "방문 국가",
    purposes: [
      {
        id: "culture",
        label: "다른 나라의 문화를 직접 체험하기",
        icon: "globe",
        application: {
          lower: "{with}{place}에서 그 나라의 음식과 생활을 직접 보고 싶어서 신청합니다.",
          upper: "{with}{place}에서 다른 문화의 생활 방식을 직접 접하고 문화의 차이를 존중하는 태도를 배우려 함.",
        },
        report: {
          lower: "말과 인사, 음식이 달랐지만 친절하게 대해 주시니 다른 문화도 반갑게 느껴졌습니다.",
          upper: "익숙한 방식과 다른 생활을 직접 보며 문화의 차이를 비교하고 존중하는 태도를 기를 수 있었음.",
        },
      },
      {
        id: "language",
        label: "생활 문화와 언어를 접하기",
        icon: "languages",
        application: {
          lower: "그 나라 말로 간단한 인사를 해 보고 싶어서 신청합니다.",
          upper: "일상에서 쓰이는 언어와 표기를 현장에서 접하며 언어가 생활과 이어진다는 점을 알고자 함.",
        },
        report: {
          lower: "안내판의 글자를 읽어 보니 배운 말이 실제로 쓰인다는 것이 신기했습니다.",
          upper: "표지와 안내 방송의 표현을 적으며 언어가 그 사회를 어떻게 보여 주는지 관찰할 수 있었음.",
        },
      },
      {
        id: "sight",
        label: "세계 명소에서 시야 넓히기",
        icon: "landmark",
        application: {
          lower: "{place}의 유명한 장소를 걸어 보며 세계가 넓다는 것을 느끼고 싶어서 신청합니다.",
          upper: "{place}의 주요 장소를 탐방하며 세계 여러 지역의 역사와 공간을 비교해 보고자 함.",
        },
        report: {
          lower: "사진으로 보던 장소가 실제로 크다는 것을 알고 세계가 더 넓게 느껴졌습니다.",
          upper: "교과서의 장면과 실제 공간을 비교하며 세계의 규모와 다양성을 체감할 수 있었음.",
        },
      },
    ],
  },
  {
    id: "kin",
    label: "친인척 방문·가족행사",
    icon: "house",
    fallbackPlace: "친척 댁",
    purposes: [
      {
        id: "visit",
        label: "친척 댁을 방문하여 가족 유대 다지기",
        icon: "house",
        application: {
          lower: "{with}{place}에 가서 가족을 만나고 안부를 묻고 싶어서 신청합니다.",
          upper: "{with}{place}{obj} 방문하여 가족의 유대를 다지고 서로의 일상을 이해하고자 함.",
        },
        report: {
          lower: "오랜만에 얼굴을 보니 전화로 듣던 이야기가 더 또렷해졌습니다.",
          upper: "직접 만나 이야기를 나누며 떨어져 지내는 가족의 일상을 이해하고 관계가 더 가까워졌음.",
        },
      },
      {
        id: "manner",
        label: "가정의 행사에 참여하고 예절 익히기",
        icon: "heart",
        application: {
          lower: "가족 행사에서 인사와 순서를 제대로 익히고 싶어서 신청합니다.",
          upper: "가정의 행사에 참여하여 인사, 순서, 역할을 익히고 공동체 예절을 실천하고자 함.",
        },
        report: {
          lower: "큰소리로 인사하고 어른 말씀을 들으니 행사의 순서가 이해되었습니다.",
          upper: "행사 순서에 맞게 역할을 하다 보니 예절이 형식만이 아니라 서로를 배려하는 일임을 알았음.",
        },
      },
      {
        id: "story",
        label: "어른께 인사하며 가족의 이야기 듣기",
        icon: "message",
        application: {
          lower: "어른께 집안 이야기를 듣고 우리 가족을 더 알고 싶어서 신청합니다.",
          upper: "어른의 말씀을 통해 가족사의 흐름과 삶의 경험을 듣고 배우려 함.",
        },
        report: {
          lower: "옛날 사진을 같이 보니 가족의 이름이 이야기로 연결되었습니다.",
          upper: "구술로 들은 가족사가 기록과 어떻게 이어지는지 확인하며 가족의 시간을 이해하게 되었음.",
        },
      },
    ],
  },
];

export function categoryById(id: string): Category {
  return categories.find((category) => category.id === id) ?? categories[0];
}
