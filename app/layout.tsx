import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://fieldtrip.mymallow.cloud";
const title = "초등 교외체험학습 사유 & 결과보고서 문장 3초 자동 생성기 | 마이멜로";
const description =
  "초등 학교장허가 교외체험학습 신청서 사유와 결과보고서 느낀점을 3초 만에 작성하세요. 박물관, 자연체험, 해외여행, 친척방문 맞춤형 제출 문장 자동 완성을 제공합니다.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | 마이멜로",
  },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "마이멜로",
    title,
    description,
    images: [
      {
        url: "/og.jpg?v=2",
        width: 1200,
        height: 630,
        alt: "교외체험학습 제출 문장 메이커 화면",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.jpg?v=2"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "초등 교외체험학습 사유 & 결과보고서 문장 3초 자동 생성기",
  alternateName: "마이멜로",
  url: `${siteUrl}/`,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: "ko",
  isAccessibleForFree: true,
  description:
    "초등학교 학교장허가 교외체험학습 신청서 사유와 결과보고서 느낀점을 3초 만에 작성하는 문장 생성 툴",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f8fafc]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
