const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Word {
  id: number;
  chinese: string;
  pinyin: string;
  meaning: string;
  example_zh: string | null;
  example_ko: string | null;
  audio_path: string | null;
  created_at: string;
  state: number;       // 0=New 1=Learning 2=Review 3=Relearning
  reps: number;
  lapses: number;
  due: string;
  is_due: boolean;
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  tasks: {
    list: (status?: Status) =>
      req<Task[]>(`/tasks/${status ? `?status=${status}` : ""}`),
    create: (data: { title: string; category?: string; urgency?: Urgency }) =>
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
    delete: (id: number) =>
      req<{ ok: boolean }>(`/words/${id}`, { method: "DELETE" }),
  },
};
