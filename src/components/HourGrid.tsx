"use client";

import { ScheduleEvent } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { usePlanner } from "@/context/PlannerContext";
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
  const { dispatch } = usePlanner();
  const totalHeight = HOURS.length * HOUR_HEIGHT;

  function handleGridClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!date) return;
    // Only create if clicking empty space (not on an event)
    if ((e.target as HTMLElement).closest("[data-event-block]")) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top + e.currentTarget.scrollTop;
    const minutes = Math.floor((y / HOUR_HEIGHT) * 60) + START_HOUR * 60;
    const hour = Math.floor(minutes / 60);
    const min = Math.round((minutes % 60) / 15) * 15;
    const startTime = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
    const endHour = min + 60 >= 60 ? hour + 1 : hour;
    const endMin = (min + 60) % 60;
    const endTime = `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;

    dispatch({
      type: "ADD_EVENT",
      payload: {
        id: crypto.randomUUID(),
        type: "event",
        title: "New Event",
        date,
        startTime,
        endTime,
        category: "work",
      },
    });
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
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

        {/* Events area — click empty space to create */}
        <div
          className="relative flex-1 cursor-crosshair"
          style={{ height: totalHeight }}
          onClick={handleGridClick}
        >
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

          {/* Event blocks */}
          {events.map((event) => {
            const { top, height } = getEventPosition(event);
            return (
              <div
                key={event.id}
                data-event-block
                className="absolute left-1 right-2"
                style={{ top, height, minHeight: 28, zIndex: 10 }}
              >
                <EventBlock event={event} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
