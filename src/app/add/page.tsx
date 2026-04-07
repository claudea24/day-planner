"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import EventForm from "@/components/EventForm";

function AddItemContent() {
  const searchParams = useSearchParams();
  const defaultDate = searchParams.get("date") || undefined;
  const defaultTab = searchParams.get("tab") === "event" ? "event" : "task";
  const [activeTab, setActiveTab] = useState<"task" | "event">(defaultTab);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Add Item</h1>
        <p className="mt-1 text-slate-500">
          Create a task to prioritize or an event to schedule
        </p>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg bg-slate-100 p-1">
        <button
          onClick={() => setActiveTab("task")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "task"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Task
        </button>
        <button
          onClick={() => setActiveTab("event")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "event"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Event
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {activeTab === "task" ? (
          <TaskForm defaultDate={defaultDate} />
        ) : (
          <EventForm defaultDate={defaultDate} />
        )}
      </div>
    </div>
  );
}

export default function AddPage() {
  return (
    <Suspense>
      <AddItemContent />
    </Suspense>
  );
}
