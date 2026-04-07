"use client";

import { useState, useRef, useEffect } from "react";
import { Task } from "@/lib/types";
import {
  getCategoryColor,
  getPriorityColor,
  cyclePriority,
  getWeekDates,
  getDayLabel,
} from "@/lib/utils";
import { usePlanner } from "@/context/PlannerContext";

export default function TaskCard({ task }: { task: Task }) {
  const { dispatch } = usePlanner();
  const weekDates = getWeekDates(task.week);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  function saveTitle() {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) {
      dispatch({
        type: "UPDATE_TASK",
        payload: { id: task.id, title: trimmed },
      });
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
        (e.currentTarget as HTMLElement).style.opacity = "0.4";
      }}
      onDragEnd={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "";
      }}
      className={`group flex items-center gap-2 border-b border-slate-100 px-3 py-2 transition-colors hover:bg-slate-50 ${
        task.completed ? "opacity-50" : ""
      }`}
    >
      {/* Drag handle */}
      <div className="flex w-4 cursor-grab flex-col items-center gap-0.5 opacity-0 group-hover:opacity-40">
        <div className="flex gap-0.5">
          <div className="h-1 w-1 rounded-full bg-slate-400" />
          <div className="h-1 w-1 rounded-full bg-slate-400" />
        </div>
        <div className="flex gap-0.5">
          <div className="h-1 w-1 rounded-full bg-slate-400" />
          <div className="h-1 w-1 rounded-full bg-slate-400" />
        </div>
      </div>

      <input
        type="checkbox"
        checked={task.completed}
        onChange={() =>
          dispatch({
            type: "UPDATE_TASK",
            payload: { id: task.id, completed: !task.completed },
          })
        }
        className="h-4 w-4 flex-shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />

      {/* Editable title */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveTitle();
              if (e.key === "Escape") {
                setEditTitle(task.title);
                setIsEditing(false);
              }
            }}
            className="w-full border-none bg-transparent py-0 text-sm text-slate-900 outline-none focus:ring-0"
          />
        ) : (
          <span
            onClick={() => !task.completed && setIsEditing(true)}
            className={`block cursor-text truncate text-sm ${
              task.completed
                ? "text-slate-400 line-through"
                : "text-slate-900"
            }`}
          >
            {task.title}
          </span>
        )}
      </div>

      <div className="flex flex-shrink-0 items-center gap-1.5">
        <select
            value={task.assignedDate || ""}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_TASK",
                payload: {
                  id: task.id,
                  assignedDate: e.target.value || undefined,
                },
              })
            }
            className="rounded border border-slate-200 px-1.5 py-0.5 text-xs text-slate-500 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Day</option>
            {weekDates.map((d) => (
              <option key={d} value={d}>
                {getDayLabel(d)}
              </option>
            ))}
          </select>

        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getCategoryColor(task.category)}`}
        >
          {task.category}
        </span>

        <button
          onClick={() =>
            dispatch({
              type: "UPDATE_TASK",
              payload: {
                id: task.id,
                priority: cyclePriority(task.priority),
              },
            })
          }
          className={`rounded-full border px-2 py-0.5 text-xs font-bold transition-colors hover:opacity-80 ${getPriorityColor(task.priority)}`}
          title="Click to change priority"
        >
          {task.priority}
        </button>

        <button
          onClick={() =>
            dispatch({ type: "DELETE_TASK", payload: { id: task.id } })
          }
          className="rounded p-0.5 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500 group-hover:text-slate-400"
          aria-label="Delete task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
