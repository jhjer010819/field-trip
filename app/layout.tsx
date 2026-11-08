import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "현장노트 — 체험학습 신청서·보고서",
  description:
    "현장체험학습 신청서와 보고서를 학교 양식에 맞춰 작성하고 인쇄합니다. 문서는 이 브라우저에만 저장됩니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="desk-bg min-h-full flex flex-col">{children}</body>
    </html>
  );
}
