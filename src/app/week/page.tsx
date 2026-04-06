"use client";

import Link from "next/link";
import { usePlanner } from "@/context/PlannerContext";
import { getWeekDates, formatDateShort, getPriorityColor } from "@/lib/utils";
import WeekGrid from "@/components/WeekGrid";

export default function WeekPage() {
  const { tasks } = usePlanner();
  const weekDates = getWeekDates();

  const unassignedP0 = tasks.filter(
    (t) => t.priority === "P0" && !t.assignedDate
  );

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Week Board</h1>
          <p className="mt-1 text-slate-500">
            {formatDateShort(weekDates[0])} – {formatDateShort(weekDates[4])}
          </p>
        </div>
        <Link
          href="/add"
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Add Item
        </Link>
      </div>

      {unassignedP0.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="mb-2 text-sm font-semibold text-amber-800">
            Unassigned P0 Tasks
          </h2>
          <p className="mb-3 text-xs text-amber-600">
            These must-do tasks need to be placed on a day.{" "}
            <Link href="/" className="font-medium underline">
              Go to Inbox
            </Link>{" "}
            to assign them.
          </p>
          <div className="flex flex-wrap gap-2">
            {unassignedP0.map((task) => (
              <span
                key={task.id}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${getPriorityColor("P0")}`}
              >
                {task.title}
              </span>
            ))}
          </div>
        </div>
      )}

      <WeekGrid />
    </div>
  );
}
