import type { Metadata } from "next";

import { SiteFrame } from "@/components/site-frame";

const faqs = [
  {
    question: "초등 교외체험학습 신청서 사유는 어떻게 적어야 하나요?",
    answer:
      "단순히 '가족 여행'이라고 적기보다 '역사 유적지 탐방을 통해 교과서 속 유물을 관찰하고 견문을 넓히고자 함'처럼 교육적 목적과 장소를 구체적으로 적는 편이 좋습니다.",
  },
  {
    question: "교외체험학습 서류 제출 기한은 언제인가요?",
    answer:
      "기한은 학교마다 다릅니다. 신청서는 출발 3–7일 전에 내는 곳이 많고, 결과보고서는 다녀온 뒤 등교 첫날이나 7일 안에 학교 안내에 따라 사진·티켓과 함께 내는 곳이 많습니다. 정확한 날짜는 학교 안내를 확인해 주세요.",
  },
];

export const metadata: Metadata = {
  title: "교외체험학습 서류 헬퍼",
  description:
    "교외체험학습 서류 헬퍼는 초등 신청서 사유와 결과보고서 느낀점을 3초 만에 만드는 마이멜로의 무료 도구입니다. 회원가입 없이 브라우저에서 바로 쓸 수 있습니다.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <SiteFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <div>
            <h1 className="mb-2 text-lg font-extrabold text-slate-900 sm:text-xl">🌱 교외체험학습 서류 헬퍼란?</h1>
            <p>
              <strong>교외체험학습 서류 헬퍼</strong>는 바쁜 초등 학부모님을 위해 <strong>신청서 사유</strong>와{" "}
              <strong>결과보고서 느낀점</strong>을 3초 만에 학교 제출용 문장으로 정리해 드리는 마이멜로의{" "}
              <strong>무료 자동화 툴</strong>입니다.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-bold text-slate-800">💡 주요 특징 및 이용 방법</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-600">
              <li>
                <strong>맞춤형 핀셋 선택:</strong> 아이 학년(저학년 1–2학년 / 고학년 3–6학년)과 여행 카테고리(박물관·과학관,
                자연·생태, 국내·해외 가족 여행, 친척 방문, 계절 활동, 테마파크)를 고르면 제출 초안이 바로 만들어집니다.
              </li>
              <li>
                <strong>다양한 세부 목적 반영:</strong> 현지 음식 체험, 대중교통 이용, 생태 관찰, 예절 실천처럼 구체적인
                활동을 여러 개 고를 수 있습니다.
              </li>
              <li>
                <strong>개인정보 보호:</strong> 회원가입이나 로그인 없이, 문장은 브라우저 안에서만 만들어지며 서버에는
                저장되지 않습니다.
              </li>
            </ul>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="font-bold text-slate-800">❓ 자주 묻는 질문</h2>
            {faqs.map((item) => (
              <div key={item.question}>
                <p className="font-semibold text-indigo-700">Q. {item.question}</p>
                <p className="mt-0.5 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>

          <p className="text-xs leading-5 text-slate-400">
            * 본 툴에서 생성된 문장은 제출용 기본 초안이므로, 실제 아이의 경험에 맞게 가볍게 다듬은 뒤 학교 서식에 맞게
            붙여넣어 사용하세요.
          </p>
        </div>
      </article>
    </SiteFrame>
  );
}
