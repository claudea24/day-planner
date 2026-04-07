"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useTasksByPriorityForWeek,
  usePlanner,
} from "@/context/PlannerContext";
import {
  getMondayOfWeek,
  getAdjacentDate,
  formatDateShort,
  getWeekDates,
} from "@/lib/utils";
import PrioritySection from "@/components/PrioritySection";
import ClientOnly from "@/components/ClientOnly";

export default function Home() {
  return (
    <ClientOnly>
      <HomeContent />
    </ClientOnly>
  );
}

function HomeContent() {
  const [weekStart, setWeekStart] = useState(() => getMondayOfWeek());
  const { P0, P1, P2 } = useTasksByPriorityForWeek(weekStart);
  const { tasks, dispatch } = usePlanner();
  const weekDates = getWeekDates(weekStart);
  const totalTasks = P0.length + P1.length + P2.length;

  const prevWeekMonday = getAdjacentDate(weekStart, -7);
  const prevWeekHasTasks = tasks.some((t) => t.week === prevWeekMonday);

  function prevWeek() {
    setWeekStart(getAdjacentDate(weekStart, -7));
  }

  function nextWeek() {
    setWeekStart(getAdjacentDate(weekStart, 7));
  }

  function goThisWeek() {
    setWeekStart(getMondayOfWeek());
  }

  function copyFromPrevWeek() {
    dispatch({
      type: "COPY_TASKS_FROM_WEEK",
      payload: { fromWeek: prevWeekMonday, toWeek: weekStart },
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header with week navigation */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Todo List</h1>
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
              onClick={goThisWeek}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              This Week
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

        <div className="flex items-center gap-2">
          {totalTasks === 0 && prevWeekHasTasks && (
            <button
              onClick={copyFromPrevWeek}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Copy from last week
            </button>
          )}
          <Link
            href="/add"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            + Add Item
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <PrioritySection priority="P0" tasks={P0} week={weekStart} />
        <PrioritySection priority="P1" tasks={P1} week={weekStart} />
        <PrioritySection priority="P2" tasks={P2} week={weekStart} />
      </div>
    </div>
  );
}
