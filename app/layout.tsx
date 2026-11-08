import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "교외체험학습 서류 헬퍼",
  description:
    "학년과 체험 조건을 고르면 신청 사유와 보고서 느낀점 초안을 같은 페이지에서 만듭니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f8fafc]">{children}</body>
    </html>
  );
}
