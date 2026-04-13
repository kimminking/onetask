const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("onetask_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type Urgency = "high" | "normal" | "low";
export type Status = "todo" | "done";

export interface Task {
  id: number;
  title: string;
  category: string | null;
  urgency: Urgency;
  order: number;
  status: Status;
  done_at: string | null;
  due_at: string | null;
  created_at: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  event_date: string;   // "YYYY-MM-DD"
  event_time: string | null; // "HH:MM"
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface JapaneseWord {
  id: number;
  expression: string;
  reading: string;
  meaning: string;
  jlpt_level: string | null;
  example_jp: string | null;
  example_ko: string | null;
  state: number;
  reps: number;
  lapses: number;
  due: string;
  is_due: boolean;
  is_favorite: boolean;
}

export interface EnglishWord {
  id: number;
  word: string;
  meaning: string;
  level: string | null;
  example_en: string | null;
  example_ko: string | null;
  state: number;
  reps: number;
  lapses: number;
  due: string;
  is_due: boolean;
  is_favorite: boolean;
}

export interface Word {
  id: number;
  chinese: string;
  pinyin: string;
  meaning: string;
  example_zh: string | null;
  example_ko: string | null;
  example_pinyin: string | null;
  audio_path: string | null;
  image_path: string | null;
  hsk_level: number | null;
  created_at: string;
  state: number;       // 0=New 1=Learning 2=Review 3=Relearning
  reps: number;
  lapses: number;
  due: string;
  is_due: boolean;
  is_favorite: boolean;
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    ...options,
  });
  if (res.status === 401) {
    localStorage.removeItem("onetask_token");
    localStorage.removeItem("onetask_user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const authApi = {
  status: () => fetch(`${BASE}/auth/status`).then((r) => r.json()) as Promise<{ has_users: boolean }>,
  login: (username: string, password: string) =>
    fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(async (r) => {
      if (!r.ok) throw new Error((await r.json()).detail || "로그인 실패");
      return r.json() as Promise<{ access_token: string; is_master: boolean; username: string }>;
    }),
  signup: (username: string, password: string) =>
    fetch(`${BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(async (r) => {
      if (!r.ok) throw new Error((await r.json()).detail || "가입 실패");
      return r.json() as Promise<{ access_token: string; is_master: boolean; username: string }>;
    }),
};

export const api = {
  tasks: {
    list: (status?: Status) =>
      req<Task[]>(`/tasks/${status ? `?status=${status}` : ""}`),
    create: (data: { title: string; category?: string; urgency?: Urgency; due_at?: string }) =>
      req<Task>("/tasks/", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Task>) =>
      req<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) =>
      req<{ ok: boolean }>(`/tasks/${id}`, { method: "DELETE" }),
    reorder: (ids: number[]) =>
      req<{ ok: boolean }>("/tasks/reorder", {
        method: "POST",
        body: JSON.stringify({ ids }),
      }),
    history: (year: number, month: number) =>
      req<Task[]>(`/tasks/history?year=${year}&month=${month}`),
    scheduled: (year: number, month: number) =>
      req<Task[]>(`/tasks/scheduled?year=${year}&month=${month}`),
  },
  calendarEvents: {
    list: (year: number, month: number) =>
      req<CalendarEvent[]>(`/calendar-events/?year=${year}&month=${month}`),
    create: (data: { title: string; event_date: string; event_time?: string }) =>
      req<CalendarEvent>("/calendar-events/", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: { title?: string; event_date?: string; event_time?: string }) =>
      req<CalendarEvent>(`/calendar-events/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) =>
      req<{ ok: boolean }>(`/calendar-events/${id}`, { method: "DELETE" }),
  },
  categories: {
    list: () => req<Category[]>("/categories/"),
    create: (name: string) =>
      req<Category>("/categories/", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    delete: (id: number) =>
      req<{ ok: boolean }>(`/categories/${id}`, { method: "DELETE" }),
  },
  words: {
    list: (hsk_level?: number) => req<Word[]>(`/words/${hsk_level ? `?hsk_level=${hsk_level}` : ""}`),
    due: (hsk_level?: number) => req<Word[]>(`/words/due${hsk_level ? `?hsk_level=${hsk_level}` : ""}`),
    stats: (hsk_level?: number) => req<{ total: number; reviewed: number; new: number; due: number; today: number }>(`/words/stats${hsk_level ? `?hsk_level=${hsk_level}` : ""}`),
    today: (hsk_level?: number) => req<Word[]>(`/words/today${hsk_level ? `?hsk_level=${hsk_level}` : ""}`),
    create: (data: { chinese: string; pinyin: string; meaning: string; example_zh?: string; example_ko?: string }) =>
      req<Word>("/words/", { method: "POST", body: JSON.stringify(data) }),
    review: (id: number, knew: boolean) =>
      req<{ word_id: number; knew: boolean; next_due: string; state: number; reps: number }>(
        `/words/${id}/review`,
        { method: "POST", body: JSON.stringify({ knew }) }
      ),
    daily: () => req<Word[]>("/words/daily"),
    favorite: (id: number) =>
      req<{ word_id: number; is_favorite: boolean }>(`/words/${id}/favorite`, { method: "POST" }),
    favorites: (hsk_level?: number) =>
      req<Word[]>(`/words/favorites${hsk_level ? `?hsk_level=${hsk_level}` : ""}`),
    delete: (id: number) =>
      req<{ ok: boolean }>(`/words/${id}`, { method: "DELETE" }),
  },
  stats: {
    overview: () => req<{
      zh_streak: number; en_streak: number; ja_streak: number;
      zh_today: number; en_today: number; ja_today: number;
      zh_levels: { level: string; total: number; reviewed: number; mastered: number }[];
      en_levels: { level: string; total: number; reviewed: number; mastered: number }[];
      ja_levels: { level: string; total: number; reviewed: number; mastered: number }[];
    }>("/stats/overview"),
    history: (days = 90) => req<{ date: string; count: number }[]>(`/stats/history?days=${days}`),
  },
  englishWords: {
    list: (level?: string) => req<EnglishWord[]>(`/english-words/${level ? `?level=${level}` : ""}`),
    due: (level?: string) => req<EnglishWord[]>(`/english-words/due${level ? `?level=${level}` : ""}`),
    stats: (level?: string) => req<{ total: number; reviewed: number; new: number; due: number; today: number }>(`/english-words/stats${level ? `?level=${level}` : ""}`),
    today: (level?: string) => req<EnglishWord[]>(`/english-words/today${level ? `?level=${level}` : ""}`),
    review: (id: number, knew: boolean) =>
      req<{ word_id: number; knew: boolean; next_due: string; state: number; reps: number }>(
        `/english-words/${id}/review`,
        { method: "POST", body: JSON.stringify({ knew }) }
      ),
    daily: () => req<EnglishWord[]>("/english-words/daily"),
    favorite: (id: number) =>
      req<{ word_id: number; is_favorite: boolean }>(`/english-words/${id}/favorite`, { method: "POST" }),
    favorites: (level?: string) =>
      req<EnglishWord[]>(`/english-words/favorites${level ? `?level=${level}` : ""}`),
  },
  push: {
    test: (title?: string, body?: string) =>
      req<{ sent: number }>("/push/test", {
        method: "POST",
        body: JSON.stringify({ title: title ?? "onetask 테스트", body: body ?? "푸시 알림이 정상 작동합니다!" }),
      }),
  },
  admin: {
    overview: () => req<{
      words: {
        zh: { total: number; by_level: Record<string, number>; reviewed: number };
        en: { total: number; by_level: Record<string, number>; reviewed: number };
        ja: { total: number; by_level: Record<string, number>; reviewed: number };
      };
      tasks: { todo: number; done: number };
      calendar: { total: number };
      users: { id: number; username: string; is_master: boolean }[];
    }>("/admin/overview"),
  },
  japaneseWords: {
    list: (jlpt_level?: string) => req<JapaneseWord[]>(`/japanese-words/list${jlpt_level ? `?jlpt_level=${jlpt_level}` : ""}`),
    due: (jlpt_level?: string) => req<JapaneseWord[]>(`/japanese-words/due${jlpt_level ? `?jlpt_level=${jlpt_level}` : ""}`),
    stats: (jlpt_level?: string) => req<{ total: number; reviewed: number; new: number; due: number; today: number }>(`/japanese-words/stats${jlpt_level ? `?jlpt_level=${jlpt_level}` : ""}`),
    today: (jlpt_level?: string) => req<JapaneseWord[]>(`/japanese-words/today${jlpt_level ? `?jlpt_level=${jlpt_level}` : ""}`),
    daily: () => req<JapaneseWord[]>("/japanese-words/daily"),
    review: (id: number, knew: boolean) =>
      req<{ word_id: number; knew: boolean; next_due: string; state: number; reps: number }>(
        `/japanese-words/${id}/review`,
        { method: "POST", body: JSON.stringify({ knew }) }
      ),
    favorite: (id: number) =>
      req<{ word_id: number; is_favorite: boolean }>(`/japanese-words/${id}/favorite`, { method: "POST" }),
    favorites: (jlpt_level?: string) =>
      req<JapaneseWord[]>(`/japanese-words/favorites${jlpt_level ? `?jlpt_level=${jlpt_level}` : ""}`),
  },
};
