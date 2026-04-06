"use client";

import { Task } from "@/lib/types";
import { getPriorityColor } from "@/lib/utils";
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
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
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

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-4 text-center text-sm text-slate-400">
          No {priority} tasks
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
