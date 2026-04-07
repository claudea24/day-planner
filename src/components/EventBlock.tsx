"use client";

import { useState } from "react";
import { ScheduleEvent } from "@/lib/types";
import { formatTime, getCategoryDot } from "@/lib/utils";
import { usePlanner } from "@/context/PlannerContext";

const categoryBorder: Record<string, string> = {
  work: "border-l-blue-500",
  personal: "border-l-purple-500",
  health: "border-l-green-500",
  other: "border-l-gray-500",
};

const categoryBg: Record<string, string> = {
  work: "bg-blue-50 hover:bg-blue-100",
  personal: "bg-purple-50 hover:bg-purple-100",
  health: "bg-green-50 hover:bg-green-100",
  other: "bg-gray-50 hover:bg-gray-100",
};

export default function EventBlock({
  event,
  compact = false,
  onClose,
}: {
  event: ScheduleEvent;
  compact?: boolean;
  onClose?: () => void;
}) {
  const { dispatch } = usePlanner();
  const [expanded, setExpanded] = useState(onClose ? true : false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(event.notes || "");
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

  function saveNotes() {
    dispatch({
      type: "UPDATE_EVENT",
      payload: { id: event.id, notes: notes.trim() || undefined },
    });
    setEditingNotes(false);
  }

  if (compact) {
    return (
      <div
        className={`truncate rounded border-l-2 px-1.5 py-0.5 text-xs ${categoryBorder[event.category]} ${categoryBg[event.category]}`}
        title={`${formatTime(event.startTime)} ${event.title}`}
      >
        <span className="font-medium">{event.title}</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        if (onClose && expanded) return;
        setExpanded(!expanded);
      }}
      className={`cursor-pointer rounded-lg border-l-4 px-3 py-2 shadow-sm transition-colors ${categoryBorder[event.category]} ${categoryBg[event.category]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 flex-shrink-0 rounded-full ${getCategoryDot(event.category)}`}
            />
            <span className="truncate text-sm font-semibold text-slate-900">
              {event.title}
            </span>
          </div>
          <p className="ml-4 text-xs text-slate-500">
            {formatTime(event.startTime)} – {formatTime(event.endTime)}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "DELETE_EVENT", payload: { id: event.id } });
            }}
            className="flex-shrink-0 rounded p-0.5 text-slate-300 hover:bg-red-100 hover:text-red-500"
            aria-label="Delete event"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
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

      {expanded && (
        <div
          className="mt-2 ml-4 space-y-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Notes */}
          <div className="rounded-md bg-white/60 p-2">
            {editingNotes ? (
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded border border-slate-200 px-2 py-1 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
                  placeholder="Add notes..."
                />
                <div className="mt-1 flex gap-1">
                  <button
                    onClick={saveNotes}
                    className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setNotes(event.notes || "");
                      setEditingNotes(false);
                    }}
                    className="rounded px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {event.notes ? (
                  <p className="whitespace-pre-wrap text-xs text-slate-600">
                    {event.notes}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400">No notes</p>
                )}
                <button
                  onClick={() => setEditingNotes(true)}
                  className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  {event.notes ? "Edit notes" : "Add notes"}
                </button>
              </div>
            )}
          </div>

          {/* AI Summary */}
          {event.notesSummary && (
            <div className="rounded-md bg-white/60 p-2">
              <p className="text-xs font-medium text-slate-500">AI Summary</p>
              <p className="mt-0.5 text-xs text-slate-700">
                {event.notesSummary}
              </p>
            </div>
          )}

          {event.notes && (
            <button
              onClick={handleSummarize}
              disabled={summarizing}
              className="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 disabled:opacity-50"
            >
              {summarizing
                ? "Summarizing..."
                : event.notesSummary
                  ? "Re-summarize"
                  : "Summarize with AI"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
