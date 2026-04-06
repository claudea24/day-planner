"use client";

import { getWeekDates, formatDate } from "@/lib/utils";
import WeekGrid from "@/components/WeekGrid";

export default function WeekPage() {
  const weekDates = getWeekDates();
  const startDate = formatDate(weekDates[0]);
  const endDate = formatDate(weekDates[6]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">This Week</h1>
        <p className="mt-1 text-slate-500">
          {startDate} &ndash; {endDate}
        </p>
      </div>

      <WeekGrid />
    </div>
  );
}
