"use client";

import { useState, useRef, useEffect } from "react";
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
  week,
}: {
  priority: "P0" | "P1" | "P2";
  tasks: Task[];
  week: string;
}) {
  const { dispatch } = usePlanner();
  const [newTitle, setNewTitle] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
        week,
        completed: false,
      },
    });
    setNewTitle("");
    // Keep focus so user can keep typing more tasks
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      dispatch({
        type: "UPDATE_TASK",
        payload: { id: taskId, priority },
      });
    }
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

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-lg border bg-white transition-colors ${
          dragOver
            ? "border-blue-400 bg-blue-50/50 shadow-inner"
            : "border-slate-200"
        }`}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && dragOver && (
          <div className="px-3 py-4 text-center text-sm text-blue-500">
            Drop here to set as {priority}
          </div>
        )}

        {/* Add row — Enter creates task and keeps focus for next one */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-4" />
          <div className="h-4 w-4" />
          <input
            ref={inputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTask();
              }
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
