"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import { getPriorityColor } from "@/lib/utils";
import { usePlanner } from "@/context/PlannerContext";
import TaskCard from "./TaskCard";

const priorityLabels = {
  P0: "Must do this week",
  P1: "Should do if time allows",
  P2: "Can push to next week",
};

export default function PrioritySection({
  priority,
  tasks,
}: {
  priority: "P0" | "P1" | "P2";
  tasks: Task[];
}) {
  const { dispatch } = usePlanner();
  const [newTitle, setNewTitle] = useState("");

  function addTask() {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    dispatch({
      type: "ADD_TASK",
      payload: {
        id: crypto.randomUUID(),
        type: "task",
        title: trimmed,
        priority,
        category: "work",
        completed: false,
      },
    });
    setNewTitle("");
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 px-3">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getPriorityColor(priority)}`}
        >
          {priority}
        </span>
        <span className="text-sm font-medium text-slate-700">
          {priorityLabels[priority]}
        </span>
        <span className="text-xs text-slate-400">({tasks.length})</span>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {/* Notion-style add row */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-4" />
          <div className="h-4 w-4" />
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
            placeholder="Add a task..."
            className="flex-1 border-none bg-transparent py-0 text-sm text-slate-900 placeholder-slate-300 outline-none focus:ring-0"
          />
          {newTitle.trim() && (
            <button
              onClick={addTask}
              className="rounded px-2 py-0.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
