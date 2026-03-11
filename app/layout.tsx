import "../global.css";
import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import Footer from "./components/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://code-heewan.dev"),
  applicationName: "Code-Heewan",
  title: {
    default: "Code-Heewan",
    template: "%s | Code-Heewan",
  },
  description: "Code-Heewan의 개인 웹사이트, 개발 블로그, 프로젝트를 소개합니다.",
  keywords: [
    "Code-Heewan",
    "개발자",
    "소프트웨어 엔지니어",
    "개발 블로그",
    "포트폴리오",
    "프로젝트",
    "기술 블로그",
  ],
  authors: [{ name: "Code-Heewan", url: "https://code-heewan.dev" }],
  creator: "Code-Heewan",
  publisher: "Code-Heewan",
  alternates: {
    canonical: "https://code-heewan.dev",
  },
  openGraph: {
    title: "Code-Heewan",
    description: "Code-Heewan의 개인 웹사이트, 개발 블로그, 프로젝트를 소개합니다.",
    url: "https://code-heewan.dev",
    siteName: "Code-Heewan",
    images: [
      {
        url: "https://code-heewan.dev/og.png",
        alt: "Code-Heewan - personal website",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "ko_KR",
    alternateLocale: ["en_US"],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Code-Heewan",
    description: "Code-Heewan의 개인 웹사이트, 개발 블로그, 프로젝트를 소개합니다.",
    card: "summary_large_image",
    images: ["https://code-heewan.dev/og.png"],
  },
  icons: {
    shortcut: "/favicon.png",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={[inter.variable, calSans.variable].join(" ")}>
      <head>
        <Analytics />
      </head>
      <body
        className={`bg-black ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined
          }`}
      >
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
