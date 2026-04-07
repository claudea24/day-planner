"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlanner } from "@/context/PlannerContext";
import { Task } from "@/lib/types";
import { getMondayOfWeek } from "@/lib/utils";

const categories: Task["category"][] = ["work", "personal", "health", "other"];
const priorities: Task["priority"][] = ["P0", "P1", "P2"];

export default function TaskForm({ defaultDate }: { defaultDate?: string }) {
  const router = useRouter();
  const { dispatch } = usePlanner();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("P0");
  const [category, setCategory] = useState<Task["category"]>("work");
  const [assignedDate, setAssignedDate] = useState(defaultDate || "");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const task: Task = {
      id: crypto.randomUUID(),
      type: "task",
      title: title.trim(),
      priority,
      category,
      week: getMondayOfWeek(),
      assignedDate: assignedDate || undefined,
      description: description.trim() || undefined,
      completed: false,
    };

    dispatch({ type: "ADD_TASK", payload: task });
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="task-title" className="mb-1.5 block text-sm font-medium text-slate-700">
          Task Title
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ship auth API, Write blog post..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Priority
        </label>
        <div className="flex gap-2">
          {priorities.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                priority === p
                  ? p === "P0"
                    ? "border-red-300 bg-red-50 text-red-800"
                    : p === "P1"
                      ? "border-amber-300 bg-amber-50 text-amber-800"
                      : "border-slate-300 bg-slate-100 text-slate-700"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {p}
              <span className="ml-1 text-xs font-normal">
                {p === "P0"
                  ? "Must do"
                  : p === "P1"
                    ? "Should do"
                    : "Can push"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="task-category" className="mb-1.5 block text-sm font-medium text-slate-700">
          Category
        </label>
        <select
          id="task-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Task["category"])}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="task-date" className="mb-1.5 block text-sm font-medium text-slate-700">
          Assign to Day <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="task-date"
          type="date"
          value={assignedDate}
          onChange={(e) => setAssignedDate(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="task-desc" className="mb-1.5 block text-sm font-medium text-slate-700">
          Description <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Add details..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create Task
      </button>
    </form>
  );
}
