"use client";

import Link from "next/link";
import { use } from "react";
import { useEventsForDate } from "@/context/EventContext";
import { formatDate, getAdjacentDate } from "@/lib/utils";
import DayTimeline from "@/components/DayTimeline";

export default function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  const events = useEventsForDate(date);
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
          &larr; Back to today
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/day/${prevDate}`}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50"
            aria-label="Previous day"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {formatDate(date)}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{date}</p>
          </div>
          <Link
            href={`/day/${nextDate}`}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50"
            aria-label="Next day"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
        <Link
          href={`/add?date=${date}`}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Add Event
        </Link>
      </div>

      <DayTimeline events={events} />
    </div>
  );
}
