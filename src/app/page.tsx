"use client";

import Link from "next/link";
import { useTasksByPriority } from "@/context/PlannerContext";
import PrioritySection from "@/components/PrioritySection";

export default function Home() {
  const { P0, P1, P2 } = useTasksByPriority();

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Weekly Inbox</h1>
          <p className="mt-1 text-slate-500">
            Prioritize your tasks, then assign P0s to specific days
          </p>
        </div>
        <Link
          href="/add"
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Add Item
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        <PrioritySection priority="P0" tasks={P0} />
        <PrioritySection priority="P1" tasks={P1} />
        <PrioritySection priority="P2" tasks={P2} />
      </div>
    </div>
  );
}
