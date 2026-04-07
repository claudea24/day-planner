"use client";

import Link from "next/link";
import { usePlanner } from "@/context/PlannerContext";
import {
  getWeekDates,
  getTodayString,
  getDayLabel,
  formatTime,
} from "@/lib/utils";

const START_HOUR = 6;
const END_HOUR = 22;
const HOUR_HEIGHT = 48;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i
);

const categoryBorder: Record<string, string> = {
  work: "border-l-blue-500 bg-blue-50 text-blue-800",
  personal: "border-l-purple-500 bg-purple-50 text-purple-800",
  health: "border-l-green-500 bg-green-50 text-green-800",
  other: "border-l-gray-500 bg-gray-50 text-gray-800",
};

export default function WeekCalendar({
  weekStart,
}: {
  weekStart?: string;
}) {
  const { tasks, events } = usePlanner();
  const weekDates = getWeekDates(weekStart);
  const today = getTodayString();
  const totalHeight = HOURS.length * HOUR_HEIGHT;

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white">
      {/* Sticky day headers */}
      <div className="sticky top-0 z-20 flex border-b border-slate-200 bg-white">
        <div className="w-14 flex-shrink-0 border-r border-slate-100" />
        {weekDates.map((date) => {
          const isToday = date === today;
          const dayNum = new Date(date + "T00:00:00").getDate();
          const dayTasks = tasks.filter(
            (t) => t.assignedDate === date && t.priority === "P0"
          );

          return (
            <div
              key={date}
              className={`flex-1 border-l border-slate-100 px-1 py-2 ${
                isToday ? "bg-blue-50/50" : ""
              }`}
            >
              <Link
                href={`/day/${date}`}
                className="flex flex-col items-center gap-0.5 hover:opacity-80"
              >
                <span className="text-[10px] font-medium uppercase text-slate-400">
                  {getDayLabel(date)}
                </span>
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    isToday
                      ? "bg-blue-600 text-white"
                      : "text-slate-700"
                  }`}
                >
                  {dayNum}
                </span>
              </Link>

              {dayTasks.length > 0 && (
                <div className="mt-1 flex flex-col gap-0.5 px-0.5">
                  {dayTasks.slice(0, 2).map((task) => (
                    <Link
                      key={task.id}
                      href={`/day/${date}`}
                      className={`flex items-center gap-1 rounded px-1 py-0.5 text-[10px] hover:opacity-80 ${
                        task.completed
                          ? "text-slate-400 line-through"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      <div className="h-1 w-1 flex-shrink-0 rounded-full bg-red-500" />
                      <span className="truncate">{task.title}</span>
                    </Link>
                  ))}
                  {dayTasks.length > 2 && (
                    <span className="px-1 text-[10px] text-slate-400">
                      +{dayTasks.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
        <div className="flex">
          {/* Time labels */}
          <div className="w-14 flex-shrink-0 border-r border-slate-100">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex items-start justify-end pr-2 pt-0.5"
                style={{ height: HOUR_HEIGHT }}
              >
                <span className="text-[10px] text-slate-400">
                  {formatTime(`${hour.toString().padStart(2, "0")}:00`)}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDates.map((date) => {
            const dayEvents = events
              .filter((e) => e.date === date)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));
            const isToday = date === today;

            return (
              <div
                key={date}
                className={`relative flex-1 border-l border-slate-100 ${
                  isToday ? "bg-blue-50/20" : ""
                }`}
                style={{ height: totalHeight }}
              >
                {/* Hour lines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-b border-slate-100"
                    style={{
                      top: (hour - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT,
                    }}
                  />
                ))}

                {/* Events — clickable to day view */}
                {dayEvents.map((event) => {
                  const [startH, startM] = event.startTime
                    .split(":")
                    .map(Number);
                  const [endH, endM] = event.endTime.split(":").map(Number);
                  const startMin = startH * 60 + startM;
                  const endMin = endH * 60 + endM;
                  const gridStart = START_HOUR * 60;

                  const top = ((startMin - gridStart) / 60) * HOUR_HEIGHT;
                  const height = Math.max(
                    ((endMin - startMin) / 60) * HOUR_HEIGHT,
                    20
                  );

                  return (
                    <Link
                      key={event.id}
                      href={`/day/${date}`}
                      className={`absolute left-0.5 right-0.5 overflow-hidden truncate rounded border-l-2 px-1 py-0.5 text-[10px] font-medium transition-opacity hover:opacity-80 ${categoryBorder[event.category]}`}
                      style={{ top, height, zIndex: 10 }}
                      title={`${formatTime(event.startTime)} – ${formatTime(event.endTime)}: ${event.title}`}
                    >
                      {event.title}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
