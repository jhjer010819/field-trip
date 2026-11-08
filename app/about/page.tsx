import type { Metadata } from "next";

import { SiteFrame } from "@/components/site-frame";

export const metadata: Metadata = {
  title: "About — 교외체험학습 서류 헬퍼",
  description: "교외체험학습 신청 사유와 보고서 느낀점 초안을 만드는 페이지입니다.",
};

export default function AboutPage() {
  return (
    <SiteFrame>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">About</h1>
        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
          <p>
            교외체험학습 서류 헬퍼는 신청서에 넣을 사유와 결과보고서에 넣을 느낀점을 학교 제출 문장으로 빨리 다듬는 화면입니다.
          </p>
          <p>
            학년, 체험 종류, 장소, 동반자를 고르면 그 조건에 맞춘 초안이 같은 페이지 아래에 나옵니다. 문장은 브라우저 안에서 만들어지며, 회원가입은 없습니다.
          </p>
          <p>
            나온 문장은 초안입니다. 학교 양식, 실제 일정, 사실과 맞게 고친 뒤 한글 서식에 붙여 넣으면 됩니다.
          </p>
        </div>
      </article>
    </SiteFrame>
  );
}
