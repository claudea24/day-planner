"use client";

import { useState } from "react";
import Link from "next/link";
import { usePlanner } from "@/context/PlannerContext";
import {
  getWeekDates,
  getAdjacentDate,
  formatDateShort,
  getPriorityColor,
  getTodayString,
} from "@/lib/utils";
import WeekCalendar from "@/components/WeekCalendar";

export default function WeekPage() {
  const { tasks } = usePlanner();
  const [weekStart, setWeekStart] = useState<string | undefined>(undefined);

  const weekDates = getWeekDates(weekStart);
  const currentMonday = weekDates[0];

  const unassignedP0 = tasks.filter(
    (t) => t.priority === "P0" && !t.assignedDate
  );

  function prevWeek() {
    setWeekStart(getAdjacentDate(currentMonday, -7));
  }

  function nextWeek() {
    setWeekStart(getAdjacentDate(currentMonday, 7));
  }

  function goToday() {
    setWeekStart(undefined);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Week</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={prevWeek}
              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              aria-label="Previous week"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={goToday}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Today
            </button>
            <button
              onClick={nextWeek}
              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              aria-label="Next week"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <span className="text-sm text-slate-500">
            {formatDateShort(weekDates[0])} – {formatDateShort(weekDates[6])}
          </span>
        </div>
        <Link
          href="/add?tab=event"
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Add Event
        </Link>
      </div>

      {unassignedP0.length > 0 && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-800">
              Unassigned P0:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {unassignedP0.map((task) => (
                <span
                  key={task.id}
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getPriorityColor("P0")}`}
                >
                  {task.title}
                </span>
              ))}
            </div>
            <Link
              href="/"
              className="ml-auto text-xs font-medium text-amber-700 underline"
            >
              Assign
            </Link>
          </div>
        </div>
      )}

      <WeekCalendar weekStart={weekStart} />
    </div>
  );
}
