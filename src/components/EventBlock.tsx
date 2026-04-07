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
  onExpand,
}: {
  event: ScheduleEvent;
  compact?: boolean;
  onClose?: () => void;
  onExpand?: () => void;
}) {
  const { dispatch } = usePlanner();
  const parentControlled = !!(onClose || onExpand);
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = parentControlled ? !!onClose : internalExpanded;
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(event.notes || "");

  // Inline editable fields
  const [editingTime, setEditingTime] = useState(false);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);
  const [editingLocation, setEditingLocation] = useState(false);
  const [location, setLocation] = useState(event.location || "");
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(event.title);

  function saveNotes() {
    dispatch({
      type: "UPDATE_EVENT",
      payload: { id: event.id, notes: notes.trim() || undefined },
    });
    setEditingNotes(false);
  }

  function saveTime() {
    if (startTime && endTime && endTime > startTime) {
      dispatch({
        type: "UPDATE_EVENT",
        payload: { id: event.id, startTime, endTime },
      });
    } else {
      setStartTime(event.startTime);
      setEndTime(event.endTime);
    }
    setEditingTime(false);
  }

  function saveLocation() {
    dispatch({
      type: "UPDATE_EVENT",
      payload: { id: event.id, location: location.trim() || undefined },
    });
    setEditingLocation(false);
  }

  function saveTitle() {
    const trimmed = title.trim();
    if (trimmed) {
      dispatch({
        type: "UPDATE_EVENT",
        payload: { id: event.id, title: trimmed },
      });
    } else {
      setTitle(event.title);
    }
    setEditingTitle(false);
  }

  if (compact) {
    return (
      <div
        className={`truncate rounded border-l-2 px-1.5 py-0.5 text-xs ${categoryBorder[event.category]} ${categoryBg[event.category]}`}
        title={`${formatTime(event.startTime)} ${event.title}${event.location ? ` @ ${event.location}` : ""}`}
      >
        <span className="font-medium">{event.title}</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        if (parentControlled) {
          if (expanded && onClose) onClose();
          else if (!expanded && onExpand) onExpand();
        } else {
          setInternalExpanded(!internalExpanded);
        }
      }}
      className={`cursor-pointer rounded-lg border-l-4 px-4 py-3 shadow-md transition-all hover:shadow-lg ${expanded ? "shadow-xl ring-1 ring-slate-200" : ""} ${categoryBorder[event.category]} ${categoryBg[event.category]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {/* Title — click to edit */}
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 flex-shrink-0 rounded-full ${getCategoryDot(event.category)}`}
            />
            {editingTitle && expanded ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitle();
                  if (e.key === "Escape") { setTitle(event.title); setEditingTitle(false); }
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                className="w-full border-none bg-transparent text-base font-semibold text-slate-900 outline-none"
              />
            ) : (
              <span
                className="truncate text-base font-semibold text-slate-900"
                onClick={(e) => {
                  if (expanded) { e.stopPropagation(); setEditingTitle(true); }
                }}
              >
                {event.title}
              </span>
            )}
          </div>

          {/* Time — click to edit */}
          {editingTime && expanded ? (
            <div
              className="ml-4 mt-1 flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="rounded border border-slate-200 px-1 py-0.5 text-xs"
              />
              <span className="text-xs text-slate-400">–</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="rounded border border-slate-200 px-1 py-0.5 text-xs"
              />
              <button
                onClick={saveTime}
                className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] text-white hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => { setStartTime(event.startTime); setEndTime(event.endTime); setEditingTime(false); }}
                className="text-[10px] text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p
              className="ml-4 text-sm text-slate-500 hover:text-blue-600"
              onClick={(e) => {
                if (expanded) { e.stopPropagation(); setEditingTime(true); }
              }}
            >
              {formatTime(event.startTime)} – {formatTime(event.endTime)}
            </p>

          )}

          {/* Location — shown when expanded or when set */}
          {(event.location || expanded) && !editingLocation && (
            <p
              className="ml-4 mt-0.5 flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600"
              onClick={(e) => {
                if (expanded) { e.stopPropagation(); setEditingLocation(true); }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {event.location || (expanded ? "Add location" : "")}
            </p>
          )}
          {editingLocation && expanded && (
            <div
              className="ml-4 mt-0.5 flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onBlur={saveLocation}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveLocation();
                  if (e.key === "Escape") { setLocation(event.location || ""); setEditingLocation(false); }
                }}
                autoFocus
                placeholder="Enter location..."
                className="w-full border-none bg-transparent text-xs text-slate-700 outline-none placeholder-slate-400"
              />
            </div>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center gap-1">
          {/* Close (X) — collapses the expanded view */}
          {expanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onClose) onClose();
                else setInternalExpanded(false);
              }}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              aria-label="Close"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          {/* Delete (trash) — removes the event */}
          {expanded && (
            <button
              onClick={(e) => { e.stopPropagation(); dispatch({ type: "DELETE_EVENT", payload: { id: event.id } }); }}
              className="flex-shrink-0 rounded p-0.5 text-slate-300 hover:bg-red-100 hover:text-red-500"
              aria-label="Delete event"
              title="Delete event"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-2 ml-4 space-y-2" onClick={(e) => e.stopPropagation()}>
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
                  <button onClick={saveNotes} className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white hover:bg-blue-700">Save</button>
                  <button onClick={() => { setNotes(event.notes || ""); setEditingNotes(false); }} className="rounded px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                {event.notes ? (
                  <p className="whitespace-pre-wrap text-xs text-slate-600">{event.notes}</p>
                ) : (
                  <p className="text-xs italic text-slate-400">No notes</p>
                )}
                <button onClick={() => setEditingNotes(true)} className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                  {event.notes ? "Edit notes" : "Add notes"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
