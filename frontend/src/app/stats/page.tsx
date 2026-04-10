"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Overview = {
  zh_streak: number; en_streak: number;
  zh_today: number; en_today: number;
  zh_levels: { level: string; total: number; reviewed: number; mastered: number }[];
  en_levels: { level: string; total: number; reviewed: number; mastered: number }[];
};

function ProgressBar({ value, max, color = "bg-jeok-500" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-1.5 bg-dark-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function StatsPage() {
  const router = useRouter();
  const [data, setData] = useState<Overview | null>(null);
  const [tab, setTab] = useState<"zh" | "en">("zh");

  useEffect(() => {
    api.stats.overview().then(setData).catch(() => {});
  }, []);

  if (!data) return (
    <div className="flex min-h-dvh items-center justify-center bg-dark-400 text-stone-600 text-sm">불러오는 중...</div>
  );

  const levels = tab === "zh" ? data.zh_levels : data.en_levels;
  const streak = tab === "zh" ? data.zh_streak : data.en_streak;
  const today  = tab === "zh" ? data.zh_today  : data.en_today;
  const totalAll   = levels.reduce((s, l) => s + l.total, 0);
  const reviewedAll = levels.reduce((s, l) => s + l.reviewed, 0);
  const masteredAll = levels.reduce((s, l) => s + l.mastered, 0);

  return (
    <div className="flex flex-col min-h-dvh bg-dark-400">
      {/* 헤더 */}
      <div className="px-6 pt-10 pb-5 bg-dark-300 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}
            className="w-8 h-8 rounded-xl bg-dark-200 hover:bg-dark-100 flex items-center justify-center text-stone-400 hover:text-stone-200 transition-all">
            ←
          </button>
          <h1 className="text-2xl font-bold text-stone-200">학습 통계</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 space-y-4">
        {/* 언어 탭 */}
        <div className="flex bg-dark-200 rounded-2xl p-1 gap-1">
          {(["zh", "en"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === t ? "bg-jeok-600 text-white shadow-lg shadow-jeok-900/50" : "text-stone-500 hover:text-stone-300"}`}>
              {t === "zh" ? "중국어" : "영어"}
            </button>
          ))}
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dark-200 border border-white/5 rounded-2xl px-4 py-4 text-center">
            <p className="text-2xl font-bold text-jeok-400">{streak}</p>
            <p className="text-xs text-stone-500 mt-1">연속 학습일</p>
          </div>
          <div className="bg-dark-200 border border-white/5 rounded-2xl px-4 py-4 text-center">
            <p className="text-2xl font-bold text-green-400">{today}</p>
            <p className="text-xs text-stone-500 mt-1">오늘 복습</p>
          </div>
          <div className="bg-dark-200 border border-white/5 rounded-2xl px-4 py-4 text-center">
            <p className="text-2xl font-bold text-stone-200">{masteredAll}</p>
            <p className="text-xs text-stone-500 mt-1">완전 습득</p>
          </div>
        </div>

        {/* 전체 진행률 */}
        <div className="bg-dark-200 border border-white/5 rounded-2xl px-5 py-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-stone-200">전체 진행률</p>
            <p className="text-xs text-stone-500">{reviewedAll} / {totalAll}개</p>
          </div>
          <ProgressBar value={reviewedAll} max={totalAll} color="bg-jeok-500" />
          <div className="flex justify-between text-xs text-stone-600">
            <span>학습 시작 {Math.round((reviewedAll / (totalAll || 1)) * 100)}%</span>
            <span>완전 습득 {Math.round((masteredAll / (totalAll || 1)) * 100)}%</span>
          </div>
        </div>

        {/* 레벨별 진행률 */}
        <div className="bg-dark-200 border border-white/5 rounded-2xl px-5 py-4 space-y-4">
          <p className="text-sm font-semibold text-stone-200">레벨별 진행률</p>
          {levels.map((l) => (
            <div key={l.level} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-stone-300 font-medium">{l.level}</span>
                <div className="flex items-center gap-2 text-xs text-stone-600">
                  <span className="text-jeok-500">{l.reviewed}학습</span>
                  <span>·</span>
                  <span className="text-green-600">{l.mastered}습득</span>
                  <span>/ {l.total}</span>
                </div>
              </div>
              <div className="relative h-1.5 bg-dark-100 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-jeok-800 rounded-full transition-all duration-500"
                  style={{ width: `${(l.reviewed / (l.total || 1)) * 100}%` }} />
                <div className="absolute inset-y-0 left-0 bg-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${(l.mastered / (l.total || 1)) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
