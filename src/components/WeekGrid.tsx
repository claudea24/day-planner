"use client";

import Link from "next/link";
import { useEvents } from "@/context/EventContext";
import { getWeekDates, getCategoryDot, getTodayString } from "@/lib/utils";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeekGrid() {
  const { events } = useEvents();
  const weekDates = getWeekDates();
  const today = getTodayString();

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDates.map((date, i) => {
        const dayEvents = events
          .filter((e) => e.date === date)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
        const isToday = date === today;
        const dayNum = new Date(date + "T00:00:00").getDate();

        return (
          <Link
            key={date}
            href={`/day/${date}`}
            className={`group flex min-h-[140px] flex-col rounded-xl border p-3 transition-shadow hover:shadow-md ${
              isToday
                ? "border-blue-300 bg-blue-50/50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase text-slate-400">
                {dayLabels[i]}
              </span>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                  isToday
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 group-hover:bg-slate-100"
                }`}
              >
                {dayNum}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-1.5">
              {dayEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-1.5 rounded px-1.5 py-0.5"
                >
                  <div
                    className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${getCategoryDot(event.category)}`}
                  />
                  <span className="truncate text-xs text-slate-700">
                    {event.title}
                  </span>
                </div>
              ))}
              {dayEvents.length > 3 && (
                <span className="px-1.5 text-xs text-slate-400">
                  +{dayEvents.length - 3} more
                </span>
              )}
              {dayEvents.length === 0 && (
                <span className="px-1.5 text-xs text-slate-300">
                  No events
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
