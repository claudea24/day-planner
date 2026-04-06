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
      <div className="rounded-xl border border-red-200 bg-red-50 py-12 text-center">
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
    );
  }

  return (
    <div>
      {/* Header with navigation */}
      <div className="mb-6 flex items-end justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/day/${prevDate}`}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            aria-label="Previous day"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {formatDate(date)}
            </h1>
          </div>
          <Link
            href={`/day/${nextDate}`}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            aria-label="Next day"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        <Link
          href={`/add?tab=event&date=${date}`}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Add Event
        </Link>
      </div>

      {/* Tasks section at top */}
      {tasks.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Tasks for today
          </h2>
          <DayTaskList tasks={tasks} />
        </div>
      )}

      {/* Hourly calendar grid */}
      <div>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Schedule
        </h2>
        <HourGrid events={events} date={date} />
      </div>
    </div>
  );
}
