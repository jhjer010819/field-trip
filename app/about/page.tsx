import type { Metadata } from "next";

import { SiteFrame } from "@/components/site-frame";

export const metadata: Metadata = {
  title: "About",
  description: "마이멜로의 교외체험학습 서류 자동 작성 도구 안내입니다.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <SiteFrame>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">About</h1>
        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
          <p>
            교외체험학습 서류는 학교에 제출할 신청서 사유와 결과보고서 느낀점을 3초 만에 깔끔한 문장으로 정리해 드리는 마이멜로의 자동화 툴입니다.
          </p>
          <p>
            학년과 여행 주제, 장소만 쓱쓱 선택하시면 상황에 딱 맞는 제출용 초안이 바로 아래에 완성됩니다.
            <br />
            별도의 회원가입이나 로그인 없이 브라우저에서 즉시 이용하실 수 있습니다.
          </p>
          <p>
            생성된 문장은 기본 초안이니, 아이의 실제 경험이나 학교 양식에 맞춰 가볍게 다듬은 뒤 사이트나 서류에 붙여넣어 제출하세요!
          </p>
        </div>
      </article>
    </SiteFrame>
  );
}
