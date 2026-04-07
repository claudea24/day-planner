"use client";

import { Task } from "@/lib/types";
import { usePlanner } from "@/context/PlannerContext";
import { getCategoryColor, getPriorityColor } from "@/lib/utils";

export default function DayTaskList({ tasks }: { tasks: Task[] }) {
  const { dispatch } = usePlanner();

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tasks.map((task) => (
        <label
          key={task.id}
          className={`flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-1.5 shadow-sm transition-colors hover:bg-slate-50 ${
            task.completed ? "opacity-50" : ""
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
            className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-0"
          />
          <span
            className={`text-sm ${
              task.completed
                ? "text-slate-400 line-through"
                : "text-slate-900"
            }`}
          >
            {task.title}
          </span>
          <span
            className={`rounded-full border px-1.5 py-0 text-[10px] font-bold ${getPriorityColor(task.priority)}`}
          >
            {task.priority}
          </span>
        </label>
      ))}
    </div>
  );
}
