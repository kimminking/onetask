"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { api, Word } from "@/lib/api";

type Mode = "select" | "home" | "review" | "browse";
type Phase = "question" | "answer";

const STATE_LABEL: Record<number, string> = { 0: "신규", 1: "학습중", 2: "복습", 3: "다시학습" };
const STATE_COLOR: Record<number, string> = {
  0: "text-stone-500", 1: "text-yellow-500", 2: "text-jeok-400", 3: "text-orange-400",
};

function formatDue(due: string): string {
  const diff = new Date(due).getTime() - Date.now();
  const mins = Math.round(diff / 60000);
  if (mins <= 0) return "지금";
  if (mins < 60) return `${mins}분 후`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}시간 후`;
  return `${Math.round(hrs / 24)}일 후`;
}

const HSK_LEVELS = [
  { value: 1, label: "HSK 1", locked: true,  desc: "초급" },
  { value: 2, label: "HSK 2", locked: true,  desc: "초급" },
  { value: 3, label: "HSK 3", locked: false, desc: "초중급" },
  { value: 4, label: "HSK 4", locked: false, desc: "중급" },
  { value: 5, label: "HSK 5", locked: false, desc: "중고급" },
  { value: 6, label: "HSK 6", locked: false, desc: "고급" },
];

export default function WordsPage() {
  const [mode, setMode] = useState<Mode>("select");
  const [selectedLevel, setSelectedLevel] = useState<number>(3);
  const [stats, setStats] = useState({ total: 0, reviewed: 0, new: 0, due: 0 });
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [dueWords, setDueWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async (level: number) => {
    setLoading(true);
    const [s, w] = await Promise.all([api.words.stats(level), api.words.list(level)]);
    setStats(s);
    setAllWords(w);
    setLoading(false);
  }, []);

  const selectLevel = (level: number) => {
    setSelectedLevel(level);
    setMode("home");
    reload(level);
  };

  const startReview = async () => {
    const due = await api.words.due(selectedLevel);
    setDueWords(due);
    setMode("review");
  };

  if (mode === "review") {
    return <ReviewSession words={dueWords} onDone={() => { reload(selectedLevel); setMode("home"); }} onBack={() => setMode("home")} />;
  }
  if (mode === "browse") {
    return <BrowseMode words={allWords} onBack={() => setMode("home")} />;
  }

  /* ── 레벨 선택 화면 ── */
  if (mode === "select") {
    return (
      <div className="flex flex-col min-h-dvh bg-dark-400">
        <div className="px-6 pt-14 pb-6 bg-dark-300 border-b border-white/5">
          <div className="flex items-center justify-between mb-5">
            <Link href="/" className="text-stone-600 text-xs hover:text-stone-400 transition-colors">← 홈</Link>
            <Link href="/image-test" className="text-xs text-jeok-400 hover:text-jeok-300 border border-jeok-800 px-3 py-1.5 rounded-full transition-colors">
              🎨 이미지 테스트
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-stone-100">단어 암기장</h1>
          <p className="text-stone-500 text-sm mt-1">레벨을 선택하세요</p>
        </div>

        <div className="flex-1 px-4 py-6 flex flex-col gap-3">
          {HSK_LEVELS.map(({ value, label, locked, desc }) => (
            <button
              key={value}
              onClick={() => !locked && selectLevel(value)}
              disabled={locked}
              className={`flex items-center gap-4 px-5 py-5 rounded-2xl border transition-all text-left
                ${locked
                  ? "bg-dark-300 border-white/5 opacity-40 cursor-not-allowed"
                  : "bg-dark-200 border-white/5 hover:border-jeok-700 hover:bg-dark-100 active:scale-[0.98]"
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                ${locked ? "bg-dark-200 text-stone-600" : "bg-jeok-900 text-jeok-400"}`}
              >
                {value}
              </div>
              <div className="flex-1">
                <p className={`font-bold text-base ${locked ? "text-stone-600" : "text-stone-100"}`}>{label}</p>
                <p className={`text-xs mt-0.5 ${locked ? "text-stone-700" : "text-stone-500"}`}>{desc}</p>
              </div>
              {locked
                ? <span className="text-stone-700 text-lg">🔒</span>
                : <span className="text-stone-600 text-sm">→</span>
              }
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── 레벨 홈 화면 ── */
  return (
    <div className="flex flex-col min-h-dvh bg-dark-400">
      <div className="px-6 pt-14 pb-6 bg-dark-300 border-b border-white/5">
        <button
          onClick={() => setMode("select")}
          className="text-stone-600 text-xs mb-5 flex items-center gap-1 hover:text-stone-400 transition-colors"
        >
          ← 레벨 선택
        </button>
        <h1 className="text-2xl font-bold text-stone-100">HSK {selectedLevel}</h1>
        <p className="text-stone-500 text-xs mt-1">{HSK_LEVELS.find(l => l.value === selectedLevel)?.desc}</p>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-3">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-stone-600 text-sm">불러오는 중...</div>
        ) : (
          <>
            <button
              onClick={startReview}
              disabled={stats.due === 0}
              className="w-full py-6 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg
                bg-jeok-600 hover:bg-jeok-500 text-white shadow-jeok-900/40
                disabled:bg-dark-200 disabled:text-stone-600 disabled:shadow-none disabled:border disabled:border-white/5"
            >
              {stats.due > 0 ? "오늘 복습 시작" : "오늘 복습 완료 🎉"}
            </button>

            <button
              onClick={() => setMode("browse")}
              className="w-full py-4 bg-dark-200 hover:bg-dark-100 border border-white/5 text-stone-400 hover:text-stone-200 rounded-2xl font-medium text-sm transition-all"
            >
              단어 목록 보기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── 스와이프 카드 ────────────────────────────────────────────── */
const SWIPE_THRESHOLD = 100;

function SwipeCard({
  word,
  flipped,
  onFlip,
  onSwipe,
}: {
  word: Word;
  flipped: boolean;
  onFlip: () => void;
  onSwipe: (knew: boolean) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-18, 18]);
  const rightOpacity = useTransform(x, [20, SWIPE_THRESHOLD], [0, 1]);
  const leftOpacity  = useTransform(x, [-SWIPE_THRESHOLD, -20], [1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      animate(x, 600, { duration: 0.25 });
      setTimeout(() => onSwipe(true), 200);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      animate(x, -600, { duration: 0.25 });
      setTimeout(() => onSwipe(false), 200);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    }
  };

  return (
    <div className="relative w-full select-none" style={{ minHeight: "320px" }}>
      {/* 오른쪽 힌트 (알았음) */}
      <motion.div
        style={{ opacity: rightOpacity }}
        className="absolute inset-0 rounded-3xl border-2 border-green-500 bg-green-950/30 flex items-center justify-center z-0 pointer-events-none"
      >
        <span className="text-green-400 text-3xl font-black tracking-widest rotate-[-12deg] border-4 border-green-500 px-4 py-1 rounded-xl">알았음</span>
      </motion.div>

      {/* 왼쪽 힌트 (몰랐음) */}
      <motion.div
        style={{ opacity: leftOpacity }}
        className="absolute inset-0 rounded-3xl border-2 border-jeok-500 bg-jeok-950/30 flex items-center justify-center z-0 pointer-events-none"
      >
        <span className="text-jeok-400 text-3xl font-black tracking-widest rotate-[12deg] border-4 border-jeok-500 px-4 py-1 rounded-xl">몰랐음</span>
      </motion.div>

      {/* 드래그 카드 */}
      <motion.div
        drag="x"
        dragElastic={0.8}
        style={{ x, rotate, position: "relative", zIndex: 10 }}
        onDragEnd={handleDragEnd}
        onClick={onFlip}
        className="cursor-grab active:cursor-grabbing"
        whileTap={{ scale: 0.98 }}
      >
        <div style={{ perspective: "1200px" }}>
          <div
            className="relative w-full transition-transform duration-[380ms]"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              minHeight: "320px",
            }}
          >
            {/* 앞면 */}
            <div
              className="absolute inset-0 bg-dark-200 border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-3 p-8"
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="text-7xl font-bold text-stone-100 tracking-wider">{word.chinese}</p>
              <p className="text-xl text-stone-500 tracking-widest font-light">{word.pinyin}</p>
              <p className="text-xs text-stone-700 mt-3">탭해서 뒤집기 →</p>
            </div>

            {/* 뒷면 */}
            <div
              className="absolute inset-0 bg-dark-300 border border-jeok-900 rounded-3xl flex flex-col items-center justify-center gap-4 p-8"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <p className="text-3xl font-bold text-stone-100 text-center">{word.meaning}</p>
              <p className="text-stone-500 text-sm">{word.pinyin}</p>
              {word.example_zh && (
                <div className="w-full bg-dark-400 rounded-2xl px-4 py-3.5 space-y-1.5 mt-1">
                  <p className="text-stone-300 text-sm leading-relaxed text-center">{word.example_zh}</p>
                  {word.example_ko && (
                    <p className="text-stone-600 text-xs leading-relaxed text-center">{word.example_ko}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── 복습 세션 ─────────────────────────────────────────────── */
function ReviewSession({ words, onDone, onBack }: { words: Word[]; onDone: () => void; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [results, setResults] = useState({ knew: 0, missed: 0 });
  const [done, setDone] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cardKey, setCardKey] = useState(0);

  const current = words[index];
  const reveal = () => {
    setFlipped((f) => !f);
    if (phase === "question") setPhase("answer");
  };;

  const answer = async (knew: boolean) => {
    if (busy) return;
    setBusy(true);
    await api.words.review(current.id, knew);
    setResults((r) => ({ knew: r.knew + (knew ? 1 : 0), missed: r.missed + (knew ? 0 : 1) }));

    const next = index + 1;
    if (next >= words.length) { setDone(true); setBusy(false); return; }

    setTimeout(() => {
      setIndex(next);
      setPhase("question");
      setFlipped(false);
      setCardKey((k) => k + 1);
      setBusy(false);
    }, 280);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (phase === "question" && e.key === " ") { e.preventDefault(); reveal(); }
      if (!busy) {
        if (e.key === "ArrowRight" || e.key === "o") answer(true);
        if (e.key === "ArrowLeft"  || e.key === "x") answer(false);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [phase, index, busy]);

  if (done) {
    const total = results.knew + results.missed;
    const pct = Math.round((results.knew / total) * 100);
    return (
      <div className="flex flex-col min-h-dvh bg-dark-400 items-center justify-center px-6 gap-6">
        <p className="text-5xl">{pct >= 70 ? "🎉" : "💪"}</p>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-100">세션 완료</h2>
          <p className="text-stone-500 text-sm mt-1">오늘도 수고했어</p>
        </div>
        <div className="w-full bg-dark-200 border border-white/5 rounded-3xl p-6 space-y-3">
          <Row label="알았음" value={`${results.knew}개`} color="text-green-400" />
          <Row label="몰랐음" value={`${results.missed}개`} color="text-jeok-400" />
          <div className="border-t border-white/5 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-stone-500 text-sm">정답률</span>
              <span className="text-2xl font-bold text-stone-100">{pct}%</span>
            </div>
          </div>
        </div>
        <button onClick={onDone} className="w-full py-4 bg-jeok-600 hover:bg-jeok-500 text-white rounded-2xl font-bold transition-colors">
          완료
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-dark-400">
      {/* 상단 바 */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={onBack} className="text-stone-600 hover:text-stone-400 transition-colors text-lg">✕</button>
        <div className="flex-1 h-1.5 bg-dark-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-jeok-500 rounded-full transition-all duration-500"
            style={{ width: `${(index / words.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 카드 */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-5">
        <SwipeCard
          key={cardKey}
          word={current}
          flipped={flipped}
          onFlip={reveal}
          onSwipe={answer}
        />

        {/* 힌트 버튼 */}
        {phase === "question" ? (
          <button
            onClick={reveal}
            className="w-full py-4 bg-dark-200 border border-white/5 hover:border-stone-700 text-stone-400 hover:text-stone-200 rounded-2xl font-semibold transition-all"
          >
            뒤집기
          </button>
        ) : (
          <div className="w-full grid grid-cols-2 gap-3">
            <button
              onClick={() => answer(false)}
              className="py-4 bg-dark-200 border border-jeok-800 hover:bg-jeok-950 text-jeok-400 rounded-2xl font-bold transition-all active:scale-95"
            >
              ✕ 몰랐음
            </button>
            <button
              onClick={() => answer(true)}
              className="py-4 bg-dark-200 border border-green-900 hover:bg-green-950 text-green-400 rounded-2xl font-bold transition-all active:scale-95"
            >
              ○ 알았음
            </button>
          </div>
        )}
        <p className="text-xs text-stone-700">← 스와이프 몰랐음 · 알았음 스와이프 →</p>
      </div>
    </div>
  );
}

/* ── 전체 목록 ─────────────────────────────────────────────── */
function BrowseMode({ words, onBack }: { words: Word[]; onBack: () => void }) {
  return (
    <div className="flex flex-col min-h-dvh bg-dark-400">
      <div className="px-6 pt-14 pb-5 bg-dark-300 border-b border-white/5">
        <button onClick={onBack} className="text-stone-600 text-xs mb-4 flex items-center gap-1 hover:text-stone-400 transition-colors">
          ← 돌아가기
        </button>
        <h2 className="text-xl font-bold text-stone-100">전체 단어 <span className="text-stone-500 font-normal text-sm">{words.length}개</span></h2>
      </div>
      <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {words.map((w) => (
          <div key={w.id} className="bg-dark-200 border border-white/5 rounded-2xl px-5 py-4">
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-bold text-stone-100">{w.chinese}</span>
              <span className="text-sm text-stone-500 font-light">{w.pinyin}</span>
              <span className="ml-auto text-sm text-stone-300 font-medium">{w.meaning}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs font-medium ${STATE_COLOR[w.state]}`}>{STATE_LABEL[w.state]}</span>
              {w.reps > 0 && <span className="text-xs text-stone-700">· 복습 {w.reps}회</span>}
              {w.lapses > 0 && <span className="text-xs text-jeok-700">· 틀림 {w.lapses}회</span>}
              <span className="text-xs text-stone-700 ml-auto">{formatDue(w.due)}</span>
            </div>
            {w.example_zh && (
              <div className="mt-3 pt-3 border-t border-white/5 space-y-1">
                <p className="text-xs text-stone-500 leading-relaxed">{w.example_zh}</p>
                {w.example_ko && <p className="text-xs text-stone-700 leading-relaxed">{w.example_ko}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-stone-500 text-sm">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}
