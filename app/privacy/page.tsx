import type { Metadata } from "next";

import { SiteFrame } from "@/components/site-frame";

export const metadata: Metadata = {
  title: "Privacy — 교외체험학습 서류 헬퍼",
  description: "교외체험학습 서류 헬퍼의 개인정보처리방침입니다.",
};

export default function PrivacyPage() {
  return (
    <SiteFrame>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Privacy</h1>
        <p className="mt-2 text-sm text-slate-500">시행 2026년 11월 8일</p>
        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
          <p>
            이 페이지는 장소 이름, 동반자, 선택한 조건을 서버로 보내지 않습니다. 계정, 연락처, 결제 정보를 받지 않습니다.
          </p>
          <p>
            입력한 내용은 문장을 화면에 보여 주는 데만 쓰입니다. 브라우저를 닫거나 새로 만들기를 누르면 그 화면에서 사라지며, 서버에 문장을 저장하지 않습니다.
          </p>
          <p>
            현재 광고 쿠키와 방문 분석 쿠키를 쓰지 않습니다. 광고를 붙이게 되면 무엇을 쓰는지 이 방침에 먼저 적습니다.
          </p>
          <p>
            개인 정보를 수집하지 않으므로 별도의 열람·삭제 창구를 두지 않습니다. 화면에 남은 문장은 이용자가 새로 만들기나 새로고침으로 지울 수 있습니다.
          </p>
        </div>
      </article>
    </SiteFrame>
  );
}
