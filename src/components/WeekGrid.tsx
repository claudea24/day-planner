"use client";

import Link from "next/link";
import { usePlanner } from "@/context/PlannerContext";
import {
  getWeekDates,
  getTodayString,
  getDayLabel,
  formatTime,
  getCategoryDot,
  getPriorityDot,
} from "@/lib/utils";

export default function WeekGrid() {
  const { tasks, events } = usePlanner();
  const weekDates = getWeekDates();
  const today = getTodayString();

  return (
    <div className="grid grid-cols-5 gap-2">
      {weekDates.map((date) => {
        const dayEvents = events
          .filter((e) => e.date === date)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
        const dayTasks = tasks.filter(
          (t) => t.assignedDate === date && t.priority === "P0"
        );
        const isToday = date === today;
        const dayNum = new Date(date + "T00:00:00").getDate();

        return (
          <Link
            key={date}
            href={`/day/${date}`}
            className={`group flex min-h-[180px] flex-col rounded-xl border p-3 transition-shadow hover:shadow-md ${
              isToday
                ? "border-blue-300 bg-blue-50/50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase text-slate-400">
                {getDayLabel(date)}
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

            {dayEvents.length > 0 && (
              <div className="mb-2 flex flex-col gap-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-1.5 rounded bg-slate-50 px-1.5 py-1"
                  >
                    <div
                      className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${getCategoryDot(event.category)}`}
                    />
                    <span className="truncate text-xs text-slate-600">
                      {formatTime(event.startTime)}
                    </span>
                    <span className="truncate text-xs font-medium text-slate-700">
                      {event.title}
                    </span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <span className="px-1.5 text-xs text-slate-400">
                    +{dayEvents.length - 3} more
                  </span>
                )}
              </div>
            )}

            {dayTasks.length > 0 && (
              <div className="flex flex-col gap-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-1.5 px-1.5"
                  >
                    <div
                      className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${getPriorityDot(task.priority)}`}
                    />
                    <span
                      className={`truncate text-xs ${
                        task.completed
                          ? "text-slate-400 line-through"
                          : "text-slate-700"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <span className="px-1.5 text-xs text-slate-400">
                    +{dayTasks.length - 3} more
                  </span>
                )}
              </div>
            )}

            {dayEvents.length === 0 && dayTasks.length === 0 && (
              <span className="px-1.5 text-xs text-slate-300">Empty</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
