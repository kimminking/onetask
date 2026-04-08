"use client";

import { useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { Urgency } from "@/lib/api";

export default function AddTaskForm() {
  const { addTask, categories } = useTaskStore();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("normal");
  const [open, setOpen] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addTask(title.trim(), category || undefined, urgency);
    setTitle("");
    setCategory("");
    setUrgency("normal");
    setOpen(false);
  };

  const cancel = () => {
    setTitle("");
    setCategory("");
    setUrgency("normal");
    setOpen(false);
  };

  return (
    <div className="mb-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-dark-200 border border-dashed border-stone-700 hover:border-jeok-600 rounded-2xl text-stone-500 hover:text-jeok-400 transition-all"
        >
          <span className="text-xl leading-none">+</span>
          <span className="text-sm font-medium">할일 추가</span>
        </button>
      ) : (
        <form onSubmit={submit} className="bg-dark-200 border border-stone-700 rounded-2xl p-4 space-y-4">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="할일을 입력하세요..."
            className="w-full text-stone-100 text-sm placeholder-stone-600 bg-transparent border-b border-stone-700 pb-2 outline-none focus:border-jeok-500 transition-colors"
          />

          <div className="flex flex-col gap-3">
            {categories.length > 0 && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-xs text-stone-300 border border-stone-700 rounded-full px-3 py-1.5 outline-none bg-dark-300 w-fit"
              >
                <option value="">카테고리 없음</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            )}

            <div className="flex gap-2">
              {([
                { value: "high" as Urgency, label: "🔥 급함", active: "bg-red-900 text-red-400 border-red-700", idle: "text-stone-500 border-stone-700" },
                { value: "normal" as Urgency, label: "보통", active: "bg-jeok-900 text-jeok-400 border-jeok-700", idle: "text-stone-500 border-stone-700" },
                { value: "low" as Urgency, label: "언젠간", active: "bg-stone-800 text-stone-300 border-stone-600", idle: "text-stone-600 border-stone-800" },
              ]).map(({ value, label, active, idle }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setUrgency(value)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${urgency === value ? active : idle}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={cancel}
              className="text-xs text-stone-600 hover:text-stone-400 px-3 py-1.5 rounded-full transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="text-xs bg-jeok-600 hover:bg-jeok-500 text-white px-5 py-1.5 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              추가
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
