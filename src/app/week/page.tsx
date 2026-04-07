"use client";

import Link from "next/link";
import { usePlanner } from "@/context/PlannerContext";
import { getWeekDates, formatDateShort, getPriorityColor } from "@/lib/utils";
import WeekCalendar from "@/components/WeekCalendar";

export default function WeekPage() {
  const { tasks } = usePlanner();
  const weekDates = getWeekDates();

  const unassignedP0 = tasks.filter(
    (t) => t.priority === "P0" && !t.assignedDate
  );

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Week</h1>
          <p className="mt-1 text-slate-500">
            {formatDateShort(weekDates[0])} – {formatDateShort(weekDates[4])}
          </p>
        </div>
        <Link
          href="/add?tab=event"
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Add Event
        </Link>
      </div>

      {unassignedP0.length > 0 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-amber-800">
              Unassigned P0:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {unassignedP0.map((task) => (
                <span
                  key={task.id}
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getPriorityColor("P0")}`}
                >
                  {task.title}
                </span>
              ))}
            </div>
            <Link
              href="/"
              className="ml-auto text-xs font-medium text-amber-700 underline"
            >
              Assign in Inbox
            </Link>
          </div>
        </div>
      )}

      <WeekCalendar />
    </div>
  );
}
