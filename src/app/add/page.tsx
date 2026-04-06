"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import EventForm from "@/components/EventForm";

function AddEventContent() {
  const searchParams = useSearchParams();
  const defaultDate = searchParams.get("date") || undefined;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Add Event</h1>
        <p className="mt-1 text-slate-500">
          Create a new event for your schedule
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <EventForm defaultDate={defaultDate} />
      </div>
    </div>
  );
}

export default function AddPage() {
  return (
    <Suspense>
      <AddEventContent />
    </Suspense>
  );
}
