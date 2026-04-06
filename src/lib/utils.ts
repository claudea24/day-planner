import { PlannerEvent } from "./types";

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

export function getCategoryColor(category: PlannerEvent["category"]): string {
  const colors = {
    work: "bg-blue-100 text-blue-800 border-blue-200",
    personal: "bg-purple-100 text-purple-800 border-purple-200",
    health: "bg-green-100 text-green-800 border-green-200",
    other: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return colors[category];
}

export function getCategoryDot(category: PlannerEvent["category"]): string {
  const colors = {
    work: "bg-blue-500",
    personal: "bg-purple-500",
    health: "bg-green-500",
    other: "bg-gray-500",
  };
  return colors[category];
}

const today = getTodayString();
const tomorrow = getAdjacentDate(today, 1);
const yesterday = getAdjacentDate(today, -1);

export const seedEvents: PlannerEvent[] = [
  {
    id: "seed-1",
    title: "Morning Run",
    date: today,
    startTime: "07:00",
    endTime: "08:00",
    category: "health",
    description: "5K jog around the park",
  },
  {
    id: "seed-2",
    title: "Team Standup",
    date: today,
    startTime: "09:30",
    endTime: "10:00",
    category: "work",
    description: "Daily sync with engineering team",
  },
  {
    id: "seed-3",
    title: "Lunch with Alex",
    date: today,
    startTime: "12:00",
    endTime: "13:00",
    category: "personal",
  },
  {
    id: "seed-4",
    title: "Project Review",
    date: tomorrow,
    startTime: "14:00",
    endTime: "15:30",
    category: "work",
    description: "Q2 milestone review with stakeholders",
  },
  {
    id: "seed-5",
    title: "Yoga Class",
    date: yesterday,
    startTime: "18:00",
    endTime: "19:00",
    category: "health",
    description: "Beginner vinyasa flow",
  },
];
