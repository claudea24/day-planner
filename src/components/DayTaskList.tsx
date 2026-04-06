"use client";

import { Task } from "@/lib/types";
import { usePlanner } from "@/context/PlannerContext";
import { getCategoryColor } from "@/lib/utils";

export default function DayTaskList({ tasks }: { tasks: Task[] }) {
  const { dispatch } = usePlanner();

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
        No tasks assigned to this day
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-sm ${
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
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(task.category)}`}
          >
            {task.category}
          </span>
        </div>
      ))}
    </div>
  );
}
