"use client";

import Link from "next/link";
import { useEventsForDate } from "@/context/EventContext";
import { getTodayString, formatDate } from "@/lib/utils";
import DayTimeline from "@/components/DayTimeline";

export default function Home() {
  const today = getTodayString();
  const events = useEventsForDate(today);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Today</h1>
          <p className="mt-1 text-slate-500">{formatDate(today)}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/day/${today}`}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Day View
          </Link>
          <Link
            href={`/add?date=${today}`}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            + Add Event
          </Link>
        </div>
      </div>

      <DayTimeline events={events} />

      <div className="mt-8 text-center">
        <Link
          href="/week"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View this week &rarr;
        </Link>
      </div>
    </div>
  );
}
