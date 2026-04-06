"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEvents } from "@/context/EventContext";
import { PlannerEvent } from "@/lib/types";
import { getTodayString } from "@/lib/utils";

const categories: PlannerEvent["category"][] = [
  "work",
  "personal",
  "health",
  "other",
];

export default function EventForm({ defaultDate }: { defaultDate?: string }) {
  const router = useRouter();
  const { dispatch } = useEvents();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate || getTodayString());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [category, setCategory] = useState<PlannerEvent["category"]>("work");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (endTime <= startTime) {
      setError("End time must be after start time");
      return;
    }

    const event: PlannerEvent = {
      id: crypto.randomUUID(),
      title: title.trim(),
      date,
      startTime,
      endTime,
      category,
      description: description.trim() || undefined,
    };

    dispatch({ type: "ADD_EVENT", payload: event });
    router.push(`/day/${date}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Event Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Team standup, Lunch with Alex..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="date"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="startTime"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Start Time
          </label>
          <input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="endTime"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            End Time
          </label>
          <input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as PlannerEvent["category"])
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Description{" "}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Add details about this event..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create Event
      </button>
    </form>
  );
}
