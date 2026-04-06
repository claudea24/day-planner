"use client";

import { useState } from "react";
import { ScheduleEvent } from "@/lib/types";
import { formatTime, getCategoryColor, getCategoryDot } from "@/lib/utils";
import { usePlanner } from "@/context/PlannerContext";

function EventCard({ event }: { event: ScheduleEvent }) {
  const { dispatch } = usePlanner();
  const [showNotes, setShowNotes] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  async function handleSummarize() {
    if (!event.notes) return;
    setSummarizing(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: event.notes }),
      });
      if (res.ok) {
        const { summary } = await res.json();
        dispatch({
          type: "UPDATE_EVENT",
          payload: { id: event.id, notesSummary: summary },
        });
      }
    } catch {
      // silently fail
    } finally {
      setSummarizing(false);
    }
  }

  return (
    <div className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <div
          className={`h-2.5 w-2.5 rounded-full ${getCategoryDot(event.category)}`}
        />
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
                dispatch({
                  type: "DELETE_EVENT",
                  payload: { id: event.id },
                })
              }
              className="rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
              aria-label="Delete event"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {event.notes && (
          <div className="mt-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              {showNotes ? "Hide notes" : "Show notes"}
            </button>
            {showNotes && (
              <div className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                <p className="whitespace-pre-wrap">{event.notes}</p>
                {event.notesSummary && (
                  <div className="mt-2 border-t border-slate-200 pt-2">
                    <p className="text-xs font-medium text-slate-500">
                      AI Summary
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {event.notesSummary}
                    </p>
                  </div>
                )}
                <button
                  onClick={handleSummarize}
                  disabled={summarizing}
                  className="mt-2 rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300 disabled:opacity-50"
                >
                  {summarizing
                    ? "Summarizing..."
                    : event.notesSummary
                      ? "Re-summarize"
                      : "Summarize with AI"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScheduleTimeline({
  events,
}: {
  events: ScheduleEvent[];
}) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
        No events scheduled
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
