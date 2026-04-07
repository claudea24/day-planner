"use client";

import Link from "next/link";
import { useState } from "react";
import { usePlanner } from "@/context/PlannerContext";
import { Task } from "@/lib/types";
import {
  getWeekDates,
  getTodayString,
  getDayLabel,
  getMondayOfWeek,
  formatTime,
  getPriorityColor,
} from "@/lib/utils";
import EventBlock from "./EventBlock";

const START_HOUR = 6;
const END_HOUR = 22;
const HOUR_HEIGHT = 60;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i
);

export default function WeekCalendar({
  weekStart,
}: {
  weekStart?: string;
}) {
  const { tasks, events, dispatch } = usePlanner();
  const weekDates = getWeekDates(weekStart);
  const today = getTodayString();
  const monday = getMondayOfWeek(weekStart);
  const totalHeight = HOURS.length * HOUR_HEIGHT;

  // All tasks for this week
  const weekTasks = tasks.filter((t) => t.week === monday);

  return (
    <div className="flex h-full flex-col border-t border-slate-200 bg-white">
      {/* Sticky day headers with tasks */}
      <div className="flex border-b border-slate-200 bg-white">
        <div className="w-16 flex-shrink-0 border-r border-slate-100" />
        {weekDates.map((date) => {
          const isToday = date === today;
          const dayNum = new Date(date + "T00:00:00").getDate();
          const dayTasks = weekTasks.filter(
            (t) => t.assignedDate === date
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
                  {dayTasks.map((task) => (
                    <TaskCheckbox key={task.id} task={task} dispatch={dispatch} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex">
          {/* Time labels */}
          <div className="w-16 flex-shrink-0 border-r border-slate-100">
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
              <DayColumn
                key={date}
                date={date}
                dayEvents={dayEvents}
                isToday={isToday}
                totalHeight={totalHeight}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DayColumn({
  date,
  dayEvents,
  isToday,
  totalHeight,
}: {
  date: string;
  dayEvents: ReturnType<typeof import("@/context/PlannerContext").usePlanner>["events"];
  isToday: boolean;
  totalHeight: number;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div
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

      {/* Events — clickable to expand inline */}
      {dayEvents.map((event) => {
        const [startH, startM] = event.startTime.split(":").map(Number);
        const [endH, endM] = event.endTime.split(":").map(Number);
        const startMin = startH * 60 + startM;
        const endMin = endH * 60 + endM;
        const gridStart = START_HOUR * 60;

        const top = ((startMin - gridStart) / 60) * HOUR_HEIGHT;
        const height = Math.max(
          ((endMin - startMin) / 60) * HOUR_HEIGHT,
          24
        );
        const isExpanded = expandedId === event.id;

        return (
          <div
            key={event.id}
            className="absolute left-0.5 right-0.5"
            style={{
              top,
              height: isExpanded ? "auto" : height,
              minHeight: height,
              zIndex: isExpanded ? 30 : 10,
            }}
          >
            {isExpanded ? (
              <EventBlock
                event={event}
                onClose={() => setExpandedId(null)}
              />
            ) : (
              <CompactEvent
                event={event}
                height={height}
                onClick={() => setExpandedId(event.id)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TaskCheckbox({
  task,
  dispatch,
}: {
  task: Task;
  dispatch: React.Dispatch<import("@/lib/types").PlannerAction>;
}) {
  return (
    <label
      className={`flex items-center gap-1 rounded px-1 py-0.5 text-[10px] cursor-pointer transition-colors hover:bg-slate-100 ${
        task.completed ? "opacity-50" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() =>
          dispatch({
            type: "UPDATE_TASK",
            payload: { id: task.id, completed: !task.completed },
          })
        }
        className="h-3 w-3 flex-shrink-0 rounded border-slate-300 text-blue-600 focus:ring-0"
      />
      <span
        className={`truncate ${
          task.completed
            ? "text-slate-400 line-through"
            : "text-slate-700"
        }`}
      >
        {task.title}
      </span>
      <span
        className={`ml-auto flex-shrink-0 rounded px-1 text-[8px] font-bold ${getPriorityColor(task.priority)}`}
      >
        {task.priority}
      </span>
    </label>
  );
}

const categoryStyles: Record<string, string> = {
  work: "border-l-blue-500 bg-blue-50 text-blue-800 hover:bg-blue-100",
  personal: "border-l-purple-500 bg-purple-50 text-purple-800 hover:bg-purple-100",
  health: "border-l-green-500 bg-green-50 text-green-800 hover:bg-green-100",
  other: "border-l-gray-500 bg-gray-50 text-gray-800 hover:bg-gray-100",
};

function CompactEvent({
  event,
  height,
  onClick,
}: {
  event: { id: string; title: string; startTime: string; category: string };
  height: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-full w-full cursor-pointer overflow-hidden truncate rounded border-l-2 px-1.5 py-0.5 text-left text-[11px] font-medium transition-colors ${categoryStyles[event.category]}`}
    >
      {height > 30 && (
        <span className="block text-[9px] font-normal opacity-70">
          {formatTime(event.startTime)}
        </span>
      )}
      {event.title}
    </button>
  );
}
