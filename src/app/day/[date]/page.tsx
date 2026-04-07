"use client";

import Link from "next/link";
import { use } from "react";
import {
  useEventsForDate,
  useTasksForDate,
} from "@/context/PlannerContext";
import { formatDate, getAdjacentDate } from "@/lib/utils";
import HourGrid from "@/components/HourGrid";
import DayTaskList from "@/components/DayTaskList";

export default function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  const events = useEventsForDate(date);
  const tasks = useTasksForDate(date);
  const prevDate = getAdjacentDate(date, -1);
  const nextDate = getAdjacentDate(date, 1);

  const isValidDate = !isNaN(new Date(date + "T00:00:00").getTime());

  if (!isValidDate) {
    return (
      <div className="flex h-[calc(100vh-49px)] items-center justify-center">
        <div className="rounded-xl border border-red-200 bg-red-50 px-8 py-12 text-center">
          <p className="text-red-600">
            &ldquo;{date}&rdquo; is not a valid date.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            &larr; Back to inbox
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-49px)] flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Link
              href={`/day/${prevDate}`}
              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              aria-label="Previous day"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href={`/day/${new Date().toISOString().split("T")[0]}`}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Today
            </Link>
            <Link
              href={`/day/${nextDate}`}
              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              aria-label="Next day"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <span className="text-sm font-medium text-slate-700">
            {formatDate(date)}
          </span>
        </div>
        <Link
          href={`/add?tab=event&date=${date}`}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Add Event
        </Link>
      </div>

      {/* Tasks strip at top */}
      {tasks.length > 0 && (
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2">
          <DayTaskList tasks={tasks} />
        </div>
      )}

      {/* Full-height hourly grid */}
      <div className="flex-1 overflow-hidden">
        <HourGrid events={events} date={date} />
      </div>
    </div>
  );
}
