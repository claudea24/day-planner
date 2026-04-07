"use client";

import { ScheduleEvent } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import EventBlock from "./EventBlock";

const START_HOUR = 6;
const END_HOUR = 22;
const HOUR_HEIGHT = 64;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i
);

function getEventPosition(event: ScheduleEvent) {
  const [startH, startM] = event.startTime.split(":").map(Number);
  const [endH, endM] = event.endTime.split(":").map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const gridStartMinutes = START_HOUR * 60;

  const top = ((startMinutes - gridStartMinutes) / 60) * HOUR_HEIGHT;
  const height = Math.max(
    ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT,
    28
  );

  return { top, height };
}

export default function HourGrid({
  events,
  date,
}: {
  events: ScheduleEvent[];
  date?: string;
}) {
  const totalHeight = HOURS.length * HOUR_HEIGHT;

  return (
    <div className="overflow-y-auto rounded-lg border border-slate-200 bg-white" style={{ maxHeight: "calc(100vh - 320px)" }}>
      <div className="flex">
        {/* Time labels column */}
        <div className="sticky left-0 w-16 flex-shrink-0 border-r border-slate-100 bg-white">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="flex items-start justify-end border-b border-slate-50 pr-2 pt-1"
              style={{ height: HOUR_HEIGHT }}
            >
              <span className="text-xs text-slate-400">
                {formatTime(`${hour.toString().padStart(2, "0")}:00`)}
              </span>
            </div>
          ))}
        </div>

        {/* Events area */}
        <div className="relative flex-1" style={{ height: totalHeight }}>
          {/* Hour lines */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="absolute left-0 right-0 border-b border-slate-50"
              style={{ top: (hour - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT }}
            />
          ))}

          {/* Half-hour lines */}
          {HOURS.map((hour) => (
            <div
              key={`half-${hour}`}
              className="absolute left-0 right-0 border-b border-dashed border-slate-50"
              style={{
                top: (hour - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2,
              }}
            />
          ))}

          {/* Event blocks — clickable to expand */}
          {events.map((event) => {
            const { top, height } = getEventPosition(event);
            return (
              <div
                key={event.id}
                className="absolute left-1 right-2"
                style={{ top, height, minHeight: 28, zIndex: 10 }}
              >
                <EventBlock event={event} />
              </div>
            );
          })}

          {/* Empty state */}
          {events.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-300">
                {date ? (
                  <a
                    href={`/add?tab=event&date=${date}`}
                    className="hover:text-blue-400"
                  >
                    Click + Add Event to schedule something
                  </a>
                ) : (
                  "No events"
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
