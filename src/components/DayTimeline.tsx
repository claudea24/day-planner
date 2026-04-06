"use client";

import { PlannerEvent } from "@/lib/types";
import EventCard from "./EventCard";

export default function DayTimeline({ events }: { events: PlannerEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
        <p className="text-slate-400">No events scheduled</p>
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
