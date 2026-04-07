"use client";

import Link from "next/link";
import { usePlanner } from "@/context/PlannerContext";
import {
  getWeekDates,
  getTodayString,
  getDayLabel,
  formatTime,
  getCategoryDot,
} from "@/lib/utils";
import EventBlock from "./EventBlock";

const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_HEIGHT = 48;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i
);

export default function WeekCalendar() {
  const { tasks, events } = usePlanner();
  const weekDates = getWeekDates();
  const today = getTodayString();
  const totalHeight = HOURS.length * HOUR_HEIGHT;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Day headers */}
        <div className="flex border-b border-slate-200">
          <div className="w-16 flex-shrink-0" />
          {weekDates.map((date) => {
            const isToday = date === today;
            const dayNum = new Date(date + "T00:00:00").getDate();
            const dayTasks = tasks.filter(
              (t) => t.assignedDate === date && t.priority === "P0"
            );

            return (
              <div
                key={date}
                className="flex-1 border-l border-slate-100 px-1 pb-2 pt-2"
              >
                <Link
                  href={`/day/${date}`}
                  className="flex flex-col items-center gap-0.5 hover:opacity-80"
                >
                  <span className="text-xs font-medium uppercase text-slate-400">
                    {getDayLabel(date)}
                  </span>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      isToday
                        ? "bg-blue-600 text-white"
                        : "text-slate-700"
                    }`}
                  >
                    {dayNum}
                  </span>
                </Link>

                {/* Compact task list under header */}
                {dayTasks.length > 0 && (
                  <div className="mt-1 flex flex-col gap-0.5 px-0.5">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-1 rounded px-1 py-0.5 text-xs ${
                          task.completed
                            ? "text-slate-400 line-through"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                        <span className="truncate">{task.title}</span>
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="px-1 text-xs text-slate-400">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="flex">
          {/* Time labels */}
          <div className="w-16 flex-shrink-0">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex items-start justify-end pr-2 pt-0.5"
                style={{ height: HOUR_HEIGHT }}
              >
                <span className="text-xs text-slate-400">
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
                className={`relative flex-1 border-l ${
                  isToday ? "bg-blue-50/30" : ""
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

                {/* Events */}
                {dayEvents.map((event) => {
                  const [startH, startM] = event.startTime
                    .split(":")
                    .map(Number);
                  const [endH, endM] = event.endTime.split(":").map(Number);
                  const startMin = startH * 60 + startM;
                  const endMin = endH * 60 + endM;
                  const gridStart = START_HOUR * 60;

                  const top =
                    ((startMin - gridStart) / 60) * HOUR_HEIGHT;
                  const height = Math.max(
                    ((endMin - startMin) / 60) * HOUR_HEIGHT,
                    22
                  );

                  return (
                    <div
                      key={event.id}
                      className="absolute left-0.5 right-0.5"
                      style={{ top, height, zIndex: 10 }}
                    >
                      <EventBlock event={event} compact />
                    </div>
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
