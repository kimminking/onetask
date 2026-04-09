"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, Urgency } from "@/lib/api";
import { useTaskStore } from "@/store/taskStore";

const URGENCY_BAR: Record<Urgency, string> = {
  high:   "border-l-[3px] border-red-500",
  normal: "border-l-[3px] border-jeok-700",
  low:    "border-l-[3px] border-stone-700",
};

export default function TaskItem({ task }: { task: Task }) {
  const { toggleDone, deleteTask } = useTaskStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const isDone = task.status === "done";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-dark-200 border border-stone-800 rounded-2xl px-4 py-3.5 ${URGENCY_BAR[task.urgency]} ${isDone ? "opacity-50" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing active:scale-75 text-stone-700 hover:text-stone-500 touch-none flex-shrink-0 text-lg leading-none"
        tabIndex={-1}
      >
        ⠿
      </button>

      <button
        onClick={() => toggleDone(task.id, task.status)}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          isDone
            ? "bg-jeok-600 border-jeok-600"
            : "border-stone-600 hover:border-jeok-500"
        }`}
      >
        {isDone && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {task.urgency === "high" && !isDone && (
            <span className="text-xs text-red-500">🔥</span>
          )}
          <span className={`text-sm leading-snug ${isDone ? "line-through text-stone-600" : "text-stone-200"}`}>
            {task.title}
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap mt-0.5">
          {task.category && (
            <span className="text-[11px] text-jeok-400 bg-jeok-900 px-2 py-0.5 rounded-full">
              {task.category}
            </span>
          )}
          {task.due_at && (
            <span className="text-[11px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded-full">
              🗓 {new Date(task.due_at).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })}{" "}
              {new Date(task.due_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => deleteTask(task.id)}
        className="text-stone-700 hover:text-red-500 flex-shrink-0 transition-colors text-sm"
        tabIndex={-1}
      >
        ✕
      </button>
    </div>
  );
}
