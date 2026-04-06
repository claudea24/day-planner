"use client";

import { PlannerEvent } from "@/lib/types";
import { formatTime, getCategoryColor, getCategoryDot } from "@/lib/utils";
import { useEvents } from "@/context/EventContext";

export default function EventCard({ event }: { event: PlannerEvent }) {
  const { dispatch } = useEvents();

  return (
    <div className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <div className={`h-2.5 w-2.5 rounded-full ${getCategoryDot(event.category)}`} />
        <div className="w-px flex-1 bg-slate-200" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-slate-900">{event.title}</h3>
            <p className="text-sm text-slate-500">
              {formatTime(event.startTime)} – {formatTime(event.endTime)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(event.category)}`}
            >
              {event.category}
            </span>
            <button
              onClick={() =>
                dispatch({ type: "DELETE_EVENT", payload: { id: event.id } })
              }
              className="rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
              aria-label="Delete event"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        {event.description && (
          <p className="mt-1 text-sm text-slate-500">{event.description}</p>
        )}
      </div>
    </div>
  );
}
