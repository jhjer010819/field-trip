import type { Metadata } from "next";

import { SiteFrame } from "@/components/site-frame";

export const metadata: Metadata = {
  title: "이용약관 — 교외체험학습 서류 헬퍼",
  description: "교외체험학습 서류 헬퍼 이용약관입니다.",
};

export default function TermsPage() {
  return (
    <SiteFrame>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">이용약관</h1>
        <p className="mt-2 text-sm text-slate-500">시행 2026년 11월 8일</p>
        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
          <p>이 화면은 교외체험학습 제출 문장의 초안을 무료로 만들어 보여 줍니다.</p>
          <p>
            생성된 문장은 참고용입니다. 학교의 안내, 실제 일정, 문체 기준에 맞게 보호자가 확인하고 고쳐야 합니다. 학교의 공식 문서가 아닙니다.
          </p>
          <p>
            문장을 그대로 제출해서 생기는 일은 이용자에게 있습니다. 서비스는 문장의 사실 여부나 학교의 접수 결과를 보장하지 않습니다.
          </p>
          <p>화면을 자동으로 반복 호출해 이용을 방해하는 방식으로 쓰지 않습니다.</p>
          <p>
            문장 아래에 보이는 자료 안내와 가격 표시는 화면 구성이며, 지금은 결제나 파일 내려받기로 연결되지 않습니다.
          </p>
          <p>화면 구성과 문장 예시는 사전 고지 없이 달라질 수 있습니다.</p>
        </div>
      </article>
    </SiteFrame>
  );
}
