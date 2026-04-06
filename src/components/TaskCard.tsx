"use client";

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
  const weekDates = getWeekDates();

  return (
    <div
      className={`group flex items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() =>
          dispatch({
            type: "UPDATE_TASK",
            payload: { id: task.id, completed: !task.completed },
          })
        }
        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />

      <div className="flex-1 min-w-0">
        <span
          className={`text-sm font-medium ${
            task.completed
              ? "text-slate-400 line-through"
              : "text-slate-900"
          }`}
        >
          {task.title}
        </span>
        {task.description && (
          <p className="mt-0.5 truncate text-xs text-slate-400">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {task.priority === "P0" && (
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
            className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="">No day</option>
            {weekDates.map((d) => (
              <option key={d} value={d}>
                {getDayLabel(d)}
              </option>
            ))}
          </select>
        )}

        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getCategoryColor(task.category)}`}
        >
          {task.category}
        </span>

        <button
          onClick={() =>
            dispatch({
              type: "UPDATE_TASK",
              payload: { id: task.id, priority: cyclePriority(task.priority) },
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
          className="rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
          aria-label="Delete task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
