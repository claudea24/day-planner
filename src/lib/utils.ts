import { Task, ScheduleEvent } from "./types";

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getAdjacentDate(dateStr: string, offset: number): string {
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display}:${m} ${ampm}`;
}

export function getWeekDates(referenceDate?: string): string[] {
  const ref = referenceDate
    ? new Date(referenceDate + "T00:00:00")
    : new Date();
  const day = ref.getDay();
  const monday = new Date(ref);
  monday.setDate(ref.getDate() - ((day + 6) % 7));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

export function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function getCategoryColor(
  category: "work" | "personal" | "health" | "other"
): string {
  const colors = {
    work: "bg-blue-100 text-blue-800 border-blue-200",
    personal: "bg-purple-100 text-purple-800 border-purple-200",
    health: "bg-green-100 text-green-800 border-green-200",
    other: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return colors[category];
}

export function getCategoryDot(
  category: "work" | "personal" | "health" | "other"
): string {
  const colors = {
    work: "bg-blue-500",
    personal: "bg-purple-500",
    health: "bg-green-500",
    other: "bg-gray-500",
  };
  return colors[category];
}

export function getPriorityColor(priority: "P0" | "P1" | "P2"): string {
  const colors = {
    P0: "bg-red-100 text-red-800 border-red-200",
    P1: "bg-amber-100 text-amber-800 border-amber-200",
    P2: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return colors[priority];
}

export function getPriorityDot(priority: "P0" | "P1" | "P2"): string {
  const colors = {
    P0: "bg-red-500",
    P1: "bg-amber-500",
    P2: "bg-slate-400",
  };
  return colors[priority];
}

export function cyclePriority(
  current: "P0" | "P1" | "P2"
): "P0" | "P1" | "P2" {
  const order: ("P0" | "P1" | "P2")[] = ["P0", "P1", "P2"];
  return order[(order.indexOf(current) + 1) % 3];
}

const today = getTodayString();
const weekDates = getWeekDates(today);

export const seedTasks: Task[] = [
  {
    id: "task-1",
    type: "task",
    title: "Ship auth API endpoint",
    priority: "P0",
    category: "work",
    assignedDate: weekDates[0],
    description: "Finish the /auth/login and /auth/refresh endpoints",
    completed: false,
  },
  {
    id: "task-2",
    type: "task",
    title: "Fix dashboard loading bug",
    priority: "P0",
    category: "work",
    assignedDate: weekDates[1],
    completed: false,
  },
  {
    id: "task-3",
    type: "task",
    title: "Write blog post",
    priority: "P1",
    category: "personal",
    description: "Draft the post about weekend hiking trip",
    completed: false,
  },
  {
    id: "task-4",
    type: "task",
    title: "Book dentist appointment",
    priority: "P1",
    category: "health",
    completed: false,
  },
  {
    id: "task-5",
    type: "task",
    title: "Update project README",
    priority: "P2",
    category: "work",
    completed: false,
  },
  {
    id: "task-6",
    type: "task",
    title: "Organize photo library",
    priority: "P2",
    category: "personal",
    completed: false,
  },
];

export const seedEvents: ScheduleEvent[] = [
  {
    id: "event-1",
    type: "event",
    title: "Team Standup",
    date: today,
    startTime: "09:30",
    endTime: "10:00",
    category: "work",
    notes: "Discuss sprint progress, blockers on auth API, and review deployment timeline for next week.",
  },
  {
    id: "event-2",
    type: "event",
    title: "Lunch with Alex",
    date: today,
    startTime: "12:00",
    endTime: "13:00",
    category: "personal",
  },
  {
    id: "event-3",
    type: "event",
    title: "Project Review",
    date: weekDates[2] || today,
    startTime: "14:00",
    endTime: "15:30",
    category: "work",
    notes: "Q2 milestone review with stakeholders. Prepare slides covering: auth system progress, performance improvements, and user feedback summary. Key decision: whether to delay mobile launch by 2 weeks.",
  },
  {
    id: "event-4",
    type: "event",
    title: "Yoga Class",
    date: weekDates[3] || today,
    startTime: "18:00",
    endTime: "19:00",
    category: "health",
  },
];
