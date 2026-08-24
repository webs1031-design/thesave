import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thesavecompany.com"),

  title: {
    default: "더세이브 철거 | 상가철거·폐업철거·원상복구 전문",
    template: "%s | 더세이브 철거",
  },

  description:
    "상가철거, 폐업철거, 매장철거, 사무실철거, 부분철거 및 원상복구 상담. 현장 상황과 철거 범위를 확인하고 지역별 맞춤 철거 상담을 제공합니다.",

  keywords: [
    "철거",
    "철거업체",
    "철거전문업체",
    "상가철거",
    "폐업철거",
    "매장철거",
    "사무실철거",
    "원상복구",
    "부분철거",
    "철거견적",
    "철거비용",
    "더세이브",
    "더세이브철거",
  ],

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    other: {
      "naver-site-verification":
        "95fe59f444f5e31fe093ffc8cf3cde89c2fb98c7",
    },
  },

  openGraph: {
    title: "더세이브 철거",
    description:
      "상가철거부터 폐업철거, 원상복구까지 현장에 필요한 철거 서비스를 확인하세요.",
    url: "https://www.thesavecompany.com",
    type: "website",
    locale: "ko_KR",
    siteName: "더세이브 철거",

    images: [
      {
        url: "/og-image.png",
        width: 1536,
        height: 1024,
        alt: "더세이브 철거 010-2269-8352",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "더세이브 철거",
    description:
      "상가철거부터 폐업철거, 원상복구까지 현장에 필요한 철거 서비스를 확인하세요.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}