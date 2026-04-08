import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const a2g = localFont({
  src: [
    { path: "./fonts/에이투지체-3Light.ttf",    weight: "300" },
    { path: "./fonts/에이투지체-4Regular.ttf",  weight: "400" },
    { path: "./fonts/에이투지체-5Medium.ttf",   weight: "500" },
    { path: "./fonts/에이투지체-6SemiBold.ttf", weight: "600" },
    { path: "./fonts/에이투지체-7Bold.ttf",     weight: "700" },
    { path: "./fonts/에이투지체-8ExtraBold.ttf",weight: "800" },
  ],
  variable: "--font-a2g",
});

export const metadata: Metadata = {
  title: "onetask",
  description: "개인 학습 + 일정 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const dateStr = new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });

  return (
    <html lang="ko">
      <body className={`${a2g.variable} antialiased`}>
        <div className="lg:flex lg:min-h-dvh">
          {/* PC 전용 사이드바 */}
          <aside className="hidden lg:flex flex-col w-56 min-h-dvh bg-dark-300 border-r border-white/5 px-6 py-10 sticky top-0 shrink-0">
            <Link href="/">
              <p className="text-3xl font-bold text-jeok-400 tracking-tight">onetask</p>
              <p className="text-stone-600 text-xs mt-1">{dateStr}</p>
            </Link>
            <nav className="mt-10 flex flex-col gap-1">
              <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-dark-200 transition-all text-sm font-medium">
                📋 할일
              </Link>
              <Link href="/words" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-dark-200 transition-all text-sm font-medium">
                🀄 단어 암기장
              </Link>
            </nav>
          </aside>

          {/* 콘텐츠 */}
          <div id="app-frame">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
