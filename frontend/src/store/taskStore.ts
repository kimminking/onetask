import { create } from "zustand";
import { api, Task, Category, Urgency, Status } from "@/lib/api";

interface TaskStore {
  tasks: Task[];
  categories: Category[];
  loading: boolean;

  fetchAll: () => Promise<void>;
  addTask: (title: string, category?: string, urgency?: Urgency) => Promise<void>;
  toggleDone: (id: number, current: Status) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  reorderTasks: (ids: number[]) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  categories: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [tasks, categories] = await Promise.all([
      api.tasks.list(),
      api.categories.list(),
    ]);
    set({ tasks, categories, loading: false });
  },

  addTask: async (title, category, urgency = "normal") => {
    const task = await api.tasks.create({ title, category, urgency });
    set((s) => ({ tasks: [...s.tasks, task] }));
  },

  toggleDone: async (id, current) => {
    const next: Status = current === "done" ? "todo" : "done";
    const updated = await api.tasks.update(id, { status: next });
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? updated : t)) }));
  },

  deleteTask: async (id) => {
    await api.tasks.delete(id);
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  },

  reorderTasks: async (ids) => {
    await api.tasks.reorder(ids);
    const ordered = ids.map((id) => get().tasks.find((t) => t.id === id)!);
    set({ tasks: ordered });
  },

  addCategory: async (name) => {
    const cat = await api.categories.create(name);
    set((s) => ({ categories: [...s.categories, cat] }));
  },

  deleteCategory: async (id) => {
    await api.categories.delete(id);
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
  },
}));
